import React, { useState } from 'react';
import { X, Lock, Mail, Store, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginModal = ({ isOpen, onClose, onOpenCustomerRegister, onOpenSellerRegister, onSuccessLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      onSuccessLogin(result.role);
      onClose();
    } else {
      setError(result.error || 'Unable to log in. Please check your credentials.');
    }
  };

  const handleQuickFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Sign In to MondayMarket</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Smart portal login for students, stalls & IEDC admins</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 51, 85, 0.15)',
                border: '1px solid rgba(255, 51, 85, 0.4)',
                color: '#ff3355',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          {/* Smart routing info card */}
          <div
            style={{
              backgroundColor: '#181824',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.85rem 1.1rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: '#d4d4d8',
              lineHeight: 1.45,
            }}
          >
            <div style={{ fontWeight: 700, color: '#ccff00', marginBottom: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              ⚡ Smart Role Detection:
            </div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#a1a1aa' }}>
              <li>
                <strong style={{ color: '#ffffff' }}>Student Stalls:</strong> Log in with your approved <code>@mondaymart.in</code> email.
              </li>
              <li>
                <strong style={{ color: '#ffffff' }}>Campus Customers:</strong> Log in with your personal email (e.g. gmail).
              </li>
            </ul>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@gmail.com or store@mondaymart.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password <span style={{ color: '#71717a', fontWeight: 400 }}>(any value accepted in demo)</span></label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="demo mode — any password works"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
            <span>Sign In</span>
            <ArrowRight size={16} />
          </button>

          {/* Quick Demo Pre-fills */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Instant Demo Credentials:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('demo@student.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem', gap: '0.3rem' }}
              >
                <User size={13} color="#06b6d4" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('freshbakes@mondaymart.in')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem', gap: '0.3rem' }}
              >
                <Store size={13} color="#ccff00" />
                <span>Seller</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@mondaymart.in')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.45rem 0.25rem', gap: '0.3rem' }}
              >
                <ShieldCheck size={13} color="#34d399" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </form>

        <div className="modal-footer" style={{ justifyContent: 'center', fontSize: '0.85rem', color: '#a1a1aa', backgroundColor: '#0d0d12' }}>
          <span>Don't have an account?</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCustomerRegister();
            }}
            style={{ background: 'none', border: 'none', color: '#ccff00', fontWeight: 700, cursor: 'pointer' }}
          >
            Register as Customer
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSellerRegister();
            }}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
          >
            Register as Seller
          </button>
        </div>
      </div>
    </div>
  );
};
