import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderId, generateRandomPin } from '../utils/helpers';
import { initialProducts } from '../data/initialProducts';
import { initialBanners } from '../data/initialBanners';

const MarketContext = createContext();

// Data version — bump this whenever the seed data changes so old
// localStorage is automatically wiped and reseeded.
const DATA_VERSION = 'v6-fff200-announcement-posters';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function initStorage() {
  const storedVersion = localStorage.getItem('mm_data_version');
  if (storedVersion !== DATA_VERSION) {
    // Wipe every key so stale dummy data is removed
    ['mm_products', 'mm_orders', 'mm_cart', 'mm_banners'].forEach((k) =>
      localStorage.removeItem(k)
    );
    localStorage.setItem('mm_data_version', DATA_VERSION);
  }
}

export const MarketProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [cart, setCart]         = useState(() => {
    try {
      const raw = localStorage.getItem('mm_cart');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  // ─── Real-time Firestore listeners ───────────────────────────────────────────
  useEffect(() => {
    const unsubProducts = onSnapshot(
      query(productsCol(), orderBy('createdAt', 'desc')),
      (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('Products listener:', err)
    );

  const [products, setProducts] = useState(() => loadFromStorage('mm_products', initialProducts));
  const [banners, setBanners]   = useState(() => loadFromStorage('mm_banners', initialBanners));
  const [orders, setOrders]     = useState(() => loadFromStorage('mm_orders', []));
  const [cart, setCart]         = useState(() => loadFromStorage('mm_cart', {}));

  // Persist to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('mm_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mm_banners',  JSON.stringify(banners));  }, [banners]);
  useEffect(() => { localStorage.setItem('mm_orders',   JSON.stringify(orders));   }, [orders]);
  useEffect(() => { localStorage.setItem('mm_cart',     JSON.stringify(cart));     }, [cart]);

  // ─── Banners (Admin Managed) ─────────────────────────────────────────────

  const addBanner = (bannerData) => {
    const id = `banner-${Date.now()}`;
    const newBanner = {
      id,
      title: bannerData.title?.trim() || 'Campus Notice',
      tagline: bannerData.tagline?.trim() || '',
      badge: bannerData.badge?.trim() || '📢 ANNOUNCEMENT',
      imageUrl: bannerData.imageUrl?.trim() || '',
      accentColor: '#fff200',
      createdAt: new Date().toISOString(),
    };
    setBanners((prev) => [newBanner, ...prev]);
    return newBanner;
  };

  const deleteBanner = (bannerId) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

  const updateBanner = (bannerId, updates) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, ...updates } : b))
    );
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────

  // ─── Cart ─────────────────────────────────────────────────────────────────────
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const qty = prev[productId] || 0;
      if (qty >= product.quantity) return prev;
      return { ...prev, [productId]: qty + 1 };
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const qty = prev[productId] || 0;
      if (qty <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: qty - 1 };
    });
  };

  const clearCart = () => setCart({});

  // ─── Products ─────────────────────────────────────────────────────────────────
  const addProduct = async (productData) => {
    const id = `prod-${Date.now()}`;
    const newProduct = {
      id,
      name:        productData.name.trim(),
      category:    productData.category || 'Meals',
      price:       Number(productData.price) || 0,
      quantity:    Number(productData.quantity) || 0,
      description: productData.description?.trim() || '',
      isVeg:       Boolean(productData.isVeg),
      rating:      0,
      image:       productData.image || '',
      sellerStore: productData.sellerStore || '',
      sellerEmail: productData.sellerEmail || '',
      createdAt:   new Date().toISOString(),
    };
    try { await setDoc(doc(db, 'products', id), newProduct); }
    catch (err) { console.warn('addProduct:', err); }
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    try { await updateDoc(doc(db, 'products', id), updates); }
    catch (err) { console.warn('updateProduct:', err); }
  };

  const deleteProduct = async (id) => {
    setCart((prev) => { const n = { ...prev }; delete n[id]; return n; });
    try { await deleteDoc(doc(db, 'products', id)); }
    catch (err) { console.warn('deleteProduct:', err); }
  };

  // ─── Orders ───────────────────────────────────────────────────────────────────
  const placeOrder = async ({ customer, deliveryAddress, notes = '' }) => {
    const orderItems = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return product ? { product, quantity, unitPrice: product.price } : null;
      })
      .filter(Boolean);

    if (orderItems.length === 0) return null;

    const subtotal     = orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const taxes        = Math.round(subtotal * 0.05);
    const deliveryFee  = subtotal > 499 ? 0 : 35;
    const packagingFee = 15;
    const totalAmount  = subtotal + taxes + deliveryFee + packagingFee;
    const orderId      = generateOrderId();
    const pin          = generateRandomPin();

    const newOrder = {
      id: orderId,
      customer: {
        id:    customer?.id    || 'guest',
        name:  customer?.name  || 'Customer',
        email: customer?.email || '',
        phone: customer?.phone || '',
      },
      items: orderItems,
      subtotal,
      taxes,
      deliveryFee,
      packagingFee,
      totalAmount,
      pin,
      status: 'pending',
      deliveryAddress: deliveryAddress || 'Counter Pickup',
      notes,
      createdAt: new Date().toISOString(),
      qrPayload: JSON.stringify({
        orderId,
        pin,
        total:        totalAmount,
        customerName: customer?.name || 'Customer',
        timestamp:    Date.now(),
      }),
    };

    clearCart();

    // Write order to Firestore
    try { await setDoc(doc(db, 'orders', orderId), newOrder); }
    catch (err) { console.warn('placeOrder:', err); }

    // Deduct stock in Firestore
    for (const item of orderItems) {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod) {
        try {
          await updateDoc(doc(db, 'products', item.product.id), {
            quantity: Math.max(0, prod.quantity - item.quantity),
          });
        } catch (err) { console.warn('stockDeduct:', err); }
      }
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedAt = new Date().toISOString();
    try { await updateDoc(doc(db, 'orders', orderId), { status: newStatus, updatedAt }); }
    catch (err) { console.warn('updateOrderStatus:', err); }
  };

  const verifyOrderPin = async (orderId, enteredPin) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };
    if (String(order.pin).trim() !== String(enteredPin).trim())
      return { success: false, error: 'Incorrect PIN! Ask the customer to recheck.' };

    const verifiedAt = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'completed', verifiedAt });
    } catch (err) { console.warn('verifyOrderPin:', err); }

    return { success: true };
  };

  return (
    <MarketContext.Provider
      value={{
        products,
        banners,
        orders,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        deleteBanner,
        updateBanner,
        placeOrder,
        updateOrderStatus,
        verifyOrderPin,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);
