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
  ArrowRightLeft,
  Wifi,
  Menu,
  X,
  Plus,
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
  const { currentUser, logout, pendingSellers } = useAuth();
  const { cart, orders } = useMarket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavAction = (action) => {
    setMobileMenuOpen(false);
    if (action) action();
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        {/* Brand Logo with IEDC Theme */}
        <div
          onClick={() => handleNavAction(() => setCurrentView('landing'))}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#000000',
              border: '2px solid #ccff00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ccff00',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 0 16px rgba(204, 255, 0, 0.35)',
            }}
          >
            M⚡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Monday<span style={{ color: '#ccff00', textShadow: '0 0 10px rgba(204, 255, 0, 0.4)' }}>Market</span>
              </span>
              <span
                style={{
                  background: 'rgba(204, 255, 0, 0.15)',
                  color: '#ccff00',
                  border: '1px solid rgba(204, 255, 0, 0.4)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '5px',
                  letterSpacing: '0.05em',
                }}
              >
                IEDC
              </span>
            </div>
            <p className="hide-sm" style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 500, lineHeight: 1 }}>
              Student Innovation & Campus Stalls
            </p>
          </div>
        </div>

        {/* Center / Navigation Actions (Desktop only) */}
        <div className="hide-mobile" style={{ alignItems: 'center', gap: '0.75rem' }}>
          {/* Cloud Firestore Live Status Badge */}
          <button
            onClick={onOpenFirebaseSetup}
            title="Connected to Firebase Cloud Firestore (monday-mart-27b80) — Click to view database details"
            style={{
              borderRadius: '9999px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              gap: '0.5rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 8px #34d399',
              }}
            />
            <Wifi size={13} color="#34d399" />
            <span>Cloud Firestore Live</span>
          </button>
        </div>

        {/* Right Side: Desktop Controls & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Mobile Cart Quick Icon (Always accessible on phones) */}
          <button
            onClick={onOpenCart}
            className="btn btn-primary btn-sm show-mobile"
            style={{ position: 'relative', padding: '0.45rem 0.75rem', gap: '0.35rem' }}
          >
            <ShoppingBag size={16} />
            {cartItemCount > 0 && (
              <span
                style={{
                  backgroundColor: '#000000',
                  color: '#ccff00',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  borderRadius: '9999px',
                  padding: '0px 5px',
                  border: '1px solid #ccff00',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary btn-sm show-mobile"
            style={{ padding: '0.45rem', borderColor: mobileMenuOpen ? '#ccff00' : 'rgba(255, 255, 255, 0.2)', color: mobileMenuOpen ? '#ccff00' : '#ffffff' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop User Status / Action Buttons */}
          <div className="hide-mobile" style={{ alignItems: 'center', gap: '0.75rem' }}>
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
                {/* Role Specific Actions */}
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
                      onClick={() => setCurrentView('admin')}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: '#ccff00', color: '#ccff00', background: 'rgba(204, 255, 0, 0.1)' }}
                    >
                      <ShieldCheck size={15} />
                      <span>IEDC Approvals ({pendingCount})</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('customer')}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#a1a1aa', gap: '0.35rem' }}
                    >
                      <ArrowRightLeft size={14} />
                      <span>Marketplace View</span>
                    </button>
                  </>
                ) : (
                  <>
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
      </div>

      {/* Mobile Drawer Navigation (Slide-Down Menu for Phones & Tablets) */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer show-mobile"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            right: 0,
            background: 'rgba(17, 17, 22, 0.98)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1.5px solid rgba(204, 255, 0, 0.3)',
            padding: '1.25rem',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.95)',
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
          }}
        >
          {/* User Profile Card if Logged In */}
          {currentUser ? (
            <div
              style={{
                background: '#14141b',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={
                    currentUser.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`
                  }
                  alt={currentUser.name}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ccff00',
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <span className={currentUser.role === 'admin' ? 'badge badge-iedc' : currentUser.role === 'seller' ? 'badge badge-primary' : 'badge badge-secondary'}>
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => handleNavAction(onOpenLogin)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavAction(onOpenCustomerRegister)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Register as Customer
              </button>
              <button
                onClick={() => handleNavAction(onOpenSellerRegister)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(204, 255, 0, 0.4)', color: '#ccff00' }}
              >
                <Store size={16} />
                <span>Launch Student Venture</span>
              </button>
            </div>
          )}

          {/* Quick Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => handleNavAction(() => setCurrentView('customer'))}
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start', gap: '0.75rem', color: '#ffffff', padding: '0.75rem' }}
            >
              <ShoppingBag size={18} color="#ccff00" />
              <span>Explore Marketplace Menu</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => handleNavAction(() => setCurrentView('admin'))}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: '0.75rem', color: '#ccff00', borderColor: 'rgba(204, 255, 0, 0.4)', padding: '0.75rem' }}
              >
                <ShieldCheck size={18} color="#ccff00" />
                <span>IEDC Approvals Console ({pendingCount} pending)</span>
              </button>
            )}

            {currentUser?.role === 'seller' && (
              <button
                onClick={() => handleNavAction(() => setCurrentView('seller'))}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: '0.75rem', color: '#ccff00', borderColor: 'rgba(204, 255, 0, 0.4)', padding: '0.75rem' }}
              >
                <Store size={18} color="#ccff00" />
                <span>Seller Dashboard ({currentUser.storeName})</span>
              </button>
            )}

            {/* Customer Orders */}
            <button
              onClick={() => handleNavAction(onOpenOrders)}
              className="btn btn-ghost"
              style={{ justifyContent: 'flex-start', gap: '0.75rem', color: '#ffffff', padding: '0.75rem' }}
            >
              <Clock size={18} color="#ccff00" />
              <span>My Orders & Pickup Passes {activeCustomerOrders > 0 && `(${activeCustomerOrders})`}</span>
            </button>
          </div>

          {/* Database Info Pill */}
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => handleNavAction(onOpenFirebaseSetup)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                <span>Cloud Firestore Live</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>View Collections →</span>
            </button>
          </div>

          {/* Sign Out on Mobile */}
          {currentUser && (
            <button
              onClick={() => {
                logout();
                handleNavAction(() => setCurrentView('landing'));
              }}
              className="btn btn-ghost"
              style={{ justifyContent: 'center', color: '#ff3355', gap: '0.5rem', marginTop: '0.25rem' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
