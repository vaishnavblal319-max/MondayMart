import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={20} color="#ccff00" />,
    error: <AlertCircle size={20} color="#ff3355" />,
    info: <Info size={20} color="#06b6d4" />,
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: '#09090b',
        color: '#ffffff',
        padding: '0.9rem 1.35rem',
        borderRadius: '14px',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.9), 0 0 20px rgba(204, 255, 0, 0.15)',
        border: '1.5px solid rgba(204, 255, 0, 0.4)',
        animation: 'slideUp 0.3s ease-out',
        maxWidth: '440px',
      }}
    >
      {icons[type] || icons.info}
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#a1a1aa',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
