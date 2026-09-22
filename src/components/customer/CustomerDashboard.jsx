import React, { useState, useMemo } from 'react';
import { Search, QrCode, ArrowRight } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { ProductCard } from './ProductCard';
import { formatCurrency } from '../../utils/helpers';

export const CustomerDashboard = ({ onOpenCart, onOpenOrders }) => {
  const { products, cart, orders } = useMarket();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const categories = ['All', 'Fast Food', 'Pizzas', 'Meals', 'Bakery', 'Beverages', 'Healthy Bowls', 'Desserts'];

  // Active customer orders
  const activeOrders = orders.filter((o) => {
    const isActive = o.status !== 'completed' && o.status !== 'cancelled';
    if (!isActive) return false;
    if (currentUser) {
      return o.customer.email === currentUser.email || o.customer.id === currentUser.id;
    }
    return o.customer.id === 'guest';
  });

  // Cart summary for bottom bar
  const cartItemCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find((p) => p.id === id);
    return prod ? sum + prod.price * qty : sum;
  }, 0);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVeg = vegOnly ? item.isVeg : true;
        return matchesCategory && matchesSearch && matchesVeg;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'stock') return b.quantity - a.quantity;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, vegOnly, sortBy]);

  return (
    <div style={{ padding: '2rem 0 6rem' }}>
      <div className="container">
        {/* Active Order Banner Alert if customer has live order */}
        {activeOrders.length > 0 && (
          <div
            onClick={onOpenOrders}
            style={{
              background: 'linear-gradient(135deg, rgba(204, 255, 0, 0.1) 0%, #121218 100%)',
              border: '1.5px solid rgba(204, 255, 0, 0.45)',
              borderRadius: '16px',
              padding: '1.1rem 1.4rem',
              marginBottom: '2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(204, 255, 0, 0.15)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ccff00';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(204, 255, 0, 0.45)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#000000',
                  border: '1.5px solid #ccff00',
                  color: '#ccff00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(204, 255, 0, 0.3)',
                }}
              >
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                  You have {activeOrders.length} active campus pickup order! (Order #{activeOrders[0].id})
                </div>
                <div style={{ fontSize: '0.82rem', color: '#a1a1aa', fontWeight: 600, marginTop: '0.15rem' }}>
                  Pickup PIN: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#ccff00', background: '#000000', padding: '1px 7px', borderRadius: '4px', border: '1px solid #ccff00' }}>{activeOrders[0].pin}</span> • Tap to open QR pass
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ccff00', fontWeight: 700, fontSize: '0.9rem' }}>
              <span>Show QR Pass</span>
              <ArrowRight size={16} />
            </div>
          </div>
        )}

        {/* Search and Filters Header */}
        <div style={{ marginBottom: '2.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '520px' }}>
              <Search
                size={18}
                color="#71717a"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search campus stalls for burgers, bowls, pizza, bakes..."
                style={{ paddingLeft: '2.8rem', borderRadius: '9999px', backgroundColor: '#14141b', borderColor: 'rgba(255, 255, 255, 0.12)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Veg Only Switch */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: vegOnly ? 'rgba(16, 185, 129, 0.15)' : '#14141b',
                  border: vegOnly ? '1.5px solid #10b981' : '1.5px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '9999px',
                  color: vegOnly ? '#34d399' : '#a1a1aa',
                  transition: 'var(--transition)',
                }}
              >
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '0.9rem' }}>🥬</span>
                <span>Veg Only</span>
              </label>

              {/* Sort Dropdown */}
              <select
                className="form-select"
                style={{ padding: '0.5rem 1.1rem', borderRadius: '9999px', fontSize: '0.85rem', width: 'auto', backgroundColor: '#14141b', borderColor: 'rgba(255, 255, 255, 0.12)', color: '#ffffff' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Availability / Stock</option>
              </select>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.5rem 1.2rem',
                    borderRadius: '9999px',
                    border: isActive ? '1.5px solid #ccff00' : '1.5px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: isActive ? '#ccff00' : '#14141b',
                    color: isActive ? '#000000' : '#a1a1aa',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                    boxShadow: isActive ? '0 0 15px rgba(204, 255, 0, 0.4)' : 'none',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#71717a' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏪</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
              Campus Stalls Setting Up…
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#a1a1aa', maxWidth: '400px', margin: '0 auto' }}>
              No vendor has listed items yet. Once a seller logs in and adds products to their stall, they'll appear here instantly.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#71717a' }}>
            <Search size={48} color="#3f3f46" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>No matching items found</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#a1a1aa' }}>
              Try a different search term or clear your category filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Sticky Cart Bar */}
      {cartItemCount > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 800,
            maxWidth: '520px',
            width: 'calc(100% - 2rem)',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div
            onClick={onOpenCart}
            style={{
              backgroundColor: '#09090b',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.95), 0 0 25px rgba(204, 255, 0, 0.35)',
              cursor: 'pointer',
              border: '1.5px solid #ccff00',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  backgroundColor: '#ccff00',
                  color: '#000000',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                }}
              >
                {cartItemCount}
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                  Total: <strong style={{ color: '#ccff00' }}>{formatCurrency(cartSubtotal)}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ccff00', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>
              <span>View Cart & QR Pass</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
