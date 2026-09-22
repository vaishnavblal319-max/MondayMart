import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers, initialPendingSellers } from '../data/demoUsers';
import { generateSellerEmail } from '../utils/helpers';

const AuthContext = createContext();

// Bump this whenever seed users change so old localStorage is wiped.
const AUTH_VERSION = 'v4-clean';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function initAuthStorage() {
  const stored = localStorage.getItem('mm_auth_version');
  if (stored !== AUTH_VERSION) {
    ['mm_users', 'mm_pending_sellers', 'mm_current_user'].forEach((k) =>
      localStorage.removeItem(k)
    );
    localStorage.setItem('mm_auth_version', AUTH_VERSION);
  }
}

export const AuthProvider = ({ children }) => {
  React.useMemo(() => initAuthStorage(), []);

  const [users, setUsers]               = useState(() => loadFromStorage('mm_users', initialUsers));
  const [pendingSellers, setPendingSellers] = useState(() => loadFromStorage('mm_pending_sellers', initialPendingSellers));
  const [currentUser, setCurrentUser]   = useState(() => loadFromStorage('mm_current_user', null));

  // Persist
  useEffect(() => { localStorage.setItem('mm_users',           JSON.stringify(users));          }, [users]);
  useEffect(() => { localStorage.setItem('mm_pending_sellers', JSON.stringify(pendingSellers)); }, [pendingSellers]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('mm_current_user', JSON.stringify(currentUser));
    else             localStorage.removeItem('mm_current_user');
  }, [currentUser]);

  // ─── Login ────────────────────────────────────────────────────────────────

  const login = (email, password = '') => {
    const cleanEmail = email.trim().toLowerCase();

    // Admin shortcut
    if (cleanEmail === 'admin@mondaymart.in') {
      const adminUser = users.find((u) => u.role === 'admin') || {
        id: 'user-admin', name: 'Marketplace Operations Admin',
        email: 'admin@mondaymart.in', role: 'admin',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=admin`,
      };
      setCurrentUser(adminUser);
      return { success: true, user: adminUser, role: 'admin' };
    }

    // Seller login — must have an approved @mondaymart.in account
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
        error: 'Seller account not found. Make sure you have been approved by the IEDC admin.',
      };
    }

    // Customer — existing account
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      return { success: true, user: existing, role: existing.role };
    }

    // Customer — auto-register on first login (email-only, no password required for demo)
    const namePart     = cleanEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newCustomer  = {
      id:        `user-c-${Date.now()}`,
      name:      formattedName,
      email:     cleanEmail,
      phone:     '',
      role:      'customer',
      avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newCustomer]);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer, role: 'customer' };
  };

  // ─── Register Customer ────────────────────────────────────────────────────

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
      password:  password || '',
      role:      'customer',
      avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newCustomer]);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer };
  };

  // ─── Seller Onboarding ────────────────────────────────────────────────────

  const submitSellerApplication = (appData) => {
    const id = `req-${Date.now()}`;
    const newApp = {
      id,
      ownerName:     appData.ownerName,
      storeName:     appData.storeName,
      personalEmail: appData.personalEmail.trim().toLowerCase(),
      phone:         appData.phone,
      category:      appData.category || 'General Food & Bakes',
      address:       appData.address  || 'Campus Stall',
      idPhotoUrl:    appData.idPhotoUrl ||
                     'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      submittedAt:   new Date().toISOString(),
      isPhoneVerified: true,
      status:        'pending',
    };
    setPendingSellers((prev) => [newApp, ...prev]);
    return { success: true, application: newApp };
  };

  // Admin approves — generates official @mondaymart.in seller account
  const approveSeller = (requestId) => {
    const target = pendingSellers.find((r) => r.id === requestId);
    if (!target) return { success: false, error: 'Request not found' };

    const sellerEmail  = generateSellerEmail(target.storeName);
    const tempPassword = `seller${Math.floor(1000 + Math.random() * 9000)}`;

    const newSellerUser = {
      id:           `user-s-${Date.now()}`,
      name:         target.ownerName,
      email:        sellerEmail,
      personalEmail: target.personalEmail,
      phone:        target.phone,
      role:         'seller',
      storeName:    target.storeName,
      category:     target.category,
      address:      target.address,
      avatar:       `https://api.dicebear.com/7.x/identicon/svg?seed=${sellerEmail}`,
      tempPassword,
      approvedAt:   new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newSellerUser]);
    setPendingSellers((prev) =>
      prev.map((s) =>
        s.id === requestId
          ? { ...s, status: 'approved', assignedEmail: sellerEmail, tempPassword }
          : s
      )
    );

    return { success: true, sellerEmail, tempPassword, sellerUser: newSellerUser };
  };

  const rejectSeller = (requestId, reason = 'Documentation incomplete') => {
    setPendingSellers((prev) =>
      prev.map((s) =>
        s.id === requestId ? { ...s, status: 'rejected', rejectReason: reason } : s
      )
    );
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
