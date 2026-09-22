import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { QRCodeDisplay } from '../common/QRCodeDisplay';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

export const OrderSuccessModal = ({ isOpen, onClose, order, onOpenOrders }) => {
  useEffect(() => {
    if (isOpen && order) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ccff00', '#ffffff', '#10b981', '#06b6d4'],
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
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '530px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Campus Order Confirmed!</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Order #{order.id} • {formatDateTime(order.createdAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {/* Status Tracker Bar */}
          <div
            style={{
              background: '#181822',
              borderRadius: '16px',
              padding: '1.1rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '0.6rem' }}>
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
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: currentStep >= item.step ? '#ccff00' : '#14141b',
                      color: currentStep >= item.step ? '#000000' : '#71717a',
                      border: currentStep >= item.step ? '2px solid #ccff00' : '2px solid rgba(255, 255, 255, 0.2)',
                      margin: '0 auto 0.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      boxShadow: currentStep >= item.step ? '0 0 10px rgba(204, 255, 0, 0.4)' : 'none',
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: currentStep >= item.step ? 700 : 500, color: currentStep >= item.step ? '#ffffff' : '#71717a' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: '#ccff00', fontWeight: 700, marginTop: '0.65rem' }}>
              {order.status === 'pending' && '🍳 Stall kitchen has received your order!'}
              {order.status === 'preparing' && '🔥 Student chef is preparing your item!'}
              {order.status === 'ready_for_pickup' && '🔔 Ready for pickup! Flash your pass at the stall counter.'}
              {order.status === 'completed' && '✓ Order verified and completed! Enjoy!'}
            </div>
          </div>

          {/* QR Code and Random PIN Display */}
          <div style={{ marginBottom: '1.5rem' }}>
            <QRCodeDisplay
              value={order.qrPayload}
              pin={order.pin}
              size={170}
              showPinPill={true}
            />
          </div>

          {/* Order Details Brief */}
          <div
            style={{
              background: '#181822',
              borderRadius: '14px',
              padding: '0.95rem 1.1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'left',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.45rem' }}>
              Order Items ({order.items.length}):
            </div>
            {order.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', marginBottom: '0.25rem' }}>
                <span>{it.quantity}x {it.product.name}</span>
                <span style={{ color: '#ffffff' }}>{formatCurrency(it.unitPrice * it.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.12)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#ffffff' }}>
              <span>Total Paid:</span>
              <span style={{ color: '#ccff00', fontFamily: 'var(--font-heading)' }}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', backgroundColor: '#0d0d12' }}>
          <button
            onClick={() => {
              onClose();
              if (onOpenOrders) onOpenOrders();
            }}
            className="btn btn-secondary btn-sm"
          >
            <Clock size={15} />
            <span>View All My Orders</span>
          </button>

          <button onClick={onClose} className="btn btn-primary btn-sm">
            <span>Done & Continue</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
