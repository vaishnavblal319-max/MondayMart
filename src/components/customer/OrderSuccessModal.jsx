import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  QrCode,
  Sparkles,
  ShoppingBag,
  ChefHat,
  ArrowLeft,
  Store,
} from 'lucide-react';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export const OrderSuccessModal = ({ isOpen, onClose, order, onOpenOrders }) => {
  // 'celebration' | 'qr'
  const [viewMode, setViewMode] = useState('celebration');

  useEffect(() => {
    if (isOpen && order) {
      setViewMode('celebration');
      try {
        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#ccff00', '#ffffff', '#10b981', '#06b6d4', '#eab308'],
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'ready_for_pickup': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(204, 255, 0, 0.2)',
          border: '1.5px solid rgba(204, 255, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            background: '#0d0d12',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {viewMode === 'qr' ? (
              <button
                onClick={() => setViewMode('celebration')}
                className="btn btn-ghost btn-sm"
                style={{
                  padding: '0.35rem 0.65rem',
                  gap: '0.35rem',
                  color: '#ccff00',
                  border: '1px solid rgba(204, 255, 0, 0.3)',
                  borderRadius: '8px',
                }}
              >
                <ArrowLeft size={16} />
                <span>Summary</span>
              </button>
            ) : (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(204, 255, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccff00',
                  border: '1px solid rgba(204, 255, 0, 0.35)',
                }}
              >
                <Sparkles size={20} />
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {viewMode === 'celebration' ? 'Order Confirmed!' : 'Pickup QR & Pass'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                Order #{order.id} • {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        {/* View 1: Celebratory Order Success Screen */}
        {viewMode === 'celebration' && (
          <div className="modal-body success-pop" style={{ padding: '1.5rem', textAlign: 'center' }}>
            {/* Animated Celebration Graphic */}
            <div style={{ position: 'relative', margin: '0.5rem auto 1.25rem', width: '100px', height: '100px' }}>
              <div
                className="ripple-success"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(204,255,0,0.25) 0%, rgba(16,185,129,0.15) 100%)',
                }}
              />
              <div
                className="glow-success"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  position: 'relative',
                  zIndex: 2,
                  border: '3px solid #ccff00',
                }}
              >
                <CheckCircle2 size={54} color="#ffffff" strokeWidth={2.4} />
              </div>
            </div>

            <div className="badge badge-iedc" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.95rem' }}>
              ✓ ORDER #{order.id} TRANSMITTED TO STALL
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '0.45rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Order Placed Successfully!
            </h2>

            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              The student kitchen has received your order and started prep. Use your digital QR pass or secret PIN to collect at the counter!
            </p>

            {/* Quick Live Status Card */}
            <div
              style={{
                background: '#14141b',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              {/* Tracker Progress Line */}
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '0.65rem' }}>
                <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1 }} />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10%',
                    width: `${(currentStep - 1) * 33.3}%`,
                    height: '2px',
                    backgroundColor: '#ccff00',
                    boxShadow: '0 0 10px rgba(204, 255, 0, 0.5)',
                    zIndex: 2,
                    transition: 'width 0.4s ease',
                  }}
                />

                {[
                  { label: 'Placed', step: 1 },
                  { label: 'Stall Prep', step: 2 },
                  { label: 'Ready', step: 3 },
                  { label: 'Collected', step: 4 },
                ].map((item) => (
                  <div key={item.step} style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: currentStep >= item.step ? '#ccff00' : '#14141b',
                        color: currentStep >= item.step ? '#000000' : '#71717a',
                        border: currentStep >= item.step ? '2px solid #ccff00' : '2px solid rgba(255, 255, 255, 0.2)',
                        margin: '0 auto 0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                      }}
                    >
                      {item.step}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: currentStep >= item.step ? 700 : 500, color: currentStep >= item.step ? '#ffffff' : '#71717a' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#09090b', padding: '0.65rem 0.85rem', borderRadius: '10px', marginTop: '0.5rem' }}>
                <ChefHat size={16} color="#ccff00" flexShrink={0} />
                <span style={{ fontSize: '0.8rem', color: '#ccff00', fontWeight: 700 }}>
                  Kitchen status: Fresh items are being prepared right now
                </span>
              </div>
            </div>

            {/* Quick Bill / Items Snapshot */}
            <div
              style={{
                background: '#14141b',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', marginBottom: '0.35rem' }}>
                <span>Items ({order.items.length}):</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {order.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '0.45rem', marginTop: '0.45rem' }}>
                <span>Total Amount Paid:</span>
                <strong style={{ color: '#ccff00', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(order.totalAmount)}
                </strong>
              </div>
            </div>

            {/* Primary Action: View QR Pass Button */}
            <button
              onClick={() => setViewMode('qr')}
              className="btn btn-primary pulse-animation"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                fontSize: '1.05rem',
                gap: '0.65rem',
                borderRadius: '14px',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(204, 255, 0, 0.45)',
              }}
            >
              <QrCode size={22} />
              <span>View Pickup QR Pass & Secret PIN</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', marginTop: '0.75rem', color: '#a1a1aa', justifyContent: 'center' }}
            >
              Keep Browsing Campus Stalls
            </button>
          </div>
        )}

        {/* View 2: Dedicated Full-Focus QR & PIN Pass (Mobile Optimized) */}
        {viewMode === 'qr' && (
          <div className="modal-body success-pop" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <QRCodeDisplay
                value={order.qrPayload}
                pin={order.pin}
                size={160}
                showPinPill={true}
              />
            </div>

            {/* Pickup Counter Location Reminder */}
            <div
              style={{
                background: '#14141b',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <Store size={20} color="#ccff00" flexShrink={0} />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                  Pickup Counter: {order.deliveryAddress || 'Campus Food Court'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                  Flash this QR pass on your phone or give your 4-digit PIN to the student merchant.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenOrders) onOpenOrders();
                }}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
              >
                <Clock size={16} />
                <span>My Orders</span>
              </button>

              <button
                onClick={onClose}
                className="btn btn-primary btn-sm"
                style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
              >
                <span>Done</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
