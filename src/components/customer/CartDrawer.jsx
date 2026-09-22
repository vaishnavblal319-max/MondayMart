import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

export const CartDrawer = ({ isOpen, onClose, onOrderPlaced }) => {
  const { cart, products, addToCart, removeFromCart, clearCart, placeOrder } = useMarket();
  const { currentUser } = useAuth();

  const [address, setAddress] = useState('IEDC Stall Express Pickup (Order Pass)');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  useEffect(() => {
    setCustomerName(currentUser?.name || '');
    setCustomerPhone(currentUser?.phone || '');
  }, [currentUser]);

  if (!isOpen) return null;

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = products.find((p) => p.id === id);
      return prod ? { product: prod, quantity: qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const taxes = Math.round(subtotal * 0.05);
  const packaging = cartItems.length > 0 ? 15 : 0;
  const delivery = subtotal > 499 || subtotal === 0 ? 0 : 35;
  const grandTotal = subtotal + taxes + packaging + delivery;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const order = placeOrder({
      customer: {
        id: currentUser?.id || 'guest',
        name: customerName,
        email: currentUser?.email || 'guest@gmail.com',
        phone: customerPhone,
      },
      deliveryAddress: address,
      notes,
    });

    if (order) {
      onOrderPlaced(order);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        style={{
          width: '100%',
          maxWidth: '470px',
          height: '100vh',
          backgroundColor: '#111116',
          boxShadow: '-15px 0 50px rgba(0, 0, 0, 0.9)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0d0d12',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00' }}>
              <ShoppingBag size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              Campus Cart
            </h3>
            <span className="badge badge-primary" style={{ padding: '0.2rem 0.65rem', fontSize: '0.72rem' }}>
              {cartItems.length} items
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="btn btn-ghost btn-sm"
                style={{ color: '#ff3355', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Clear
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#71717a' }}>
              <ShoppingBag size={56} color="#3f3f46" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: '#a1a1aa' }}>
                Explore campus stall specials and grab your favorites!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      background: '#181822',
                      padding: '0.75rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                        {formatCurrency(product.price)} each
                      </div>
                    </div>

                    {/* Stepper */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#000000',
                        border: '1.5px solid #ccff00',
                        borderRadius: '8px',
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(product.id)}
                        style={{ border: 'none', background: 'none', padding: '4px 6px', cursor: 'pointer', color: '#ccff00' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0 4px', minWidth: '20px', textAlign: 'center', color: '#ccff00', fontFamily: 'var(--font-mono)' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={quantity >= product.quantity}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: '4px 6px',
                          cursor: quantity >= product.quantity ? 'not-allowed' : 'pointer',
                          color: quantity >= product.quantity ? '#52525b' : '#ccff00',
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ccff00', minWidth: '60px', textAlign: 'right', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(product.price * quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery / Pickup Details */}
              <div
                style={{
                  background: '#181822',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.85rem', color: '#ffffff' }}>
                  <MapPin size={16} color="#ccff00" />
                  <span>Pickup & Verification Details</span>
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Student / Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Pickup Counter / Stall</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Stall 2 Quadrangle"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Cooking / Preparation Notes (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra spicy, less ice, etc."
                  />
                </div>
              </div>

              {/* Bill Details */}
              <div
                style={{
                  background: '#14141b',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '1.1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.85rem' }}>
                  Bill Summary
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', color: '#a1a1aa' }}>
                  <span>Item Total</span>
                  <span style={{ color: '#ffffff' }}>{formatCurrency(subtotal)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', color: '#a1a1aa' }}>
                  <span>Govt Taxes (5% GST)</span>
                  <span style={{ color: '#ffffff' }}>{formatCurrency(taxes)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', color: '#a1a1aa' }}>
                  <span>Packaging & Safety</span>
                  <span style={{ color: '#ffffff' }}>{formatCurrency(packaging)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', color: '#a1a1aa' }}>
                  <span>Express Stall Handling</span>
                  <span>{delivery === 0 ? <span style={{ color: '#34d399', fontWeight: 700 }}>FREE</span> : <span style={{ color: '#ffffff' }}>{formatCurrency(delivery)}</span>}</span>
                </div>

                <div
                  style={{
                    borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                    paddingTop: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#ffffff',
                  }}
                >
                  <span>To Pay</span>
                  <span style={{ color: '#ccff00', fontFamily: 'var(--font-heading)' }}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* QR Verification Reminder */}
              <div
                style={{
                  backgroundColor: 'rgba(204, 255, 0, 0.08)',
                  border: '1px solid rgba(204, 255, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <Sparkles size={18} color="#ccff00" flexShrink={0} />
                <span>
                  Placing this order immediately generates your verified <strong>QR Pass & Random 4-digit PIN</strong> for pickup!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: '#0d0d12',
            }}
          >
            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', gap: '0.5rem' }}
            >
              <span>Place Order & Get QR Pass</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
