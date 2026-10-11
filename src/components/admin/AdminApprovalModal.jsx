import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sendVentureApprovalEmail } from '../../utils/emailService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Store,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Copy,
  Check,
  Send,
  Loader2,
  AlertCircle,
  Key,
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export const AdminApprovalModal = ({ isOpen, onClose, onSwitchToSeller }) => {
  const { pendingSellers, approveSeller, rejectSeller, login, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [selectedIdPhoto, setSelectedIdPhoto] = useState(null);
  const [approvalResult, setApprovalResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [mailStatus, setMailStatus] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  if (!isOpen) return null;

  // ── Admin-only guard — must come after hooks, before rendering console ────
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 51, 85, 0.15)', color: '#ff3355', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '2px solid rgba(255, 51, 85, 0.4)' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Admin Access Only</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            The IEDC Approval Console is restricted to administrators.<br />
            Please log in with your admin credentials.
          </p>
          <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '120px' }}>Close</button>
        </div>
      </div>
    );
  }

  const pendingList = pendingSellers.filter((s) => s.status === 'pending');
  const approvedList = pendingSellers.filter((s) => s.status === 'approved');

  const dispatchApprovalEmail = async (sellerUser, officialEmail, tempPassword) => {
    const recipient = sellerUser?.personalEmail || sellerUser?.email;
    if (!recipient) {
      setMailStatus({ sending: false, sent: false, error: 'No founder email on record', targetEmail: '' });
      return;
    }

    setMailStatus({ sending: true, sent: false, error: null, targetEmail: recipient });
    try {
      const mailRes = await sendVentureApprovalEmail({
        toEmail: recipient,
        founderName: sellerUser?.name || 'Venture Founder',
        storeName: sellerUser?.storeName || 'Campus Stall',
        officialEmail: officialEmail,
        defaultPassword: tempPassword,
      });

      if (mailRes.success) {
        setMailStatus({ sending: false, sent: true, error: null, targetEmail: recipient });
      } else {
        setMailStatus({ sending: false, sent: false, error: mailRes.error || 'Failed to dispatch email', targetEmail: recipient });
      }
    } catch (err) {
      setMailStatus({ sending: false, sent: false, error: err?.message || 'Dispatch error', targetEmail: recipient });
    }
  };

  const handleApprove = async (requestId) => {
    const result = approveSeller(requestId);
    if (result && result.success) {
      setApprovalResult(result);
      await dispatchApprovalEmail(result.sellerUser, result.sellerEmail, result.tempPassword);
    }
  };

  const handleCopy = (text, type = 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'password') {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleResendCredentials = async (seller) => {
    const targetEmail = seller.personalEmail || seller.email;
    if (!targetEmail) return;
    setResendingId(seller.id);
    try {
      await sendVentureApprovalEmail({
        toEmail: targetEmail,
        founderName: seller.ownerName || seller.name || 'Founder',
        storeName: seller.storeName,
        officialEmail: seller.assignedEmail || seller.email,
        defaultPassword: seller.tempPassword || '',
      });
      alert(`Automated email re-sent to ${targetEmail} with username & password!`);
    } catch (err) {
      console.error(err);
    } finally {
      setResendingId(null);
    }
  };

  const handleDirectLogin = (email, password) => {
    login(email, password);
    onSwitchToSeller();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 242, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff200', border: '1px solid rgba(255, 242, 0, 0.3)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>IEDC Venture Approval Console</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Review student applications & issue official @mondaymart.in credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '0 1.5rem', background: '#0d0d12' }}>
          <button
            onClick={() => {
              setActiveTab('pending');
              setApprovalResult(null);
            }}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'pending' ? '2px solid #fff200' : 'none',
              color: activeTab === 'pending' ? '#fff200' : '#a1a1aa',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span>Pending Applications</span>
            <span
              style={{
                backgroundColor: pendingList.length > 0 ? '#fff200' : 'rgba(255, 255, 255, 0.1)',
                color: pendingList.length > 0 ? '#000000' : '#71717a',
                padding: '1px 7px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              {pendingList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'approved' ? '2px solid #fff200' : 'none',
              color: activeTab === 'approved' ? '#fff200' : '#a1a1aa',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            <span>Approved Ventures</span>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#a1a1aa', padding: '1px 7px', borderRadius: '9999px', fontSize: '0.75rem' }}>
              {approvedList.length}
            </span>
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '62vh', overflowY: 'auto' }}>
          {/* Approval Success Banner */}
          {approvalResult && (
            <div
              style={{
                background: 'rgba(255, 242, 0, 0.08)',
                border: '1.5px solid #fff200',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: '0 0 25px rgba(255, 242, 0, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff200', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <CheckCircle2 size={20} />
                <span>VENTURE APPROVED & IEDC CREDENTIALS ISSUED!</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#d4d4d8', marginBottom: '1rem' }}>
                The official institutional stall credentials have been generated and the automated email is being dispatched:
              </p>

              {/* Grid of Credentials: Username & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div
                  style={{
                    background: '#09090b',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(255, 242, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>Official Username / Email:</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff200', fontFamily: 'var(--font-mono)' }}>
                      {approvalResult.sellerEmail}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(approvalResult.sellerEmail, 'email')}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem', padding: '0.3rem 0.6rem' }}
                    title="Copy official email"
                  >
                    {copiedEmail ? <Check size={13} color="#fff200" /> : <Copy size={13} />}
                    <span style={{ fontSize: '0.75rem' }}>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div
                  style={{
                    background: '#09090b',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(255, 242, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>Default Password:</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {approvalResult.tempPassword}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(approvalResult.tempPassword, 'password')}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem', padding: '0.3rem 0.6rem' }}
                    title="Copy temporary password"
                  >
                    {copiedPassword ? <Check size={13} color="#fff200" /> : <Copy size={13} />}
                    <span style={{ fontSize: '0.75rem' }}>{copiedPassword ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Automated Mail Dispatch Status */}
              {mailStatus && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '10px',
                    background: mailStatus.sent
                      ? 'rgba(52, 211, 153, 0.12)'
                      : mailStatus.sending
                      ? 'rgba(255, 242, 0, 0.1)'
                      : 'rgba(255, 51, 85, 0.12)',
                    border: `1px solid ${
                      mailStatus.sent
                        ? 'rgba(52, 211, 153, 0.4)'
                        : mailStatus.sending
                        ? 'rgba(255, 242, 0, 0.4)'
                        : 'rgba(255, 51, 85, 0.4)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mailStatus.sent ? '#34d399' : mailStatus.sending ? '#fff200' : '#ff3355' }}>
                    {mailStatus.sending && <Loader2 size={16} className="spin" />}
                    {mailStatus.sent && <CheckCircle2 size={16} />}
                    {mailStatus.error && <AlertCircle size={16} />}
                    <span>
                      {mailStatus.sending && `Dispatching automated credentials email to ${mailStatus.targetEmail}...`}
                      {mailStatus.sent && `Automated email sent to ${mailStatus.targetEmail} with username & password!`}
                      {mailStatus.error && `Email delivery notice: ${mailStatus.error} (Credentials recorded on-screen)`}
                    </span>
                  </div>

                  {mailStatus.error && (
                    <button
                      onClick={() => dispatchApprovalEmail(approvalResult.sellerUser, approvalResult.sellerEmail, approvalResult.tempPassword)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#fff200' }}
                    >
                      Retry Send
                    </button>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleDirectLogin(approvalResult.sellerEmail, approvalResult.tempPassword)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.45rem' }}
                >
                  <Store size={15} />
                  <span>Log in as this Seller Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pending' ? (
            pendingList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717a' }}>
                <ShieldCheck size={48} color="#3f3f46" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>All Applications Reviewed!</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0.25rem auto 0', color: '#a1a1aa' }}>
                  No pending student venture applications currently. Any new submissions with verified phone OTPs will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pendingList.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      background: '#14141b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.3rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                            {app.storeName}
                          </h4>
                          <span className="badge badge-warning">Pending Review</span>
                          <span className="badge badge-success">✓ OTP Verified</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
                          Applicant: <strong style={{ color: '#ffffff' }}>{app.ownerName}</strong> • Submitted {formatDateTime(app.submittedAt)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.4rem' }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Approve & Issue Account</span>
                        </button>
                        <button
                          onClick={() => rejectSeller(app.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#ff3355', borderColor: 'rgba(255, 51, 85, 0.4)' }}
                        >
                          <XCircle size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Application Details Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        background: '#181824',
                        borderRadius: '12px',
                        padding: '0.95rem',
                        fontSize: '0.825rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa' }}>
                        <Store size={15} color="#fff200" />
                        <span>Category: <strong style={{ color: '#ffffff' }}>{app.category}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa' }}>
                        <Mail size={15} color="#06b6d4" />
                        <span>Personal: <strong style={{ color: '#ffffff' }}>{app.personalEmail}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa' }}>
                        <Phone size={15} color="#34d399" />
                        <span>Phone: <strong style={{ color: '#ffffff' }}>{app.phone}</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa' }}>
                        <MapPin size={15} color="#fff200" />
                        <span>Location: <strong style={{ color: '#ffffff' }}>{app.address}</strong></span>
                      </div>
                    </div>

                    {/* ID Photo Inspection */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={app.idPhotoUrl}
                          alt="Student KYC ID Document"
                          style={{
                            width: '56px',
                            height: '42px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedIdPhoto(app.idPhotoUrl)}
                        />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                            College ID / Student Proof
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedIdPhoto(app.idPhotoUrl)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#fff200',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              padding: 0,
                              marginTop: '0.15rem',
                            }}
                          >
                            <Eye size={12} />
                            <span>Click to view full image</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Approved List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {approvedList.map((seller) => (
                <div
                  key={seller.id}
                  style={{
                    background: '#14141b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '14px',
                    padding: '1.1rem 1.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{seller.storeName}</h4>
                      <span className="badge badge-success">✓ Active Stall</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#a1a1aa', marginTop: '0.2rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                      <span>Lead: <strong style={{ color: '#ffffff' }}>{seller.ownerName}</strong></span>
                      <span>• Username: <strong style={{ color: '#fff200', fontFamily: 'var(--font-mono)' }}>{seller.assignedEmail}</strong></span>
                      {seller.tempPassword && (
                        <span>• Password: <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{seller.tempPassword}</strong></span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleResendCredentials(seller)}
                      disabled={resendingId === seller.id}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                      title="Resend automated email with username and password"
                    >
                      {resendingId === seller.id ? (
                        <Loader2 size={13} className="spin" />
                      ) : (
                        <Send size={13} color="#fff200" />
                      )}
                      <span>{resendingId === seller.id ? 'Sending...' : 'Resend Email'}</span>
                    </button>

                    <button
                      onClick={() => handleDirectLogin(seller.assignedEmail, seller.tempPassword)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem', borderColor: '#fff200', color: '#fff200' }}
                    >
                      <Store size={14} color="#fff200" />
                      <span>Open Portal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox / Zoomed ID Modal */}
        {selectedIdPhoto && (
          <div
            className="modal-backdrop"
            style={{ zIndex: 1100 }}
            onClick={() => setSelectedIdPhoto(null)}
          >
            <div
              style={{
                maxWidth: '600px',
                width: '100%',
                background: '#121217',
                borderRadius: '16px',
                padding: '1.25rem',
                position: 'relative',
                border: '1px solid rgba(255, 242, 0, 0.4)',
                boxShadow: '0 0 35px rgba(0, 0, 0, 0.9)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Uploaded Student Proof Document</span>
                <button onClick={() => setSelectedIdPhoto(null)} className="btn btn-ghost" style={{ padding: '0.3rem', color: '#a1a1aa' }}>
                  <X size={18} />
                </button>
              </div>
              <img
                src={selectedIdPhoto}
                alt="Enlarged Document"
                style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '10px' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
