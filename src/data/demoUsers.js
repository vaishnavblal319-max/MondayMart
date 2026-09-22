// ─── Seed Users ───────────────────────────────────────────────────────────────
// Only the admin account is seeded by default.
// Sellers and customers are created through registration flow.
// For demo purposes, one demo seller account is provided so the Login page
// quick-fill works, but that seller starts with ZERO products.

export const initialUsers = [
  {
    id: 'user-admin',
    name: 'Marketplace Operations Admin',
    email: 'admin@mondaymart.in',
    phone: '+91 80000 00000',
    role: 'admin',
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=admin`,
  },
  // Demo seller – approved via IEDC. Starts with empty product list.
  {
    id: 'user-s1',
    name: 'Chef Marco',
    email: 'freshbakes@mondaymart.in',
    phone: '+91 98450 11223',
    role: 'seller',
    storeName: 'The Burger Guild & Bistro',
    category: 'Fast Food & Gourmet',
    address: 'Stall #04, Campus Quadrangle',
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=freshbakes`,
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

// No pending sellers by default — demo sellers must go through the
// Register → OTP → Admin approval flow during the presentation.
export const initialPendingSellers = [];
