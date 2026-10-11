import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, ShieldCheck, Tag, Upload, Sparkles, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';

export const AdminPostersModal = ({ isOpen, onClose }) => {
  const { banners, addBanner, deleteBanner } = useMarket();
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    badge: '📢 CAMPUS ANNOUNCEMENT',
    imageUrl: '',
    fileName: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Guard: Admin only
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255, 51, 85, 0.15)', color: '#ff3355', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldCheck size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Admin Privilege Required</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.88rem', margin: '0.5rem 0 1.5rem' }}>
            Only administrators are authorized to publish or edit hero brochures and announcement posters.
          </p>
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </div>
    );
  }

  // Handle local file selection from gallery / device only
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Selected image exceeds 8MB. Please select a smaller image.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result,
        fileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateBanner = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Please enter a brochure title.');
      return;
    }

    if (!formData.imageUrl) {
      setErrorMsg('Please upload a brochure image from your gallery or device.');
      return;
    }

    addBanner({
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      badge: formData.badge.trim() || '📢 ANNOUNCEMENT',
      imageUrl: formData.imageUrl,
    });

    setSuccessMsg('Announcement brochure published successfully!');
    setIsAdding(false);
    setFormData({
      title: '',
      tagline: '',
      badge: '📢 CAMPUS ANNOUNCEMENT',
      imageUrl: '',
      fileName: '',
    });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(255, 242, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff200',
                border: '1px solid rgba(255, 242, 0, 0.3)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                Admin Brochure & Notice Manager
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                Upload event posters, campus notices & IEDC brochures from your device (informational only)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          {successMsg && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#34d399',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                background: 'rgba(255, 51, 85, 0.15)',
                border: '1px solid rgba(255, 51, 85, 0.4)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: '#ff3355',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Top action bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                Active Hero Brochures ({banners?.length || 0})
              </span>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                Swipe order corresponds to the sequence below
              </p>
            </div>

            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setErrorMsg('');
              }}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Plus size={16} />
              <span>{isAdding ? 'Cancel' : 'Upload New Brochure'}</span>
            </button>
          </div>

          {/* Add Poster Form (Toggled) */}
          {isAdding && (
            <form
              onSubmit={handleCreateBanner}
              style={{
                background: '#181822',
                border: '1px solid rgba(255, 242, 0, 0.35)',
                borderRadius: '18px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: '#fff200' }}>
                <Sparkles size={18} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Upload Campus Brochure / Poster</h4>
              </div>

              <div className="form-group">
                <label className="form-label">Brochure Title / Event Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IEDC Annual Campus Food Exhibition"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notice / Schedule Details *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Join us this Monday at the Quadrangle from 10:00 AM to 5:00 PM for student culinary showcases and exhibitions."
                  className="form-textarea"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notice Badge / Category Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 📢 CAMPUS ANNOUNCEMENT, 🎪 UPCOMING EVENT, ℹ️ NOTICE"
                  className="form-input"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>

              {/* Upload image strictly from device / gallery */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">
                  Brochure Image (Upload from Device / Gallery only) *
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }}
                />

                {!formData.imageUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(255, 242, 0, 0.45)',
                      borderRadius: '16px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#121218',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff200')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 242, 0, 0.45)')}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 242, 0, 0.12)',
                        color: '#fff200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Upload size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                        Click to select image from your Gallery or Device
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
                        Supports JPG, PNG, WEBP (Informational / Announcement brochure)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: '#121218',
                      borderRadius: '14px',
                      border: '1px solid rgba(255, 242, 0, 0.35)',
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img src={formData.imageUrl} alt="Uploaded preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fff200', fontSize: '0.8rem', fontWeight: 700 }}>
                        <CheckCircle2 size={14} />
                        <span>Ready to Publish</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formData.fileName || 'Selected from device'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <ImageIcon size={14} />
                      <span>Change</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Live Preview Box */}
              {formData.imageUrl && (
                <div style={{ marginTop: '1.2rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Brochure Live Carousel Preview
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      height: '160px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      backgroundImage: `url(${formData.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid rgba(255, 242, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(9, 9, 11, 0.92) 0%, rgba(9, 9, 11, 0.6) 60%, transparent 100%)' }} />
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(255, 242, 0, 0.2)', color: '#fff200', border: '1px solid #fff200', fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                        {formData.badge || 'ANNOUNCEMENT'}
                      </span>
                      <h5 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 800, marginTop: '0.35rem' }}>
                        {formData.title || 'Brochure Title'}
                      </h5>
                      <p style={{ fontSize: '0.78rem', color: '#d4d4d8', maxWidth: '400px' }}>
                        {formData.tagline || 'Details and notice description will display here.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.2rem' }}>
                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish Brochure to Hero Carousel
                </button>
              </div>
            </form>
          )}

          {/* Current Posters List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {banners.map((b, index) => (
              <div
                key={b.id}
                style={{
                  background: '#121217',
                  borderRadius: '16px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  transition: 'var(--transition)',
                }}
              >
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 242, 0, 0.15)',
                    color: '#fff200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>

                <div
                  style={{
                    width: '110px',
                    height: '70px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <img src={b.imageUrl} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(255, 242, 0, 0.15)', color: '#fff200', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                      {b.badge || 'NOTICE'}
                    </span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#a1a1aa', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.tagline}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (banners.length <= 1) {
                      alert('You must have at least one brochure in the hero carousel.');
                      return;
                    }
                    if (confirm(`Remove brochure "${b.title}"?`)) {
                      deleteBanner(b.id);
                    }
                  }}
                  className="btn btn-ghost"
                  style={{ color: '#ff3355', padding: '0.5rem', borderRadius: '8px' }}
                  title="Delete Brochure"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '110px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
