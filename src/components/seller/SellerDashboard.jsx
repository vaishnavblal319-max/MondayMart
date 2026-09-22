import React, { useState } from 'react';
import {
  Package,
  Plus,
  TrendingUp,
  AlertTriangle,
  Clock,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { OrderTicket } from './OrderTicket';
import { AddProductModal } from './AddProductModal';

export const SellerDashboard = () => {
  const { products, orders, updateProduct, deleteProduct } = useMarket();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [orderFilter, setOrderFilter] = useState('active'); // 'all' | 'active' | 'completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const sellerEmail = currentUser?.email;
  const sellerProducts = products.filter(
    (p) => !sellerEmail || p.sellerEmail === sellerEmail
  );
  const sellerOrders = orders.filter((o) =>
    o.items.some((it) => !sellerEmail || it.product.sellerEmail === sellerEmail)
  );

  const totalRevenue = sellerOrders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => {
      const sellerTotal = o.items
        .filter((it) => !sellerEmail || it.product.sellerEmail === sellerEmail)
        .reduce((itemSum, it) => itemSum + it.unitPrice * it.quantity, 0);
      return sum + sellerTotal;
    }, 0);

  const activeOrders = sellerOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  const lowStockItems = sellerProducts.filter((p) => p.quantity <= 5);

  const displayedOrders = sellerOrders.filter((o) => {
    if (orderFilter === 'active') return o.status !== 'completed' && o.status !== 'cancelled';
    if (orderFilter === 'completed') return o.status === 'completed';
    return true;
  });

  const handleStartEdit = (prod) => {
    setEditingId(prod.id);
    setEditPrice(prod.price);
    setEditQuantity(prod.quantity);
  };

  const handleSaveEdit = (id) => {
    updateProduct(id, {
      price: Number(editPrice) || 0,
      quantity: Number(editQuantity) || 0,
    });
    setEditingId(null);
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Dashboard Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #121218 0%, #09090b 100%)',
            borderRadius: '24px',
            padding: '1.75rem 2rem',
            border: '1px solid rgba(204, 255, 0, 0.35)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(204, 255, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                {currentUser?.storeName || 'Campus Merchant Operations'}
              </h1>
              <span className="badge badge-iedc">✓ IEDC Incubated Stall</span>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
              Official Account: <strong style={{ color: '#ccff00' }}>{currentUser?.email}</strong> • Student Lead: {currentUser?.name}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
              style={{ gap: '0.45rem' }}
            >
              <Plus size={18} />
              <span>Add Stall Item</span>
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.25rem',
          }}
        >
          <div style={{ background: '#14141b', padding: '1.3rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Total Stall Revenue</span>
              <TrendingUp size={18} color="#ccff00" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ccff00', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              {formatCurrency(totalRevenue)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>
              From verified PIN pickups
            </div>
          </div>

          <div style={{ background: '#14141b', padding: '1.3rem', borderRadius: '18px', border: '1.5px solid rgba(204, 255, 0, 0.4)', boxShadow: '0 0 15px rgba(204, 255, 0, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccff00', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Active Orders</span>
              <Clock size={18} color="#ccff00" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ccff00', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              {activeOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
              Awaiting PIN fulfillment
            </div>
          </div>

          <div style={{ background: '#14141b', padding: '1.3rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Live Menu Items</span>
              <Package size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              {sellerProducts.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
              In active catalog
            </div>
          </div>

          <div style={{ background: '#14141b', padding: '1.3rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Low Stock Alerts</span>
              <AlertTriangle size={18} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: lowStockItems.length > 0 ? '#fbbf24' : '#ffffff', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
              {lowStockItems.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>
              Items with &le; 5 units left
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.85rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'orders' ? '3px solid #ccff00' : 'none',
                color: activeTab === 'orders' ? '#ccff00' : '#a1a1aa',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <Clock size={18} color={activeTab === 'orders' ? '#ccff00' : '#71717a'} />
              <span>Live Orders & Pickup PINs</span>
              {activeOrders.length > 0 && (
                <span style={{ backgroundColor: '#ccff00', color: '#000000', padding: '1px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {activeOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                padding: '0.85rem 1.25rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'inventory' ? '3px solid #ccff00' : 'none',
                color: activeTab === 'inventory' ? '#ccff00' : '#a1a1aa',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              <Package size={18} color={activeTab === 'inventory' ? '#ccff00' : '#71717a'} />
              <span>Menu & Stock Inventory</span>
            </button>
          </div>

          {/* Sub-filter if orders tab active */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              {['active', 'all', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  style={{
                    padding: '0.4rem 0.95rem',
                    borderRadius: '9999px',
                    border: '1px solid',
                    borderColor: orderFilter === f ? '#ccff00' : 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: orderFilter === f ? '#ccff00' : '#14141b',
                    color: orderFilter === f ? '#000000' : '#a1a1aa',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'var(--transition)',
                  }}
                >
                  {f} Orders
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? (
          displayedOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#121217', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {sellerProducts.length === 0 ? (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Add items to start receiving orders</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                    Your stall has no menu items yet. Add products first — customers can then browse and place orders.
                  </p>
                  <button onClick={() => { setActiveTab('inventory'); setIsAddModalOpen(true); }} className="btn btn-primary">
                    <Plus size={18} />
                    <span>Add Your First Stall Item</span>
                  </button>
                </>
              ) : (
                <>
                  <Clock size={48} color="#3f3f46" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>No orders in this queue</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    New customer orders appear here automatically with their QR pass and pickup PIN.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {displayedOrders.map((order) => (
                <OrderTicket key={order.id} order={order} />
              ))}
            </div>
          )
        ) : (
          /* Inventory Management Tab */
          <div style={{ background: '#121217', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d0d12' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Catalog & Stock Levels</h3>
                <p style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Edit rates and available units in real-time</p>
              </div>
              <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={16} />
                <span>New Stall Item</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#181822', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#a1a1aa' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Item</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Rate (₹)</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Stock Qty</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📦</div>
                        <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                          No menu items yet
                        </div>
                        <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1rem' }}>
                          Click "Add Stall Item" to list your first product on the campus marketplace.
                        </p>
                        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
                          <Plus size={15} />
                          <span>Add Your First Item</span>
                        </button>
                      </td>
                    </tr>
                  )}
                  {sellerProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    const isLow = p.quantity <= 5 && p.quantity > 0;
                    const isOut = p.quantity === 0;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                              <span className={p.isVeg ? 'badge badge-veg' : 'badge badge-non-veg'} style={{ fontSize: '0.65rem' }}>
                                {p.isVeg ? 'VEG' : 'NON-VEG'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', color: '#a1a1aa' }}>
                          {p.category}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #ccff00', background: '#09090b', color: '#fff' }}
                            />
                          ) : (
                            <span style={{ fontWeight: 800, color: '#ccff00', fontFamily: 'var(--font-heading)' }}>{formatCurrency(p.price)}</span>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              style={{ width: '70px', padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #ccff00', background: '#09090b', color: '#fff' }}
                            />
                          ) : (
                            <span style={{ fontWeight: 700, color: '#ffffff' }}>{p.quantity} units</span>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          {isOut ? (
                            <span className="badge" style={{ backgroundColor: 'rgba(255, 51, 85, 0.15)', color: '#ff3355', border: '1px solid rgba(255, 51, 85, 0.4)' }}>Out of Stock</span>
                          ) : isLow ? (
                            <span className="badge badge-warning">Only {p.quantity} left</span>
                          ) : (
                            <span className="badge badge-success">In Stock</span>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveEdit(p.id)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.35rem 0.6rem' }}
                                title="Save changes"
                              >
                                <Check size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(p)}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.35rem 0.6rem' }}
                                title="Edit rate and stock"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#ff3355', padding: '0.35rem 0.6rem' }}
                              title="Delete item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </div>
    </div>
  );
};
