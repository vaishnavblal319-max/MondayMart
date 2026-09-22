import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, RotateCw, ArrowRight, Smartphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OtpVerificationModal = ({
  isOpen,
  onClose,
  sellerData,
  onApplicationSubmitted,
  onOpenAdminApproval,
}) => {
  const { submitSellerApplication } = useAuth();
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState('482910');

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      return;
    }

    setTimer(30);
    setDemoCode('482910');
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    const digit = value.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFill = () => {
    setOtp(demoCode.split(''));
    setError('');
  };

  const handleResend = () => {
    const nextCode = generateOtp();
    setDemoCode(nextCode);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setTimer(30);
    inputRefs.current[0]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    if (timer === 0) {
      setError('Code expired. Resend OTP and try again.');
      return;
    }
    if (entered !== demoCode) {
      setError('Incorrect OTP. Use the demo code shown above, or resend.');
      return;
    }

    submitSellerApplication(sellerData);
    setIsSubmitted(true);
    if (onApplicationSubmitted) {
      onApplicationSubmitted();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Smartphone size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Mobile Phone Verification</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Step 2 of 2: Confirm student contact via SMS OTP</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleVerifyOtp} className="modal-body" style={{ textAlign: 'center' }}>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              We've sent a 6-digit verification code to:
            </p>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              {sellerData?.phone || '+91 98123 45678'}
            </div>

            {/* Demo Helper Pill */}
            <div
              onClick={handleAutoFill}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#181824',
                border: '1px dashed rgba(204, 255, 0, 0.45)',
                borderRadius: '8px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                color: '#ffffff',
                cursor: 'pointer',
                marginBottom: '1.75rem',
                boxShadow: '0 0 10px rgba(204, 255, 0, 0.1)',
              }}
              title="Click to automatically fill code"
            >
              <span>Demo OTP: <strong style={{ color: '#ccff00', fontFamily: 'var(--font-mono)' }}>{demoCode}</strong></span>
              <span style={{ color: '#ccff00', fontWeight: 700 }}>[Click to Auto-fill]</span>
            </div>

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
                {timer > 0 ? `Resend code in 00:${timer < 10 ? '0' : ''}${timer}` : 'Code expired'}
              </span>
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: timer > 0 ? '#52525b' : '#ccff00',
                  fontWeight: 600,
                  cursor: timer > 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <RotateCw size={14} />
                <span>Resend OTP</span>
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem' }}>
              <ShieldCheck size={18} />
              <span>Verify Phone & Submit Application</span>
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
              Your phone number was successfully verified and your student venture application for{' '}
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
                Once verified by the IEDC team, your official <strong>@mondaymart.in</strong> seller credentials will be activated so you can sign in and manage your live campus stall!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminApproval();
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.45rem' }}
              >
                <span>Open IEDC Console to Approve Now</span>
                <ArrowRight size={14} />
              </button>
              <button onClick={onClose} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
