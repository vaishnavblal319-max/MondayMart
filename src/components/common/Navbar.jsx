import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  LogOut,
  User,
  Clock,
  Sparkles,
  ChevronDown,
  ArrowRightLeft,
  Wifi,
} from 'lucide-react';

export const Navbar = ({
  onOpenLogin,
  onOpenCustomerRegister,
  onOpenSellerRegister,
  onOpenAdminApproval,
  onOpenCart,
  onOpenOrders,
  onOpenFirebaseSetup,
  currentView: _currentView,
  setCurrentView,
}) => {
  const { currentUser, logout, login, registerCustomer, pendingSellers } = useAuth();
  const { cart, orders } = useMarket();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const cartItemCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  const pendingCount = pendingSellers.filter((s) => s.status === 'pending').length;
  const activeCustomerOrders = orders.filter((o) => {
    const isActive = o.status !== 'completed' && o.status !== 'cancelled';
    if (!isActive) return false;
    if (currentUser) {
      return o.customer.email === currentUser.email || o.customer.id === currentUser.id;
    }
    return o.customer.id === 'guest';
  }).length;

  const handleQuickDemo = (type) => {
    setShowDemoMenu(false);
    if (type === 'customer') {
      // Auto-create a demo customer account if it doesn't exist yet
      registerCustomer({ name: 'Demo Student', email: 'demo@student.com', phone: '+91 98765 43210' });
      setCurrentView('customer');
    } else if (type === 'seller') {
      // Pre-approved demo seller account
      login('freshbakes@mondaymart.in');
      setCurrentView('seller');
    } else if (type === 'admin') {
      login('admin@mondaymart.in');
      onOpenAdminApproval();
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(9, 9, 11, 0.90)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo with IEDC Theme */}
        <div
          onClick={() => setCurrentView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#000000',
              border: '2px solid #ccff00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ccff00',
              fontWeight: 800,
              fontSize: '1.3rem',
              boxShadow: '0 0 18px rgba(204, 255, 0, 0.35)',
            }}
          >
            M⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Monday<span style={{ color: '#ccff00', textShadow: '0 0 10px rgba(204, 255, 0, 0.4)' }}>Market</span>
              </span>
              <span
                style={{
                  background: 'rgba(204, 255, 0, 0.15)',
                  color: '#ccff00',
                  border: '1px solid rgba(204, 255, 0, 0.4)',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '6px',
                  letterSpacing: '0.05em',
                }}
              >
                IEDC
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 500, lineHeight: 1 }}>
              Student Innovation & Campus Stalls
            </p>
          </div>
        </div>

        {/* Center / Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Local Mode Status Badge */}
          <div
            title="Running in local mode — data is saved in your browser"
            style={{
              borderRadius: '9999px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              gap: '0.45rem',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#22d3ee',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#22d3ee',
                boxShadow: '0 0 6px #22d3ee',
              }}
            />
            <Wifi size={13} color="#22d3ee" />
            <span>Local Mode</span>
          </div>

          {/* Quick Demo Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: '9999px',
                borderColor: 'rgba(204, 255, 0, 0.3)',
                backgroundColor: 'rgba(204, 255, 0, 0.08)',
                color: '#ccff00',
                gap: '0.35rem',
              }}
            >
              <Sparkles size={14} color="#ccff00" />
              <span>Demo Personas</span>
              <ChevronDown size={14} />
            </button>

            {showDemoMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: '#121218',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 20px rgba(204, 255, 0, 0.1)',
                  padding: '0.5rem',
                  minWidth: '250px',
                  zIndex: 1001,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  IEDC Instant Persona Switcher
                </div>
                <button
                  onClick={() => handleQuickDemo('customer')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00' }}>
                    <User size={15} />
                  </div>
                  <div>
                    <div>Rahul (Student Customer)</div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 400 }}>Browse stalls & place order</div>
                  </div>
                </button>
                <button
                  onClick={() => handleQuickDemo('seller')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00' }}>
                    <Store size={15} />
                  </div>
                  <div>
                    <div>Chef Marco (Campus Stall)</div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 400 }}>freshbakes@mondaymart.in</div>
                  </div>
                </button>
                <button
                  onClick={() => handleQuickDemo('admin')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <div>IEDC Incubation Admin</div>
                    <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 400 }}>Approve ventures ({pendingCount} pending)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Status / Action Buttons */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button onClick={onOpenLogin} className="btn btn-ghost btn-sm" style={{ color: '#ffffff' }}>
                Sign In
              </button>
              <button
                onClick={onOpenSellerRegister}
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'rgba(204, 255, 0, 0.4)', color: '#ccff00' }}
              >
                <Store size={15} />
                <span>Launch Venture</span>
              </button>
              <button onClick={onOpenCustomerRegister} className="btn btn-primary btn-sm">
                Register
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Role Indicator & Portal Switcher */}
              {currentUser.role === 'seller' ? (
                <>
                  <button
                    onClick={() => setCurrentView('customer')}
                    className="btn btn-ghost btn-sm"
                    title="Preview Customer Storefront"
                    style={{ gap: '0.35rem', color: '#a1a1aa' }}
                  >
                    <ArrowRightLeft size={14} />
                    <span>Customer View</span>
                  </button>
                  <div className="badge badge-iedc" style={{ padding: '0.4rem 0.85rem' }}>
                    <Store size={14} />
                    <span>{currentUser.storeName || 'Stall Hub'}</span>
                  </div>
                </>
              ) : currentUser.role === 'admin' ? (
                <>
                  <button
                    onClick={onOpenAdminApproval}
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: '#ccff00', color: '#ccff00', background: 'rgba(204, 255, 0, 0.1)' }}
                  >
                    <ShieldCheck size={15} />
                    <span>Review Ventures ({pendingCount})</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Customer view controls */}
                  <button
                    onClick={onOpenOrders}
                    className="btn btn-secondary btn-sm"
                    style={{ position: 'relative', gap: '0.4rem' }}
                  >
                    <Clock size={16} />
                    <span>My Orders</span>
                    {activeCustomerOrders > 0 && (
                      <span
                        style={{
                          backgroundColor: '#ccff00',
                          color: '#000000',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          padding: '1px 6px',
                          boxShadow: '0 0 10px rgba(204, 255, 0, 0.5)',
                        }}
                      >
                        {activeCustomerOrders}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={onOpenCart}
                    className="btn btn-primary btn-sm"
                    style={{ position: 'relative', gap: '0.4rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#000000',
                          color: '#ccff00',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          borderRadius: '9999px',
                          padding: '1px 7px',
                          border: '1px solid #ccff00',
                        }}
                      >
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* User Avatar & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <img
                  src={
                    currentUser.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`
                  }
                  alt={currentUser.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ccff00',
                    boxShadow: '0 0 10px rgba(204, 255, 0, 0.3)',
                  }}
                />
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('landing');
                  }}
                  className="btn btn-ghost btn-sm"
                  title="Sign Out"
                  style={{ padding: '0.4rem', color: '#71717a' }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
