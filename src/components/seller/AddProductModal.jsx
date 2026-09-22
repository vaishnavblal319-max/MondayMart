import React, { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';

export const AddProductModal = ({ isOpen, onClose }) => {
  const { addProduct } = useMarket();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Fast Food',
    price: '',
    quantity: '10',
    description: '',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  });

  if (!isOpen) return null;

  const presetImages = [
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80' },
    { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Salad / Bowl', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Croissant / Bakery', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Coffee', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Dessert', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) return;

    addProduct({
      ...formData,
      sellerStore: currentUser?.storeName || 'The Burger Guild & Bistro',
      sellerEmail: currentUser?.email || 'freshbakes@mondaymart.in',
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(204, 255, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccff00', border: '1px solid rgba(204, 255, 0, 0.3)' }}>
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>Add New Stall Item</h3>
              <p style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Configure rate, category, and available campus stock</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem', color: '#a1a1aa' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Peri Peri Crispy Paneer Wrap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Fast Food">Fast Food</option>
                <option value="Pizzas">Pizzas</option>
                <option value="Meals">Meals & Biryani</option>
                <option value="Bakery">Bakery</option>
                <option value="Beverages">Beverages</option>
                <option value="Healthy Bowls">Healthy Bowls</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Preference</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    border: formData.isVeg ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: formData.isVeg ? 'rgba(16, 185, 129, 0.15)' : '#181824',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: formData.isVeg ? '#34d399' : '#a1a1aa',
                  }}
                >
                  <input
                    type="radio"
                    name="diet"
                    checked={formData.isVeg}
                    onChange={() => setFormData({ ...formData, isVeg: true })}
                    style={{ display: 'none' }}
                  />
                  <span>● Pure Veg</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    border: !formData.isVeg ? '2px solid #ff3355' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: !formData.isVeg ? 'rgba(255, 51, 85, 0.15)' : '#181824',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: !formData.isVeg ? '#ff3355' : '#a1a1aa',
                  }}
                >
                  <input
                    type="radio"
                    name="diet"
                    checked={!formData.isVeg}
                    onChange={() => setFormData({ ...formData, isVeg: false })}
                    style={{ display: 'none' }}
                  />
                  <span>▲ Non-Veg</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rate / Price (₹ INR)</label>
              <input
                type="number"
                min="10"
                step="1"
                className="form-input"
                placeholder="249"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Quantity (Stock)</label>
              <input
                type="number"
                min="0"
                step="1"
                className="form-input"
                placeholder="15"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="Freshly prepared by student kitchen..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Selection Presets */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label">Product Image Preset</label>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {presetImages.map((img) => (
                <div
                  key={img.label}
                  onClick={() => setFormData({ ...formData, image: img.url })}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: formData.image === img.url ? '3px solid #ccff00' : '2px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: formData.image === img.url ? '0 0 12px rgba(204, 255, 0, 0.5)' : 'none',
                    cursor: 'pointer',
                    width: '64px',
                    height: '64px',
                    flexShrink: 0,
                    position: 'relative',
                    transition: 'var(--transition)',
                  }}
                >
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <input
              type="url"
              className="form-input"
              style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}
              placeholder="Or paste custom image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '1rem' }}>
            <Plus size={18} />
            <span>Publish Item to Campus Menu</span>
          </button>
        </form>
      </div>
    </div>
  );
};
