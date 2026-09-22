import React from 'react';
import { Plus, Minus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { formatCurrency } from '../../utils/helpers';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart } = useMarket();
  const cartQty = cart[product.id] || 0;
  const isOutOfStock = product.quantity <= 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;
  const isMaxInCart = cartQty >= product.quantity;

  return (
    <div
      style={{
        background: '#121217',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--transition)',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#ccff00';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(204, 255, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isOutOfStock ? 'grayscale(90%) opacity(0.5)' : 'none',
          }}
        />

        {/* Veg / Non-Veg badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className={product.isVeg ? 'badge badge-veg' : 'badge badge-non-veg'}>
            {product.isVeg ? '● VEG' : '▲ NON-VEG'}
          </span>
        </div>

        {/* Rating */}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          <span
            className="badge"
            style={{ backgroundColor: '#000000', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.4)', backdropFilter: 'blur(4px)' }}
          >
            ★ {product.rating}
          </span>
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff3355',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.08em',
              border: '1px solid rgba(255, 51, 85, 0.4)',
            }}
          >
            OUT OF STOCK
          </div>
        ) : isLowStock ? (
          <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
            <span
              className="badge"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', fontSize: '0.7rem' }}
            >
              <AlertTriangle size={12} />
              Only {product.quantity} left!
            </span>
          </div>
        ) : (
          <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
            <span
              className="badge badge-success"
              style={{ fontSize: '0.7rem' }}
            >
              <CheckCircle2 size={12} />
              In Stock ({product.quantity})
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ccff00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category}
          </span>
          {product.sellerStore && (
            <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
              {product.sellerStore}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
          {product.name}
        </h3>
        <p
          style={{
            fontSize: '0.82rem',
            color: '#a1a1aa',
            lineHeight: 1.45,
            marginBottom: '1.25rem',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Price & Add to Cart Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ccff00', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Stepper or Add Button */}
          {cartQty === 0 ? (
            <button
              onClick={() => addToCart(product.id)}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{
                borderRadius: '8px',
                padding: '0.45rem 1.1rem',
                opacity: isOutOfStock ? 0.4 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              }}
            >
              <Plus size={15} />
              <span>ADD</span>
            </button>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#000000',
                border: '1.5px solid #ccff00',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 0 10px rgba(204, 255, 0, 0.25)',
              }}
            >
              <button
                onClick={() => removeFromCart(product.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0.65rem',
                  cursor: 'pointer',
                  color: '#ccff00',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Minus size={14} />
              </button>
              <span
                style={{
                  padding: '0 0.5rem',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#ccff00',
                  minWidth: '24px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {cartQty}
              </span>
              <button
                onClick={() => addToCart(product.id)}
                disabled={isMaxInCart}
                style={{
                  background: isMaxInCart ? 'rgba(255,255,255,0.05)' : 'none',
                  border: 'none',
                  padding: '0.4rem 0.65rem',
                  cursor: isMaxInCart ? 'not-allowed' : 'pointer',
                  color: isMaxInCart ? '#52525b' : '#ccff00',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={isMaxInCart ? 'Max available stock reached' : 'Add more'}
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
