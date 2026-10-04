import React, { useState } from 'react';
import {
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
  Clock,
  Sparkles,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/helpers';

export const AdminApprovalPage = ({ onSwitchToSeller, onSwitchToCustomer }) => {
  const { pendingSellers, users, approveSeller, rejectSeller, login } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [selectedIdPhoto, setSelectedIdPhoto] = useState(null);
  const [approvalResult, setApprovalResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const pendingList = pendingSellers.filter((s) => s.status === 'pending');
  const approvedList = pendingSellers.filter((s) => s.status === 'approved');
  const totalSellers = users.filter((u) => u.role === 'seller').length;

  const handleApprove = async (requestId) => {
    const result = await approveSeller(requestId);
    if (result && result.success) {
      setApprovalResult(result);
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

  const handleDirectLogin = async (email, password) => {
    const result = await login(email, password);
    if (result && result.success) {
      if (onSwitchToSeller) onSwitchToSeller();
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 6rem', minHeight: '85vh' }}>
      <div className="container">
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.08) 0%, rgba(18, 18, 24, 0.95) 100%)',
            border: '1.5px solid rgba(204, 255, 0, 0.3)',
            borderRadius: '24px',
            padding: '2rem 2.25rem',
            marginBottom: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(204, 255, 0, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#000000',
                border: '2px solid #ccff00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccff00',
                boxShadow: '0 0 25px rgba(204, 255, 0, 0.3)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: 0 }}>
                  IEDC Venture Approval Console
                </h1>
                <span
                  style={{
                    backgroundColor: 'rgba(204, 255, 0, 0.15)',
                    color: '#ccff00',
                    border: '1px solid rgba(204, 255, 0, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                  }}
                >
                  ADMIN LEVEL
                </span>
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '600px' }}>
                Review campus stall onboarding applications, inspect student identity credentials, and provision official <code>@mondaymart.in</code> merchant accounts.
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {onSwitchToCustomer && (
              <button
                onClick={onSwitchToCustomer}
                className="btn btn-secondary"
                style={{ gap: '0.5rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <ShoppingBag size={16} />
                <span>Customer Storefront</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Metrics Cards */}
        <div
          className="grid-4-mobile-2"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}
        >
          <div
            style={{
              backgroundColor: '#121217',
              border: pendingList.length > 0 ? '1.5px solid rgba(204, 255, 0, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>Pending Review</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: pendingList.length > 0 ? '#ccff00' : '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {pendingList.length}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(204, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00' }}>
              <Clock size={20} />
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#121217',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>Approved Ventures</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {approvedList.length}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#121217',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>Active Stall Accounts</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {totalSellers}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
              <Store size={20} />
            </div>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            background: '#121218',
            borderRadius: '16px 16px 0 0',
            padding: '0.25rem 0.5rem 0',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('pending');
              setApprovalResult(null);
            }}
            style={{
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'pending' ? '3px solid #ccff00' : 'none',
              color: activeTab === 'pending' ? '#ccff00' : '#a1a1aa',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontFamily: 'var(--font-heading)',
              transition: 'var(--transition)',
            }}
          >
            <span>Pending Applications</span>
            <span
              style={{
                backgroundColor: pendingList.length > 0 ? '#ccff00' : 'rgba(255, 255, 255, 0.1)',
                color: pendingList.length > 0 ? '#000000' : '#71717a',
                padding: '2px 8px',
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
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'approved' ? '3px solid #ccff00' : 'none',
              color: activeTab === 'approved' ? '#ccff00' : '#a1a1aa',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontFamily: 'var(--font-heading)',
              transition: 'var(--transition)',
            }}
          >
            <span>Approved Stalls & Credentials</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#a1a1aa',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {approvedList.length}
            </span>
          </button>
        </div>

        {/* Newly Approved Celebration Banner */}
        {approvalResult && (
          <div
            style={{
              background: 'rgba(204, 255, 0, 0.08)',
              border: '1.5px solid #ccff00',
              borderRadius: '20px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 0 30px rgba(204, 255, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#ccff00', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
              <CheckCircle2 size={24} />
              <span>VENTURE APPROVED & IEDC CREDENTIALS PROVISIONED!</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#d4d4d8', marginBottom: '1.25rem' }}>
              The official stall email and secure password have been generated and saved into Firestore:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  background: '#09090b',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  border: '1px solid rgba(204, 255, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>Assigned Seller Email:</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ccff00', fontFamily: 'var(--font-mono)' }}>
                    {approvalResult.sellerEmail}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(approvalResult.sellerEmail, 'email')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  {copiedEmail ? <Check size={14} color="#ccff00" /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div
                style={{
                  background: '#09090b',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  border: '1px solid rgba(204, 255, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 600 }}>Assigned Password:</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                    {approvalResult.tempPassword}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(approvalResult.tempPassword, 'password')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  {copiedPassword ? <Check size={14} color="#ccff00" /> : <Copy size={14} />}
                  <span>{copiedPassword ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => handleDirectLogin(approvalResult.sellerEmail, approvalResult.tempPassword)}
                className="btn btn-primary"
                style={{ gap: '0.5rem' }}
              >
                <Store size={16} />
                <span>Log in as this Seller Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Pending Applications */}
        {activeTab === 'pending' && (
          <div>
            {pendingList.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  backgroundColor: '#121217',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <ShieldCheck size={56} color="#3f3f46" style={{ margin: '0 auto 1.25rem', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                  All Applications Reviewed!
                </h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0.5rem auto 1.5rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                  There are currently no pending student venture applications. Any new submissions with verified phone OTPs will appear here in real-time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {pendingList.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      background: '#121217',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: 0 }}>
                            {app.storeName}
                          </h3>
                          <span className="badge badge-iedc">{app.category}</span>
                          <span className="badge badge-success">✓ Phone OTP Verified</span>
                        </div>
                        <div style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                          Submitted: {formatDateTime(app.submittedAt)}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => rejectSeller(app.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ borderColor: 'rgba(255, 51, 85, 0.3)', color: '#ff3355' }}
                        >
                          <XCircle size={15} />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.5rem' }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Approve & Issue Account</span>
                        </button>
                      </div>
                    </div>

                    {/* Application Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem', background: '#09090b', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Student Founder</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{app.ownerName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Personal Email</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#d4d4d8', marginTop: '2px' }}>{app.personalEmail}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Contact Phone</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#d4d4d8', marginTop: '2px' }}>{app.phone}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 700 }}>Campus Stall Location</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#d4d4d8', marginTop: '2px' }}>{app.address || 'Campus'}</div>
                      </div>
                    </div>

                    {/* ID Proof Preview */}
                    {app.idPhotoUrl && (
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginBottom: '0.5rem' }}>
                          Uploaded Identity Proof Document:
                        </div>
                        <div
                          onClick={() => setSelectedIdPhoto(app.idPhotoUrl)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.85rem',
                            background: '#09090b',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                          }}
                        >
                          <img
                            src={app.idPhotoUrl}
                            alt="Proof document"
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#ccff00', fontWeight: 600 }}>Click to Zoom Document</span>
                          <Eye size={15} color="#ccff00" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Approved Ventures & Passwords */}
        {activeTab === 'approved' && (
          <div>
            {approvedList.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  backgroundColor: '#121217',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Store size={56} color="#3f3f46" style={{ margin: '0 auto 1.25rem', opacity: 0.6 }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                  No Approved Stalls Yet
                </h3>
                <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0.5rem auto 1.5rem', color: '#a1a1aa' }}>
                  When you approve pending applications, their credentials and stall status will be listed here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {approvedList.map((seller) => (
                  <div
                    key={seller.id}
                    style={{
                      background: '#121217',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '18px',
                      padding: '1.5rem 1.75rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', margin: 0 }}>
                          {seller.storeName}
                        </h4>
                        <span className="badge badge-success">✓ Active Stall</span>
                        <span className="badge badge-iedc">{seller.category}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#a1a1aa', display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                        <span>Lead: <strong style={{ color: '#ffffff' }}>{seller.ownerName}</strong></span>
                        <span>• Official Email: <strong style={{ color: '#ccff00', fontFamily: 'var(--font-mono)' }}>{seller.assignedEmail}</strong></span>
                        {seller.tempPassword && (
                          <span>• Password: <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{seller.tempPassword}</strong></span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        onClick={() => handleCopy(seller.assignedEmail, 'email')}
                        className="btn btn-ghost btn-sm"
                        title="Copy official email"
                        style={{ color: '#a1a1aa' }}
                      >
                        <Copy size={15} />
                        <span>Email</span>
                      </button>
                      {seller.tempPassword && (
                        <button
                          onClick={() => handleCopy(seller.tempPassword, 'password')}
                          className="btn btn-ghost btn-sm"
                          title="Copy temporary password"
                          style={{ color: '#a1a1aa' }}
                        >
                          <Copy size={15} />
                          <span>Password</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDirectLogin(seller.assignedEmail, seller.tempPassword)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.45rem', borderColor: '#ccff00', color: '#ccff00' }}
                      >
                        <Store size={15} />
                        <span>Open Portal</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              maxWidth: '620px',
              width: '100%',
              background: '#121217',
              borderRadius: '20px',
              padding: '1.5rem',
              position: 'relative',
              border: '1px solid rgba(204, 255, 0, 0.4)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.95)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Uploaded Student Proof Document
              </span>
              <button
                onClick={() => setSelectedIdPhoto(null)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.35rem', color: '#a1a1aa' }}
              >
                ✕
              </button>
            </div>
            <img
              src={selectedIdPhoto}
              alt="Zoomed ID proof"
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
