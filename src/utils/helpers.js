// Utility helpers for MondayMarket

export const generateRandomPin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateOrderId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MM-${prefix}${num}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' +
    date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const generateSellerEmail = (storeName) => {
  const sanitized = storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15);
  const fallback = sanitized || 'partner';
  return `${fallback}@mondaymart.in`;
};
