import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, RotateCw, Smartphone, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendOtpEmail } from '../../utils/emailService';

export const OtpVerificationModal = ({
  isOpen,
  onClose,
  sellerData,
  onApplicationSubmitted,
}) => {
  const { submitSellerApplication } = useAuth();
  // Default OTP for testing — replace with random generation once EmailJS is live
  const generateOtp = () => '111111';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(true);

  const inputRefs = useRef([]);

  const sendCode = async (code) => {
    setIsSending(true);
    const result = await sendOtpEmail({
      toEmail:   sellerData?.personalEmail || sellerData?.email || '',
      toName:    sellerData?.ownerName || 'Seller',
      storeName: sellerData?.storeName || 'Your Stall',
      otpCode:   code,
    });
    setIsSending(false);
    if (result.success) {
      setEmailSent(true);
      setEmailConfigured(true);
    } else if (result.error === 'email_not_configured') {
      setEmailConfigured(false);
      setEmailSent(false);
    } else {
      // Transient send error — still allow user to proceed (code is in memory)
      setEmailSent(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      setEmailSent(false);
      setCurrentCode('');
      return;
    }

    const code = generateOtp();
    setCurrentCode(code);
    setTimer(300);
    sendCode(code);

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (index, value) => {
    const digit = value.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    const code = generateOtp();
    setCurrentCode(code);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(300);
    setEmailSent(false);
    inputRefs.current[0]?.focus();
    await sendCode(code);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    if (timer === 0) {
      setError('Code expired. Please resend OTP and try again.');
      return;
    }
    if (entered !== currentCode) {
      setError('Incorrect OTP. Please check your email and try again.');
      return;
    }

    submitSellerApplication(sellerData);
    setIsSubmitted(true);
    if (onApplicationSubmitted) {
      onApplicationSubmitted();
    }
  };

  const targetEmail = sellerData?.personalEmail || sellerData?.email || '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Smartphone size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Email Verification</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Step 2 of 2: Confirm your email via OTP</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleVerifyOtp} className="modal-body" style={{ textAlign: 'center' }}>

            {/* Sent-to indicator */}
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              {isSending ? 'Sending verification code to:' : 'We\'ve sent a 6-digit code to:'}
            </p>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#ccff00" />
              {targetEmail || 'your registered email'}
            </div>

            {/* Status pill */}
            {isSending && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#181824', border: '1px dashed rgba(204, 255, 0, 0.3)', borderRadius: '8px', padding: '0.45rem 0.95rem', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '1.5rem' }}>
                <RotateCw size={14} color="#ccff00" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Sending OTP email…</span>
              </div>
            )}

            {!isSending && emailSent && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '8px', padding: '0.45rem 0.95rem', fontSize: '0.8rem', color: '#34d399', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={14} />
                <span>OTP email sent! Check your inbox.</span>
              </div>
            )}

            {/* EmailJS not configured: show default OTP hint */}
            {!isSending && !emailConfigured && (
              <div style={{ backgroundColor: 'rgba(255, 165, 0, 0.1)', border: '1px dashed rgba(255, 165, 0, 0.5)', borderRadius: '10px', padding: '0.65rem 1rem', fontSize: '0.82rem', color: '#fbbf24', marginBottom: '1.5rem', textAlign: 'left' }}>
                <strong>⚠ Demo mode:</strong> EmailJS not configured. Use the default code{' '}
                <strong style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>111111</strong> to proceed.
              </div>
            )}

            {error && (
              <div style={{ color: '#ff3355', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* 6 Digit Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '1.75rem' }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="pin-digit-box"
                  style={{
                    width: '46px',
                    height: '54px',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    border: digit ? '2px solid #ccff00' : '2px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: digit ? '#09090b' : '#181824',
                    boxShadow: digit ? '0 0 10px rgba(204, 255, 0, 0.3)' : 'none',
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#71717a' }}>
                {timer > 0 ? `Code expires in ${formatTimer(timer)}` : 'Code expired'}
              </span>
              <button
                type="button"
                disabled={timer > 0 || isSending}
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: (timer > 0 || isSending) ? '#52525b' : '#ccff00',
                  fontWeight: 600,
                  cursor: (timer > 0 || isSending) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <RotateCw size={14} />
                <span>Resend OTP</span>
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem' }} disabled={isSending}>
              <ShieldCheck size={18} />
              <span>Verify & Submit Application</span>
            </button>
          </form>
        ) : (
          /* Application Submitted Screen */
          <div className="modal-body" style={{ textAlign: 'center', padding: '2.25rem 1.5rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '2px solid #10b981',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={38} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              Application Queued for IEDC Review!
            </h3>

            <p style={{ color: '#a1a1aa', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Your email was successfully verified and your student venture application for{' '}
              <strong style={{ color: '#ccff00' }}>{sellerData?.storeName || 'your stall'}</strong> has been queued for IEDC Incubation approval.
            </p>

            <div
              style={{
                background: '#181824',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.1rem',
                textAlign: 'left',
                fontSize: '0.85rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                Next Steps:
              </div>
              <p style={{ color: '#a1a1aa', margin: 0 }}>
                The IEDC admin will review your application. Once approved, your official{' '}
                <strong>@mondaymart.in</strong> seller credentials will be activated so you can sign in and manage your campus stall.
              </p>
            </div>

            {/* No shortcut button — admin must log in separately */}
            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
