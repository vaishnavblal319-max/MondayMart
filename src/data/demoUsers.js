// No seed data. All data enters the system through the app flows:
// - Admin: logs in with admin@mondaymart.in (auto-created in Firestore on first login)
// - Sellers: register through the seller onboarding flow → admin approval
// - Customers: register or log in with any personal email
// - Products: sellers add from their dashboard
// - Orders: customers place from the marketplace

export const initialUsers = [];
export const initialPendingSellers = [];
