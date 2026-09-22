import React from 'react';
import {
  ArrowRight,
  QrCode,
  Zap,
  ShoppingBag,
  CheckCircle2,
  Rocket,
  Award,
  Store,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { formatCurrency } from '../../utils/helpers';

export const LandingPage = ({
  onExploreMenu,
  onOpenSellerRegister,
  onOpenCustomerRegister: _onOpenCustomerRegister,
  onOpenLogin,
}) => {
  const { products } = useMarket();
  const featured = products.slice(0, 4);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '4.5rem 0 3.5rem',
          background: 'linear-gradient(180deg, rgba(204, 255, 0, 0.05) 0%, rgba(9, 9, 11, 0) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: Hero Pitch */}
          <div>
            <div
              className="badge badge-iedc"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                marginBottom: '1.5rem',
                gap: '0.5rem',
              }}
            >
              <Zap size={14} color="#ccff00" />
              <span>IEDC Student Innovation & Entrepreneurship Hub</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Empowering Student Ventures.{' '}
              <span className="text-neon">
                Zero Queue.
              </span>{' '}
              Instant QR & PIN Pickup.
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#a1a1aa',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '560px',
              }}
            >
              The official campus marketplace powered by our <strong>IEDC team</strong>. Discover student-led culinary stalls, innovative crafts, and daily campus bites. Order seamlessly and collect at stalls with an encrypted <strong>dynamic QR pass and verified 4-digit PIN</strong>.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button onClick={onExploreMenu} className="btn btn-primary btn-lg" style={{ gap: '0.6rem' }}>
                <ShoppingBag size={20} />
                <span>Explore Campus Stalls</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onOpenSellerRegister}
                className="btn btn-secondary btn-lg"
                style={{ borderColor: 'rgba(204, 255, 0, 0.4)', color: '#ccff00' }}
              >
                <Rocket size={20} />
                <span>Launch Student Venture</span>
              </button>
            </div>

            {/* Micro proof badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Verified IEDC Campus Stalls</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                <QrCode size={18} color="#ccff00" />
                <span>PIN-Secured Pickup Protocol</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                <Award size={18} color="#06b6d4" />
                <span>100% Student Incubated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Showcase */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                background: '#121217',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(204, 255, 0, 0.15)',
                border: '1px solid rgba(204, 255, 0, 0.3)',
                maxWidth: '400px',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>● LIVE VENTURE SIMULATION</span>
                <span style={{ fontSize: '0.8rem', color: '#ccff00', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>#MM-IEDC84</span>
              </div>

              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '180px', marginBottom: '1.25rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                  alt="Truffle Smash Burger"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92), transparent)',
                    padding: '0.85rem',
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Truffle Glazed Smash Burger</div>
                  <div style={{ fontSize: '0.8rem', color: '#ccff00', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>By The Burger Guild</span> • <span style={{ color: '#a1a1aa' }}>Stall #04 Campus Quad</span>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Pass Simulation */}
              <div
                style={{
                  background: '#09090b',
                  border: '2px dashed rgba(204, 255, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Order Verification Pass
                </div>
                <div style={{ margin: '0.75rem 0' }}>
                  <div className="pin-pill" style={{ fontSize: '1.4rem', padding: '0.4rem 1.2rem' }}>
                    7492
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={14} />
                  <span>Instant Scannable QR & PIN on Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0 3.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-iedc" style={{ marginBottom: '0.75rem' }}>CAMPUS ECOSYSTEM ARCHITECTURE</span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#ffffff' }}>
              How MondayMarket × IEDC Operates
            </h2>
            <p style={{ color: '#a1a1aa', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              Engineered for seamless campus pickup, cashless efficiency, and student venture incubation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Customer Column */}
            <div
              style={{
                background: '#121217',
                borderRadius: '20px',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(204, 255, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ccff00',
                    border: '1px solid rgba(204, 255, 0, 0.3)',
                  }}
                >
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>For Students & Foodies</h3>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Skip the break-time queues and grab lunch fast</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ccff00', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    1
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Browse Campus Stalls</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Check live stock, student venture specials, and real-time prices.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ccff00', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    2
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Checkout & Receive QR Pass</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Your digital ticket generates instantly with an encrypted QR and 4-digit PIN.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ccff00', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    3
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Instant Pickup Verification</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Flash your QR code or state your PIN at the stall to collect your order instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Column */}
            <div
              style={{
                background: '#121217',
                borderRadius: '20px',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid rgba(204, 255, 0, 0.25)',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(204, 255, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ccff00',
                    border: '1px solid #ccff00',
                  }}
                >
                  <Store size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>For Student Entrepreneurs</h3>
                  <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Official incubated ventures on @mondaymart.in</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ffffff', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    1
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Apply with Student KYC & OTP</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Submit venture details, category, and verify your mobile number with OTP.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ffffff', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    2
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>IEDC Incubation Cell Approval</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Our IEDC admin reviews your stall and provisions official verified seller credentials.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#ffffff', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    3
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Live Orders & Real-time Revenue</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Process orders, verify customer PINs in seconds, and track stall sales live.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Teaser */}
      <section style={{ padding: '3rem 0 4.5rem', backgroundColor: '#0d0d12', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-iedc" style={{ marginBottom: '0.5rem' }}>TOP STALL SPECIALS TODAY</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>Trending Campus Delights</h2>
            </div>
            <button onClick={onExploreMenu} className="btn btn-outline-neon btn-sm" style={{ gap: '0.4rem' }}>
              <span>View Full Campus Menu</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {featured.length === 0 ? (
              /* Placeholder cards shown when no products listed yet */
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    background: '#121217',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px dashed rgba(204, 255, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '280px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    color: '#3f3f46',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <Store size={32} color="#3f3f46" />
                  <div style={{ fontSize: '0.85rem', color: '#52525b', fontWeight: 600 }}>Stall Opening Soon</div>
                  <div style={{ fontSize: '0.75rem', color: '#3f3f46' }}>Vendor listing products...</div>
                </div>
              ))
            ) : (
              featured.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#121217',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ccff00';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(204, 255, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                >
                  <div style={{ position: 'relative', height: '170px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className={item.isVeg ? 'badge badge-veg' : 'badge badge-non-veg'}>
                        {item.isVeg ? '● VEG' : '▲ NON-VEG'}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                      <span className="badge" style={{ background: '#000000', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.4)' }}>
                        ★ {item.rating}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '1.25rem', flex: 1 }}>
                      {item.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ccff00', fontFamily: 'var(--font-heading)' }}>
                        {formatCurrency(item.price)}
                      </span>
                      <button onClick={onExploreMenu} className="btn btn-primary btn-sm">Order</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Seller Callout Banner */}
      <section style={{ padding: '3.5rem 0 1rem' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #111116 0%, #000000 100%)',
              borderRadius: '24px',
              padding: '3.5rem 2.5rem',
              color: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(204, 255, 0, 0.12)',
              border: '1px solid rgba(204, 255, 0, 0.4)',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span className="badge badge-iedc" style={{ marginBottom: '1rem' }}>
                FOR STUDENT FOUNDERS & MERCHANTS
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.85rem' }}>
                Launch Your Campus Venture with IEDC
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.05rem', lineHeight: 1.65 }}>
                Register your stall, verify student credentials via instant SMS OTP, and receive an official verified <strong>@mondaymart.in</strong> seller account with full real-time order dashboard and PIN pickup controls.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={onOpenSellerRegister} className="btn btn-primary btn-lg">
                <Rocket size={20} />
                <span>Register Your Venture</span>
              </button>
              <button onClick={onOpenLogin} className="btn btn-secondary btn-lg" style={{ background: '#181822', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <span>Seller Login</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
