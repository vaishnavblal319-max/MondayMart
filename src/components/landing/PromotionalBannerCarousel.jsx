import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Shield, PlusCircle, Tag, Calendar } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';

export const PromotionalBannerCarousel = ({ onOpenAdminPosters }) => {
  const { banners } = useMarket();
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe detection refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 45;

  const totalBanners = banners?.length || 0;

  // Auto-advance slider every 4.5s
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, 4500);

    return () => clearInterval(interval);
  }, [totalBanners, isPaused]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handlePrev = () => {
    if (totalBanners === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  };

  const handleNext = () => {
    if (totalBanners === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  };

  if (!banners || banners.length === 0) {
    return (
      <div
        style={{
          background: '#121217',
          borderRadius: '24px',
          padding: '2.5rem',
          textAlign: 'center',
          border: '1px dashed rgba(255, 242, 0, 0.3)',
          marginBottom: '2rem',
        }}
      >
        <Sparkles size={32} color="#fff200" style={{ margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>Campus Brochure Showcase</h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          No event brochures or announcements uploaded yet.
        </p>
        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenAdminPosters}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '1rem', gap: '0.4rem' }}
          >
            <PlusCircle size={16} />
            <span>Upload Brochure from Device (Admin)</span>
          </button>
        )}
      </div>
    );
  }

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '2.5rem',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Admin Quick Action Pill (shown only to Admin) */}
      {currentUser?.role === 'admin' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '0.65rem',
          }}
        >
          <button
            onClick={onOpenAdminPosters}
            className="btn btn-outline-neon btn-sm"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.8rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(18, 18, 23, 0.85)',
              backdropFilter: 'blur(8px)',
              gap: '0.4rem',
            }}
          >
            <Shield size={14} color="#fff200" />
            <span>Admin: Manage Brochures / Posters ({banners.length})</span>
          </button>
        </div>
      )}

      {/* Main Banner Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          minHeight: '340px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 0 30px rgba(255, 242, 0, 0.12)',
          border: '1px solid rgba(255, 242, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
        }}
      >
        {/* Background Image with smooth transition */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${currentBanner.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
            transform: 'scale(1.02)',
          }}
        />

        {/* Ambient Dark-to-Transparent Gradient Overlay for Readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.82) 50%, rgba(9, 9, 11, 0.35) 100%)',
          }}
        />

        {/* Canary Yellow Glow Accent */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 242, 0, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content Box (Informational brochure layout, not for selling) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '2.5rem 3rem',
            maxWidth: '650px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Badge & Slide counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 242, 0, 0.2)',
                color: '#fff200',
                border: '1px solid #fff200',
                padding: '0.4rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                boxShadow: '0 0 14px rgba(255, 242, 0, 0.3)',
              }}
            >
              <Tag size={13} />
              {currentBanner.badge || 'CAMPUS NOTICE'}
            </span>

            <span
              style={{
                fontSize: '0.78rem',
                color: '#d4d4d8',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              {currentIndex + 1} / {totalBanners}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)',
              lineHeight: 1.18,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
            }}
          >
            {currentBanner.title}
          </h2>

          {/* Tagline / Notice Description */}
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              color: '#e4e4e7',
              lineHeight: 1.55,
              maxWidth: '520px',
            }}
          >
            {currentBanner.tagline}
          </p>

          {/* Informational Event / Schedule Indicator (No selling button) */}
          <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 242, 0, 0.12)',
                border: '1px solid rgba(255, 242, 0, 0.35)',
                color: '#fff200',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <Calendar size={15} />
              <span>Official Monday Campus Exhibition</span>
            </div>
          </div>
        </div>

        {/* Left Arrow Button */}
        {totalBanners > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous Brochure"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(18, 18, 23, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 242, 0, 0.4)',
              color: '#fff200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff200';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(18, 18, 23, 0.75)';
              e.currentTarget.style.color = '#fff200';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right Arrow Button */}
        {totalBanners > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next Brochure"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(18, 18, 23, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 242, 0, 0.4)',
              color: '#fff200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff200';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(18, 18, 23, 0.75)';
              e.currentTarget.style.color = '#fff200';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Bottom Pagination Dots */}
        {totalBanners > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(9, 9, 11, 0.7)',
              padding: '6px 14px',
              borderRadius: '9999px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: idx === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: idx === currentIndex ? '#fff200' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: idx === currentIndex ? '0 0 10px rgba(255, 242, 0, 0.7)' : 'none',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Swipe Tip for Touch Devices */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.4rem',
          marginTop: '0.65rem',
          fontSize: '0.78rem',
          color: '#71717a',
        }}
      >
        <span>👈 Swipe or click arrows to browse campus brochures & notices 👉</span>
      </div>
    </div>
  );
};
