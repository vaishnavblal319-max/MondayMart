import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, Sparkles } from 'lucide-react';

export const QRCodeDisplay = ({ value, pin, size = 160, showPinPill = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = () => {
    if (pin) {
      try {
        navigator.clipboard.writeText(pin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (e) {
        // clipboard fallback
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    }
  };

  return (
    <div className="qr-pass-card" style={{ margin: '0 auto', maxWidth: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: '#ccff00', fontWeight: 800, fontSize: 'clamp(0.78rem, 2.5vw, 0.9rem)', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>
        <QrCode size={18} />
        <span>IEDC STALL VERIFICATION PASS</span>
      </div>

      <div
        style={{
          background: '#ffffff',
          padding: 'clamp(0.65rem, 2.5vw, 1rem)',
          borderRadius: '16px',
          display: 'inline-block',
          boxShadow: '0 0 25px rgba(204, 255, 0, 0.25)',
          border: '2px solid #ccff00',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <QRCodeSVG
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          size={size}
          level="H"
          includeMargin={false}
          style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
          imageSettings={{
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23000000"/><text x="50" y="66" font-size="44" font-family="Arial" font-weight="900" fill="%23ccff00" text-anchor="middle">M</text></svg>',
            x: undefined,
            y: undefined,
            height: 28,
            width: 28,
            excavate: true,
          }}
        />
      </div>

      {showPinPill && pin && (
        <div style={{ marginTop: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', fontWeight: 700, marginBottom: '0.45rem' }}>
            Campus Pickup Secret PIN
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
            <div className="pin-pill">{pin}</div>
            <button
              onClick={handleCopyPin}
              title="Copy PIN"
              style={{
                background: copied ? 'rgba(16, 185, 129, 0.2)' : '#181824',
                border: copied ? '1.5px solid #10b981' : '1px solid rgba(204, 255, 0, 0.4)',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: copied ? '#34d399' : '#ccff00',
                transition: 'var(--transition)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#d4d4d8', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <Sparkles size={14} color="#ccff00" flexShrink={0} />
            <span>Flash QR or recite PIN at stall to claim order</span>
          </div>
        </div>
      )}
    </div>
  );
};

