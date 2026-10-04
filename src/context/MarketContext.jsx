import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderId, generateRandomPin } from '../utils/helpers';
import {
  db,
  productsCol,
  ordersCol,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from '../firebase';

const MarketContext = createContext();

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

    const unsubOrders = onSnapshot(
      query(ordersCol(), orderBy('createdAt', 'desc')),
      (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('Orders listener:', err)
    );

    return () => { unsubProducts(); unsubOrders(); };
  }, []);

  // ─── Cart stays client-side only ─────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('mm_cart', JSON.stringify(cart));
  }, [cart]);

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
