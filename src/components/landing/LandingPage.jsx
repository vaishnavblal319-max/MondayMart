import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  QrCode,
  Zap,
  ShoppingBag,
  CheckCircle2,
  Rocket,
  Award,
  Store,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Flame,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { PromotionalBannerCarousel } from './PromotionalBannerCarousel';

export const LandingPage = ({
  onExploreMenu,
  onOpenSellerRegister,
  onOpenCustomerRegister: _onOpenCustomerRegister,
  onOpenLogin,
  onOpenAdminPosters,
  onSwitchToSeller,
}) => {
  const { products, cart, addToCart, removeFromCart } = useMarket();
  const { currentUser } = useAuth();

  // Full Menu toggle state
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Shortlisted items (top 4 featured specials)
  const shortlistedItems = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(['All']);
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products when "Show Full Menu" is expanded
  const fullFilteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerStore?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = vegOnly ? item.isVeg : true;
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [products, selectedCategory, searchQuery, vegOnly]);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* ──────────────────────────────────────────────────────────────────────────
          1. FIRST SECTION: CATCHY HEADER & AMAZON/FLIPKART STYLE SWIPEABLE POSTERS
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '2.5rem 0 1rem',
          background: 'linear-gradient(180deg, rgba(255, 242, 0, 0.05) 0%, rgba(9, 9, 11, 0) 100%)',
        }}
      >
        <div className="container">
          {/* Catchy Top Pitch / Announcement Ticker */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div
                className="badge badge-iedc"
                style={{
                  padding: '0.45rem 1rem',
                  fontSize: '0.78rem',
                  marginBottom: '0.65rem',
                  gap: '0.45rem',
                }}
              >
                <Flame size={14} color="#fff200" />
                <span>HOT CAMPUS DEALS & STUDENT VENTURES</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Campus Buzz, Announcements &{' '}
                <span className="text-neon" style={{ color: '#fff200' }}>
                  Zero Queues.
                </span>
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', marginTop: '0.35rem', maxWidth: '620px' }}>
                Browse official campus event brochures and notices below, pre-order from student culinary ventures, and pick up in seconds with verified PIN passes.
              </p>
            </div>

            {/* Quick action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button onClick={onExploreMenu} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                <ShoppingBag size={16} />
                <span>View Menu</span>
              </button>
              {currentUser?.role === 'seller' ? (
                <button
                  onClick={onSwitchToSeller}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.45rem', boxShadow: '0 0 16px rgba(255, 242, 0, 0.45)', fontWeight: 800 }}
                >
                  <Store size={16} />
                  <span>Seller Portal (Add Items & Orders)</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSellerRegister}
                  className="btn btn-secondary btn-sm"
                  style={{ borderColor: 'rgba(255, 242, 0, 0.4)', color: '#fff200' }}
                >
                  <Rocket size={16} />
                  <span>Open Stall</span>
                </button>
              )}
            </div>
          </div>

          {/* Swipeable Hero Posters / Brochures Carousel */}
          <PromotionalBannerCarousel
            onOpenAdminPosters={onOpenAdminPosters}
          />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. SECOND SECTION: SHORTLISTED MENU & OPTION TO SHOW FULL MENU
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        id="shortlisted-menu-section"
        style={{
          padding: '2.5rem 0 4rem',
          backgroundColor: '#0c0c10',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container">
          {/* Section Header with "Show Full Menu" Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span
                  className="badge"
                  style={{
                    backgroundColor: 'rgba(255, 242, 0, 0.15)',
                    color: '#fff200',
                    border: '1px solid rgba(255, 242, 0, 0.35)',
                    fontSize: '0.72rem',
                  }}
                >
                  <Sparkles size={13} />
                  <span>CURATED CAMPUS SPECIALS</span>
                </span>
                <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                  {showFullMenu ? `Showing ${fullFilteredProducts.length} items` : `Showing 4 Shortlisted Items`}
                </span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {showFullMenu ? 'Complete Campus Menu' : "Today's Shortlisted Menu"}
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.92rem', marginTop: '0.25rem' }}>
                {showFullMenu
                  ? 'Explore the entire catalog of snacks, meals, drinks & bakery from student stalls.'
                  : 'Handpicked top-rated student specialties ready for express pickup.'}
              </p>
            </div>

            {/* Toggle Button for Full Menu */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowFullMenu(!showFullMenu)}
                className="btn btn-primary"
                style={{
                  gap: '0.5rem',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '12px',
                  boxShadow: '0 0 20px rgba(255, 242, 0, 0.35)',
                }}
              >
                {showFullMenu ? (
                  <>
                    <span>Hide Full Menu (Show Shortlisted)</span>
                    <ChevronUp size={18} />
                  </>
                ) : (
                  <>
                    <span>Show Full Menu</span>
                    <ChevronDown size={18} />
                  </>
                )}
              </button>

              <button
                onClick={onExploreMenu}
                className="btn btn-secondary"
                style={{
                  padding: '0.65rem 1.2rem',
                  borderRadius: '12px',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  gap: '0.45rem',
                }}
              >
                <span>Full Order Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Expanded Full Menu Filters (Shown only when showFullMenu is TRUE) */}
          {showFullMenu && (
            <div
              style={{
                backgroundColor: '#121217',
                borderRadius: '18px',
                padding: '1.25rem',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                animation: 'slideUp 0.25s ease-out',
              }}
            >
              {/* Search + Veg Toggle */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search
                    size={18}
                    color="#fff200"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search dishes, drinks, or student stalls..."
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: vegOnly ? '#10b981' : '#a1a1aa',
                    padding: '0.6rem 1rem',
                    backgroundColor: vegOnly ? 'rgba(16, 185, 129, 0.15)' : '#181822',
                    borderRadius: '10px',
                    border: vegOnly ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                    style={{ accentColor: '#10b981' }}
                  />
                  <span>Pure Veg Only</span>
                </label>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.4rem 0.95rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      border: selectedCategory === cat ? '1px solid #fff200' : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: selectedCategory === cat ? '#fff200' : '#181824',
                      color: selectedCategory === cat ? '#000000' : '#d4d4d8',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards Grid: Shortlisted or Full */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* When showFullMenu is FALSE: Render the 4 Shortlisted Items */}
            {!showFullMenu ? (
              shortlistedItems.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                  No items listed yet. Student vendors are setting up!
                </div>
              ) : (
                shortlistedItems.map((item) => {
                  const qtyInCart = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#121217',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#fff200';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.8), 0 0 20px rgba(255, 242, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: '185px' }}>
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
                          <span
                            className="badge"
                            style={{
                              background: '#000000',
                              color: '#fff200',
                              border: '1px solid rgba(255, 242, 0, 0.4)',
                              backdropFilter: 'blur(6px)',
                            }}
                          >
                            ★ {item.rating}
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: 'rgba(9, 9, 11, 0.85)',
                              color: '#d4d4d8',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            {item.sellerStore || 'Campus Stall'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                          {item.description}
                        </p>

                        {/* Price & Cart Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                              Price
                            </span>
                            <span
                              style={{
                                fontSize: '1.35rem',
                                fontWeight: 800,
                                color: '#fff200',
                                fontFamily: 'var(--font-heading)',
                              }}
                            >
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          {qtyInCart > 0 ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#181824',
                                borderRadius: '10px',
                                padding: '3px',
                                border: '1px solid #fff200',
                              }}
                            >
                              <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#272733',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Minus size={14} />
                              </button>
                              <span style={{ fontWeight: 800, padding: '0 6px', color: '#fff200', fontSize: '0.9rem' }}>
                                {qtyInCart}
                              </span>
                              <button
                                onClick={() => addToCart(item.id)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#fff200',
                                  color: '#000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="btn btn-primary btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <Plus size={15} />
                              <span>Add to Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              /* When showFullMenu is TRUE: Render all filtered items */
              fullFilteredProducts.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3.5rem', color: '#a1a1aa' }}>
                  No campus specials found matching your filters.
                </div>
              ) : (
                fullFilteredProducts.map((item) => {
                  const qtyInCart = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: '#121217',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#fff200';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.8), 0 0 20px rgba(255, 242, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: '185px' }}>
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
                          <span
                            className="badge"
                            style={{
                              background: '#000000',
                              color: '#fff200',
                              border: '1px solid rgba(255, 242, 0, 0.4)',
                              backdropFilter: 'blur(6px)',
                            }}
                          >
                            ★ {item.rating}
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              backgroundColor: 'rgba(9, 9, 11, 0.85)',
                              color: '#d4d4d8',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            {item.sellerStore || 'Campus Stall'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: '#a1a1aa', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                          {item.description}
                        </p>

                        {/* Price & Cart Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'uppercase', display: 'block' }}>
                              Price
                            </span>
                            <span
                              style={{
                                fontSize: '1.35rem',
                                fontWeight: 800,
                                color: '#fff200',
                                fontFamily: 'var(--font-heading)',
                              }}
                            >
                              {formatCurrency(item.price)}
                            </span>
                          </div>

                          {qtyInCart > 0 ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#181824',
                                borderRadius: '10px',
                                padding: '3px',
                                border: '1px solid #fff200',
                              }}
                            >
                              <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#272733',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Minus size={14} />
                              </button>
                              <span style={{ fontWeight: 800, padding: '0 6px', color: '#fff200', fontSize: '0.9rem' }}>
                                {qtyInCart}
                              </span>
                              <button
                                onClick={() => addToCart(item.id)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  backgroundColor: '#fff200',
                                  color: '#000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="btn btn-primary btn-sm"
                              style={{ gap: '0.35rem' }}
                            >
                              <Plus size={15} />
                              <span>Add to Order</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. THIRD SECTION: THE DESCRIPTION WHICH WAS EARLIER AT THE FIRST
             (Hero Pitch, IEDC Hub Details, QR & PIN Simulation, How It Operates)
          ────────────────────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '4.5rem 0 3.5rem',
          background: 'linear-gradient(180deg, rgba(9, 9, 11, 0) 0%, rgba(255, 242, 0, 0.04) 50%, rgba(9, 9, 11, 0) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Column: The Original Hero Pitch & Description */}
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
              <Zap size={14} color="#fff200" />
              <span>IEDC Student Innovation & Entrepreneurship Hub</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.4rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Empowering Student Ventures.{' '}
              <span className="text-neon" style={{ color: '#fff200' }}>
                Zero Queue.
              </span>{' '}
              Instant QR & PIN Pickup.
            </h2>

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
                style={{ borderColor: 'rgba(255, 242, 0, 0.4)', color: '#fff200' }}
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
                <QrCode size={18} color="#fff200" />
                <span>PIN-Secured Pickup Protocol</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                <Award size={18} color="#06b6d4" />
                <span>100% Student Incubated</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Showcase with PIN & QR */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                background: '#121217',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 242, 0, 0.15)',
                border: '1px solid rgba(255, 242, 0, 0.3)',
                maxWidth: '400px',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>● LIVE VENTURE SIMULATION</span>
                <span style={{ fontSize: '0.8rem', color: '#fff200', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>#MM-IEDC84</span>
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
                  <div style={{ fontSize: '0.8rem', color: '#fff200', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>By The Burger Guild</span> • <span style={{ color: '#a1a1aa' }}>Stall #04 Campus Quad</span>
                  </div>
                </div>
              </div>

              {/* Dynamic QR Pass Simulation */}
              <div
                style={{
                  background: '#09090b',
                  border: '2px dashed rgba(255, 242, 0, 0.4)',
                  borderRadius: '16px',
                  padding: '1.2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Student Order Verification Pass
                </div>
                <div style={{ margin: '0.75rem 0' }}>
                  <div className="pin-pill" style={{ fontSize: '1.4rem', padding: '0.4rem 1.2rem', color: '#fff200', borderColor: '#fff200' }}>
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

      {/* ──────────────────────────────────────────────────────────────────────────
          4. HOW IT WORKS SECTION (ECOSYSTEM ARCHITECTURE)
          ────────────────────────────────────────────────────────────────────────── */}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: '1.75rem' }}>
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
                    backgroundColor: 'rgba(255, 242, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff200',
                    border: '1px solid rgba(255, 242, 0, 0.3)',
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
                  <span style={{ background: '#fff200', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    1
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Browse Campus Stalls</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Check live stock, student venture specials, and real-time prices.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#fff200', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
                    2
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>Checkout & Receive QR Pass</h4>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.2rem' }}>Your digital ticket generates instantly with an encrypted QR and 4-digit PIN.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <span style={{ background: '#fff200', color: '#000000', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, flexShrink: 0 }}>
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
                border: '1px solid rgba(255, 242, 0, 0.25)',
                transition: 'var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 242, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff200',
                    border: '1px solid #fff200',
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

      {/* ──────────────────────────────────────────────────────────────────────────
          5. SELLER CALLOUT BANNER (LAUNCH VENTURE WITH IEDC)
          ────────────────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 0 1rem' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #111116 0%, #000000 100%)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.25rem, 4vw, 2.5rem)',
              color: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 242, 0, 0.12)',
              border: '1px solid rgba(255, 242, 0, 0.4)',
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
              {currentUser?.role === 'seller' ? (
                <button
                  onClick={onSwitchToSeller}
                  className="btn btn-primary btn-lg"
                  style={{ gap: '0.5rem', boxShadow: '0 0 25px rgba(255, 242, 0, 0.45)', fontWeight: 800 }}
                >
                  <Store size={22} />
                  <span>Go to {currentUser.storeName || 'My Stall'} Dashboard</span>
                </button>
              ) : (
                <>
                  <button onClick={onOpenSellerRegister} className="btn btn-primary btn-lg">
                    <Rocket size={20} />
                    <span>Register Your Venture</span>
                  </button>
                  <button onClick={onOpenLogin} className="btn btn-secondary btn-lg" style={{ background: '#181822', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                    <span>Seller Login</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
