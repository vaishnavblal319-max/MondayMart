import React, { useState } from 'react';
import { X, Clock, QrCode, ChevronRight, ShoppingBag } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { QRCodeDisplay } from '../common/QRCodeDisplay';

export const MyOrdersModal = ({ isOpen, onClose }) => {
  const { orders } = useMarket();
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isOpen) return null;

  const userOrders = orders.filter((o) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser) {
      return (
        o.customer.email === currentUser.email ||
        o.customer.id === currentUser.id
      );
    }
    return o.customer.id === 'guest';
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>My Orders & QR Passes</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Revisit active pickup PINs and previous order receipts</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          {selectedOrder ? (
            <div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-secondary btn-sm"
                style={{ marginBottom: '1.25rem' }}
              >
                ← Back to All Orders
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', alignItems: 'center' }}>
                <QRCodeDisplay
                  value={selectedOrder.qrPayload}
                  pin={selectedOrder.pin}
                  size={180}
                  showPinPill={true}
                />

                <div
                  style={{
                    background: '#181822',
                    borderRadius: '16px',
                    padding: '1.4rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                      #{selectedOrder.id}
                    </span>
                    <span className={selectedOrder.status === 'completed' ? 'badge badge-success' : 'badge badge-iedc'}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '1rem' }}>
                    Placed on: {formatDateTime(selectedOrder.createdAt)}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.85rem', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                      Items Ordered:
                    </div>
                    {selectedOrder.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.35rem' }}>
                        <span>{it.quantity}x {it.product.name}</span>
                        <span style={{ color: '#ffffff' }}>{formatCurrency(it.unitPrice * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.15)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#ffffff' }}>
                    <span>Total Amount:</span>
                    <span style={{ color: '#ccff00', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : userOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#71717a' }}>
              <ShoppingBag size={48} color="#3f3f46" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>No campus orders found</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#a1a1aa' }}>
                Your placed orders and pickup QR passes will be tracked here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userOrders.map((order) => {
                const isActive = order.status !== 'completed' && order.status !== 'cancelled';
                return (
                  <div
                    key={order.id}
                    style={{
                      background: '#14141b',
                      border: isActive ? '1.5px solid rgba(204, 255, 0, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      boxShadow: isActive ? '0 6px 20px rgba(0, 0, 0, 0.7), 0 0 15px rgba(204, 255, 0, 0.12)' : 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                          #{order.id}
                        </span>
                        <span className={order.status === 'completed' ? 'badge badge-success' : 'badge badge-iedc'}>
                          {order.status === 'completed' ? '✓ COMPLETED' : '● ACTIVE ORDER'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                        {order.items.length} items • {formatDateTime(order.createdAt)}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: '#d4d4d8', marginTop: '0.35rem' }}>
                        Total: <strong style={{ color: '#ccff00' }}>{formatCurrency(order.totalAmount)}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Show quick PIN preview */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          PIN
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.15rem', color: '#ccff00', background: '#000000', padding: '2px 8px', borderRadius: '6px', border: '1px solid #ccff00' }}>
                          {order.pin}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.45rem' }}
                      >
                        <QrCode size={16} color="#ccff00" />
                        <span>View QR Pass</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
