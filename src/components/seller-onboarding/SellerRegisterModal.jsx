import React, { useState } from 'react';
import { X, Store, User, Mail, Phone, MapPin, Upload, Image as ImageIcon, ArrowRight, ShieldCheck } from 'lucide-react';

export const SellerRegisterModal = ({
  isOpen,
  onClose,
  onProceedToOtp,
}) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    storeName: '',
    personalEmail: '',
    phone: '',
    category: 'Fast Food',
    address: '',
    idPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  });

  const [previewId, setPreviewId] = useState(formData.idPhotoUrl);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewId(reader.result);
        setFormData((prev) => ({ ...prev, idPhotoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.storeName || !formData.phone) return;

    onProceedToOtp(formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Store size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>IEDC Student Venture Application</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Step 1 of 2: Venture information & Student ID verification</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Info Banner */}
          <div
            style={{
              backgroundColor: 'rgba(204, 255, 0, 0.08)',
              border: '1px solid rgba(204, 255, 0, 0.35)',
              borderRadius: '12px',
              padding: '0.95rem 1.1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            <ShieldCheck size={24} color="#ccff00" flexShrink={0} />
            <div>
              <strong>IEDC Incubation Protocol:</strong> Once you verify your mobile phone via OTP, your application is queued for IEDC admin review. Upon approval, an official <code>yourstall@mondaymart.in</code> merchant account is issued.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Stall / Venture Name</label>
              <div style={{ position: 'relative' }}>
                <Store size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Royal Chai & Bakes"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Student Founder Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Vikram Sharma"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Personal / College Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="student@college.edu"
                  value={formData.personalEmail}
                  onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="+91 98123 45678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Venture Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Fast Food">Fast Food & Burgers</option>
                <option value="Meals">Campus Meals & Biryani</option>
                <option value="Pizzas">Artisanal Pizzas</option>
                <option value="Bakery">Bakery & Pastries</option>
                <option value="Beverages">Specialty Coffee & Drinks</option>
                <option value="Healthy Bowls">Healthy Bowls & Salads</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Stall Location / Quad</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#ccff00" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Stall #04, Campus Quadrangle"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* KYC ID Photo Upload Section */}
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              College ID Card / Student Founder Proof
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                alignItems: 'center',
              }}
            >
              <label
                style={{
                  border: '2px dashed rgba(204, 255, 0, 0.45)',
                  borderRadius: '16px',
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#181824',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'var(--transition)',
                }}
              >
                <Upload size={24} color="#ccff00" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                  Click to upload College ID / Proof
                </span>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                  Supports JPG, PNG or PDF (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {/* Live Preview */}
              <div
                style={{
                  background: '#14141b',
                  borderRadius: '16px',
                  padding: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', marginBottom: '0.4rem' }}>
                  Document Preview
                </div>
                <div style={{ width: '100%', height: '110px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#09090b' }}>
                  {previewId ? (
                    <img
                      src={previewId}
                      alt="ID Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                      <ImageIcon size={28} />
                    </div>
                  )}
                </div>
                <span className="badge badge-success" style={{ marginTop: '0.4rem', fontSize: '0.7rem' }}>
                  ✓ ID Document Attached
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.95rem' }}>
              <span>Proceed to Mobile Phone OTP Verification</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
