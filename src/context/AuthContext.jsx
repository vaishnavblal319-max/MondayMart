import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateSellerEmail } from '../utils/helpers';
import {
  db,
  usersCol,
  sellersCol,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
} from '../firebase';

const AuthContext = createContext();

// Recognized Admin / IEDC accounts and their bootstrap initial passwords
const ADMIN_ACCOUNTS = {
  'admin@mondaymart.in': {
    id: 'user-admin',
    name: 'IEDC Admin',
    defaultPass: 'Admin123',
  },
  'iedc@mondaymart.in': {
    id: 'user-iedc',
    name: 'IEDC Executive',
    defaultPass: 'iedc123',
  },
  'iedc@mondymart.in': {
    id: 'user-iedc-alt',
    name: 'IEDC Executive',
    defaultPass: 'iedc123',
  },
};

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
      (snap) => {
        const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(loaded);
      },
      (err) => console.warn('Users listener:', err)
    );

    const unsubSellers = onSnapshot(
      query(sellersCol(), orderBy('submittedAt', 'desc')),
      (snap) => {
        const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPendingSellers(loaded);
      },
      (err) => console.warn('PendingSellers listener:', err)
    );

    return () => {
      unsubUsers();
      unsubSellers();
    };
  }, []);

  // ─── Persist session to localStorage ─────────────────────────────────────────
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mm_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mm_current_user');
    }
  }, [currentUser]);

  // Keep currentUser synced if user record in Firestore updates (e.g. name or role edit)
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const matched = users.find((u) => u.id === currentUser.id || u.email?.toLowerCase() === currentUser.email?.toLowerCase());
      if (matched && JSON.stringify(matched) !== JSON.stringify(currentUser)) {
        setCurrentUser(matched);
      }
    }
  }, [users]);

  // ─── Write helpers ────────────────────────────────────────────────────────────
  const saveUser = async (user) => {
    try {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    } catch (err) {
      console.warn('saveUser error:', err);
    }
  };

  const saveSeller = async (seller) => {
    try {
      await setDoc(doc(db, 'pendingSellers', seller.id), seller, { merge: true });
    } catch (err) {
      console.warn('saveSeller error:', err);
    }
  };

  // ─── Helper: Find user in Firestore directly (for freshest console updates) ───
  const findUserByEmail = async (cleanEmail) => {
    try {
      const q = query(usersCol(), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (err) {
      console.warn('findUserByEmail Firestore query error:', err);
    }

    // Fall back to in-memory state
    const fromMemory = users.find((u) => u.email?.toLowerCase() === cleanEmail);
    if (fromMemory) return fromMemory;

    return null;
  };

  // ─── Login ────────────────────────────────────────────────────────────────────
  const login = async (email, password = '') => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // ── 1. Admin / IEDC Accounts ──
    const adminConfig = ADMIN_ACCOUNTS[cleanEmail];
    if (adminConfig) {
      let adminRecord = await findUserByEmail(cleanEmail);

      if (!adminRecord) {
        // Database was cleared and no admin record exists in Firestore yet
        // Check initial bootstrap password
        if (cleanPassword !== adminConfig.defaultPass) {
          return {
            success: false,
            error: `Incorrect password for ${cleanEmail}. (Initial password is "${adminConfig.defaultPass}")`,
          };
        }

        adminRecord = {
          id:        adminConfig.id,
          name:      adminConfig.name,
          email:     cleanEmail,
          role:      'admin',
          password:  adminConfig.defaultPass,
          avatar:    `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
          createdAt: new Date().toISOString(),
        };
        await saveUser(adminRecord);
      } else {
        // Document exists in Firestore!
        // Respect the password stored in Firestore (or fallback if empty)
        const expectedPass = adminRecord.password || adminConfig.defaultPass;
        if (cleanPassword !== expectedPass) {
          return { success: false, error: 'Incorrect password for this admin account.' };
        }
      }

      setCurrentUser(adminRecord);
      return { success: true, user: adminRecord, role: 'admin' };
    }

    // ── 2. Seller Login (@mondaymart.in) ──
    if (cleanEmail.endsWith('@mondaymart.in')) {
      const seller = await findUserByEmail(cleanEmail);

      if (!seller || seller.role !== 'seller') {
        return {
          success: false,
          error: 'No approved seller account found with this email. Please apply through seller registration and wait for admin approval.',
        };
      }

      // Check against current Firestore password
      const expectedPass = seller.password || seller.tempPassword;
      if (expectedPass && cleanPassword !== expectedPass) {
        return { success: false, error: 'Incorrect password for this seller account.' };
      }

      setCurrentUser(seller);
      return { success: true, user: seller, role: 'seller' };
    }

    // ── 3. Customer Login (personal email) ──
    const customer = await findUserByEmail(cleanEmail);

    if (!customer) {
      return {
        success: false,
        error: 'No account found with this email in the database. Please click "Register as Customer" to create an account.',
      };
    }

    // Check against current Firestore password
    if (customer.password && cleanPassword !== customer.password) {
      return { success: false, error: 'Incorrect password for this account.' };
    }

    setCurrentUser(customer);
    return { success: true, user: customer, role: customer.role || 'customer' };
  };

  // ─── Register Customer ────────────────────────────────────────────────────────
  const registerCustomer = async ({ name, email, phone, password = '' }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName  = name.trim();
    const cleanPhone = (phone || '').trim();
    const cleanPass  = password.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please create a password for your account.' };
    }

    // Check if account already exists in Firestore
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in with your password.',
      };
    }

    const newCustomer = {
      id:        `user-c-${Date.now()}`,
      name:      cleanName,
      email:     cleanEmail,
      phone:     cleanPhone,
      password:  cleanPass,
      role:      'customer',
      avatar:    `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanName}`,
      createdAt: new Date().toISOString(),
    };

    await saveUser(newCustomer);
    setCurrentUser(newCustomer);
    return { success: true, user: newCustomer, role: 'customer' };
  };

  // ─── Seller Onboarding ────────────────────────────────────────────────────────
  const submitSellerApplication = async (appData) => {
    const cleanEmail = appData.personalEmail.trim().toLowerCase();
    const id = `req-${Date.now()}`;
    const newApp = {
      id,
      ownerName:       appData.ownerName.trim(),
      storeName:       appData.storeName.trim(),
      personalEmail:   cleanEmail,
      phone:           appData.phone.trim(),
      category:        appData.category || 'General',
      address:         appData.address  || 'Campus',
      idPhotoUrl:      appData.idPhotoUrl || '',
      submittedAt:     new Date().toISOString(),
      isPhoneVerified: true,
      status:          'pending',
    };
    await saveSeller(newApp);
    return { success: true, application: newApp };
  };

  const approveSeller = async (requestId) => {
    const target = pendingSellers.find((r) => r.id === requestId);
    if (!target) return { success: false, error: 'Request not found' };

    let baseEmail = generateSellerEmail(target.storeName);
    let sellerEmail = baseEmail;

    // Ensure email is unique across existing users
    let counter = 1;
    while (users.some((u) => u.email?.toLowerCase() === sellerEmail.toLowerCase())) {
      counter++;
      const prefix = baseEmail.split('@')[0];
      sellerEmail = `${prefix}${counter}@mondaymart.in`;
    }

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
      password:      tempPassword,
      approvedAt:    new Date().toISOString(),
    };

    await saveUser(newSellerUser);
    await saveSeller({
      ...target,
      status: 'approved',
      assignedEmail: sellerEmail,
      tempPassword,
      approvedAt: new Date().toISOString(),
    });

    return { success: true, sellerEmail, tempPassword, sellerUser: newSellerUser };
  };

  const rejectSeller = async (requestId, reason = 'Documentation incomplete') => {
    const target = pendingSellers.find((r) => r.id === requestId);
    if (!target) return { success: false };
    await saveSeller({ ...target, status: 'rejected', rejectReason: reason });
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
