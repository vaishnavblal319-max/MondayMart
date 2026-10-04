import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSellerEmail } from '../utils/helpers';
import {
  db,
  usersCol,
  sellersCol,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers]                  = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [currentUser, setCurrentUser]      = useState(() => {
    try {
      const raw = localStorage.getItem('mm_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  // ─── Real-time Firestore listeners ───────────────────────────────────────────
  useEffect(() => {
    const unsubUsers = onSnapshot(
      usersCol(),
      (snap) => setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('Users listener:', err)
    );

    const unsubSellers = onSnapshot(
      query(sellersCol(), orderBy('submittedAt', 'desc')),
      (snap) => setPendingSellers(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('PendingSellers listener:', err)
    );

    return () => { unsubUsers(); unsubSellers(); };
  }, []);

  // ─── Persist session to localStorage ─────────────────────────────────────────
  useEffect(() => {
    if (currentUser) localStorage.setItem('mm_current_user', JSON.stringify(currentUser));
    else             localStorage.removeItem('mm_current_user');
  }, [currentUser]);

  // ─── Write helpers ────────────────────────────────────────────────────────────
  const saveUser = async (user) => {
    try { await setDoc(doc(db, 'users', user.id), user, { merge: true }); }
    catch (err) { console.warn('saveUser:', err); }
  };

  const saveSeller = async (seller) => {
    try { await setDoc(doc(db, 'pendingSellers', seller.id), seller, { merge: true }); }
    catch (err) { console.warn('saveSeller:', err); }
  };

  // ─── Login ────────────────────────────────────────────────────────────────────
  const login = (email, password = '') => {
    const cleanEmail = email.trim().toLowerCase();

    // Admin — special role, auto-created in Firestore on first login
    if (cleanEmail === 'admin@mondaymart.in') {
      const existing = users.find((u) => u.email === cleanEmail);
      const adminUser = existing || {
        id:     'user-admin',
        name:   'Admin',
        email:  cleanEmail,
        role:   'admin',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=admin`,
        createdAt: new Date().toISOString(),
      };
      if (!existing) saveUser(adminUser);
      setCurrentUser(adminUser);
      return { success: true, user: adminUser, role: 'admin' };
    }

    // Seller — must have approved @mondaymart.in account in Firestore
    if (cleanEmail.endsWith('@mondaymart.in')) {
      const seller = users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.role === 'seller'
      );
      if (seller) {
        setCurrentUser(seller);
        return { success: true, user: seller, role: 'seller' };
      }
      return {
        success: false,
        error: 'No approved seller account found for this email. Contact the admin.',
      };
    }

    // Customer — find existing
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      return { success: true, user: existing, role: existing.role };
    }

    // Customer — first login auto-creates account
    const namePart      = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newCustomer   = {
      id:        `user-c-${Date.now()}`,
      name:      formattedName,
      email:     cleanEmail,
      phone:     '',
      role:      'customer',
      avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
      createdAt: new Date().toISOString(),
    };
    saveUser(newCustomer);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer, role: 'customer' };
  };

  // ─── Register Customer ────────────────────────────────────────────────────────
  const registerCustomer = ({ name, email, phone, password = '' }) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing   = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      return { success: true, user: existing };
    }
    const newCustomer = {
      id:        `user-c-${Date.now()}`,
      name:      name.trim(),
      email:     cleanEmail,
      phone:     phone || '',
      role:      'customer',
      avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
    };
    saveUser(newCustomer);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer };
  };

  // ─── Seller Onboarding ────────────────────────────────────────────────────────
  const submitSellerApplication = (appData) => {
    const id = `req-${Date.now()}`;
    const newApp = {
      id,
      ownerName:       appData.ownerName,
      storeName:       appData.storeName,
      personalEmail:   appData.personalEmail.trim().toLowerCase(),
      phone:           appData.phone,
      category:        appData.category || 'General',
      address:         appData.address  || 'Campus',
      idPhotoUrl:      appData.idPhotoUrl || '',
      submittedAt:     new Date().toISOString(),
      isPhoneVerified: true,
      status:          'pending',
    };
    saveSeller(newApp);
    return { success: true, application: newApp };
  };

  const approveSeller = (requestId) => {
    const target = pendingSellers.find((r) => r.id === requestId);
    if (!target) return { success: false, error: 'Request not found' };

    const sellerEmail  = generateSellerEmail(target.storeName);
    const tempPassword = `seller${Math.floor(1000 + Math.random() * 9000)}`;

    const newSellerUser = {
      id:            `user-s-${Date.now()}`,
      name:          target.ownerName,
      email:         sellerEmail,
      personalEmail: target.personalEmail,
      phone:         target.phone,
      role:          'seller',
      storeName:     target.storeName,
      category:      target.category,
      address:       target.address,
      avatar:        `https://api.dicebear.com/7.x/identicon/svg?seed=${sellerEmail}`,
      tempPassword,
      approvedAt:    new Date().toISOString(),
    };

    saveUser(newSellerUser);
    saveSeller({ ...target, status: 'approved', assignedEmail: sellerEmail, tempPassword });

    return { success: true, sellerEmail, tempPassword, sellerUser: newSellerUser };
  };

  const rejectSeller = (requestId, reason = 'Documentation incomplete') => {
    const target = pendingSellers.find((r) => r.id === requestId);
    if (!target) return { success: false };
    saveSeller({ ...target, status: 'rejected', rejectReason: reason });
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mm_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        pendingSellers,
        login,
        registerCustomer,
        submitSellerApplication,
        approveSeller,
        rejectSeller,
        logout,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
