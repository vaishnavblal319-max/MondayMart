import React from 'react';
import { Database, CheckCircle2, ExternalLink, X } from 'lucide-react';

export const FirebaseSetupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#111116',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(204, 255, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.08) 0%, #121218 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#000000',
                border: '1.5px solid #ccff00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccff00',
                boxShadow: '0 0 15px rgba(204, 255, 0, 0.3)',
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Firebase Cloud Firestore
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '2px 0 0' }}>
                monday-market-8cf15 · Live sync active
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: '0.4rem', borderRadius: '50%', color: '#a1a1aa' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <CheckCircle2 size={22} color="#34d399" />
            <div>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>
                Connected to Cloud Firestore
              </div>
              <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                All campus orders, stall inventories, and registrations sync in real-time.
              </div>
            </div>
          </div>

          {/* Collections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            {[
              { label: 'users', desc: 'Customers & sellers' },
              { label: 'pendingSellers', desc: 'Seller KYC queue' },
              { label: 'products', desc: 'Menu & inventory' },
              { label: 'orders', desc: 'Live order tickets' },
            ].map((col) => (
              <div
                key={col.label}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#181824',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: '#ccff00' }}>
                  /{col.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '2px' }}>
                  {col.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Link to console */}
          <a
            href="https://console.firebase.google.com/project/monday-market-8cf15/firestore"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ justifyContent: 'center', gap: '0.5rem', width: '100%', borderColor: 'rgba(204, 255, 0, 0.35)', color: '#ccff00' }}
          >
            <ExternalLink size={16} />
            Open in Firebase Console
          </a>
        </div>
      </div>
    </div>
  );
};
