import React, { useState } from 'react';
import {
  CheckCircle2,
  User,
  Phone,
  QrCode,
  ShieldCheck,
  AlertCircle,
  ChefHat,
  Bell,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

export const OrderTicket = ({ order }) => {
  const { updateOrderStatus, verifyOrderPin } = useMarket();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');
  const [showQr, setShowQr] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    if (!pinInput.trim()) {
      setError('Please enter the 4-digit PIN');
      return;
    }

    const result = verifyOrderPin(order.id, pinInput);
    if (!result.success) {
      setError(result.error);
    } else {
      setPinInput('');
    }
  };

  const handleQuickVerify = () => {
    verifyOrderPin(order.id, order.pin);
  };

  const isCompleted = order.status === 'completed';

  return (
    <div
      style={{
        background: '#14141b',
        borderRadius: '18px',
        border: isCompleted ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid rgba(204, 255, 0, 0.45)',
        boxShadow: isCompleted ? 'var(--shadow-sm)' : '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(204, 255, 0, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ticket Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(204, 255, 0, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
            #{order.id}
          </span>
          <span className={isCompleted ? 'badge badge-success' : 'badge badge-iedc'}>
            {order.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
          {formatDateTime(order.createdAt)}
        </div>
      </div>

      {/* Ticket Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Customer Details */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#181824',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} color="#ccff00" />
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{order.customer.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a1a1aa' }}>
            <Phone size={14} color="#34d399" />
            <span>{order.customer.phone}</span>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Items Ordered ({order.items.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {order.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  padding: '0.35rem 0',
                  borderBottom: '1px dashed rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: '#ccff00',
                      color: '#000000',
                      fontWeight: 800,
                      borderRadius: '6px',
                      padding: '2px 7px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {it.quantity}x
                  </span>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{it.product.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#ccff00', fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(it.unitPrice * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Bill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 800 }}>
          <span style={{ color: '#a1a1aa' }}>Order Total:</span>
          <span style={{ fontSize: '1.25rem', color: '#ccff00', fontFamily: 'var(--font-heading)' }}>
            {formatCurrency(order.totalAmount)}
          </span>
        </div>

        {/* Status Actions (Pending -> Preparing -> Ready) */}
        {!isCompleted && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {order.status === 'pending' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'preparing')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, gap: '0.35rem', borderColor: 'rgba(204, 255, 0, 0.35)', color: '#ccff00' }}
              >
                <ChefHat size={15} />
                <span>Start Preparing</span>
              </button>
            )}

            {order.status === 'preparing' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'ready_for_pickup')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, gap: '0.35rem', borderColor: '#34d399', color: '#34d399' }}
              >
                <Bell size={15} />
                <span>Mark Ready for Pickup</span>
              </button>
            )}

            <button
              onClick={() => setShowQr(!showQr)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.4rem 0.65rem', color: '#a1a1aa' }}
              title="Toggle QR Pass view"
            >
              <QrCode size={16} />
              <span>{showQr ? 'Hide QR' : 'Inspect QR'}</span>
            </button>
          </div>
        )}

        {/* Expanded QR Display */}
        {showQr && (
          <div style={{ padding: '0.5rem 0', animation: 'fadeIn 0.2s ease' }}>
            <QRCodeDisplay value={order.qrPayload} pin={order.pin} size={130} showPinPill={false} />
          </div>
        )}

        {/* Verification Section */}
        {!isCompleted ? (
          <div
            style={{
              background: '#181824',
              border: '1.5px dashed rgba(204, 255, 0, 0.45)',
              borderRadius: '14px',
              padding: '1rem',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                <ShieldCheck size={16} color="#ccff00" />
                <span>Verify Pickup with Customer PIN</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                Expected: <strong style={{ fontFamily: 'var(--font-mono)', color: '#ccff00', fontSize: '0.95rem' }}>{order.pin}</strong>
              </span>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ff3355', fontSize: '0.78rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                maxLength={4}
                placeholder="PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '110px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '0.15em',
                  borderRadius: '8px',
                  border: '1.5px solid #ccff00',
                  background: '#09090b',
                  color: '#ccff00',
                  padding: '0.45rem',
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <span>Verify & Fulfill</span>
              </button>
            </form>

            <button
              type="button"
              onClick={handleQuickVerify}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#ccff00',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              ⚡ 1-Click Demo Verify ({order.pin})
            </button>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '12px',
              padding: '0.85rem',
              textAlign: 'center',
              color: '#34d399',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>STALL ORDER VERIFIED & FULFILLED</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
              Authenticated via PIN <strong>{order.pin}</strong> • {formatDateTime(order.verifiedAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
