import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderId, generateRandomPin } from '../utils/helpers';

const MarketContext = createContext();

// Data version — bump this whenever the seed data changes so old
// localStorage is automatically wiped and reseeded.
const DATA_VERSION = 'v4-clean';

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
    ['mm_products', 'mm_orders', 'mm_cart'].forEach((k) =>
      localStorage.removeItem(k)
    );
    localStorage.setItem('mm_data_version', DATA_VERSION);
  }
}

export const MarketProvider = ({ children }) => {
  // Wipe stale data on first mount
  React.useMemo(() => initStorage(), []);

  const [products, setProducts] = useState(() => loadFromStorage('mm_products', []));
  const [orders, setOrders]     = useState(() => loadFromStorage('mm_orders', []));
  const [cart, setCart]         = useState(() => loadFromStorage('mm_cart', {}));

  // Persist to localStorage whenever state changes
  useEffect(() => { localStorage.setItem('mm_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('mm_orders',   JSON.stringify(orders));   }, [orders]);
  useEffect(() => { localStorage.setItem('mm_cart',     JSON.stringify(cart));     }, [cart]);

  // ─── Cart ─────────────────────────────────────────────────────────────────

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

  // ─── Products (Seller) ────────────────────────────────────────────────────

  const addProduct = (productData) => {
    const id = `prod-${Date.now()}`;
    const newProduct = {
      id,
      name:        productData.name.trim(),
      category:    productData.category || 'Meals',
      price:       Number(productData.price) || 99,
      quantity:    Number(productData.quantity) || 10,
      description: productData.description?.trim() || 'Freshly prepared.',
      isVeg:       Boolean(productData.isVeg),
      rating:      4.8,
      image:       productData.image ||
                   'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      sellerStore: productData.sellerStore || 'Campus Stall',
      sellerEmail: productData.sellerEmail || '',
      createdAt:   new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ─── Orders ───────────────────────────────────────────────────────────────

  const placeOrder = ({ customer, deliveryAddress, notes = '' }) => {
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

    const orderId = generateOrderId();
    const pin     = generateRandomPin();

    const newOrder = {
      id: orderId,
      customer: {
        id:    customer?.id    || 'guest',
        name:  customer?.name  || 'Customer',
        email: customer?.email || 'guest@mondaymart.in',
        phone: customer?.phone || '+91 98765 43210',
      },
      items: orderItems,
      subtotal,
      taxes,
      deliveryFee,
      packagingFee,
      totalAmount,
      pin,
      status: 'pending',
      deliveryAddress: deliveryAddress || 'Counter Pickup (Order Pass)',
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

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = cart[p.id];
        return ordered ? { ...p, quantity: Math.max(0, p.quantity - ordered) } : p;
      })
    );
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  const verifyOrderPin = (orderId, enteredPin) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found' };
    if (String(order.pin).trim() !== String(enteredPin).trim())
      return { success: false, error: 'Incorrect PIN! Ask the customer to recheck.' };

    const completedTime = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'completed', verifiedAt: completedTime } : o
      )
    );
    return { success: true };
  };

  return (
    <MarketContext.Provider
      value={{
        products,
        orders,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
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
