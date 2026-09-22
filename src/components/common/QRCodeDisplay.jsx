import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode } from 'lucide-react';

export const QRCodeDisplay = ({ value, pin, size = 180, showPinPill = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPin = () => {
    if (pin) {
      navigator.clipboard.writeText(pin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="qr-pass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: '#ccff00', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>
        <QrCode size={18} />
        <span>IEDC STALL VERIFICATION PASS</span>
      </div>

      <div
        style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '16px',
          display: 'inline-block',
          boxShadow: '0 0 25px rgba(204, 255, 0, 0.25)',
          border: '2px solid #ccff00',
        }}
      >
        <QRCodeSVG
          value={typeof value === 'string' ? value : JSON.stringify(value)}
          size={size}
          level="H"
          includeMargin={false}
          imageSettings={{
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="%23000000"/><text x="50" y="66" font-size="44" font-family="Arial" font-weight="900" fill="%23ccff00" text-anchor="middle">M</text></svg>',
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>

      {showPinPill && pin && (
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a1a1aa', fontWeight: 700, marginBottom: '0.45rem' }}>
            Campus Pickup Verification PIN
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
            <div className="pin-pill">{pin}</div>
            <button
              onClick={handleCopyPin}
              title="Copy PIN"
              style={{
                background: '#181824',
                border: '1px solid rgba(204, 255, 0, 0.4)',
                borderRadius: '10px',
                padding: '0.65rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccff00',
                transition: 'var(--transition)',
              }}
            >
              {copied ? <Check size={18} color="#34d399" /> : <Copy size={18} />}
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#71717a', marginTop: '0.65rem' }}>
            Show this QR code or recite the 4-digit PIN at the stall to complete pickup.
          </p>
        </div>
      )}
    </div>
  );
};
