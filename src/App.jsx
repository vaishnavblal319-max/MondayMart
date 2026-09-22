import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/landing/LoginModal';
import { CustomerRegisterModal } from './components/landing/CustomerRegisterModal';
import { SellerRegisterModal } from './components/seller-onboarding/SellerRegisterModal';
import { OtpVerificationModal } from './components/seller-onboarding/OtpVerificationModal';
import { AdminApprovalModal } from './components/admin/AdminApprovalModal';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CartDrawer } from './components/customer/CartDrawer';
import { OrderSuccessModal } from './components/customer/OrderSuccessModal';
import { MyOrdersModal } from './components/customer/MyOrdersModal';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { FirebaseSetupModal } from './components/common/FirebaseSetupModal';

const MainApp = () => {
  const { currentUser } = useAuth();

  // Navigation view: 'landing' | 'customer' | 'seller'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_current_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user?.role === 'seller') return 'seller';
        if (user?.role === 'customer') return 'customer';
      }
    } catch {}
    return 'landing';
  });

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCustomerRegisterOpen, setIsCustomerRegisterOpen] = useState(false);
  const [isSellerRegisterOpen, setIsSellerRegisterOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isAdminApprovalOpen, setIsAdminApprovalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isFirebaseSetupOpen, setIsFirebaseSetupOpen] = useState(false);

  // Temporary seller onboarding registration state
  const [sellerRegData, setSellerRegData] = useState(null);

  // Newly placed order for celebration modal
  const [recentOrder, setRecentOrder] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const showToast = (message, type = 'success') => setToast({ message, type });

  // When user logs in, auto switch view according to role
  // Use a ref to avoid showing toast on every render
  const [hasGreeted, setHasGreeted] = useState(false);

  useEffect(() => {
    if (currentUser && !hasGreeted) {
      setHasGreeted(true);
      if (currentUser.role === 'seller') {
        setCurrentView('seller');
        showToast(`Welcome back, ${currentUser.name}! Seller Portal active.`);
      } else if (currentUser.role === 'customer') {
        setCurrentView('customer');
        showToast(`Welcome, ${currentUser.name}! Happy ordering.`);
      } else if (currentUser.role === 'admin') {
        setIsAdminApprovalOpen(true);
        showToast('Admin Console loaded.');
      }
    }
    if (!currentUser) {
      setHasGreeted(false);
      setCurrentView('landing');
    }
  }, [currentUser]);

  // Handlers for Onboarding & Auth
  const handleProceedToOtp = (formData) => {
    setSellerRegData(formData);
    setIsSellerRegisterOpen(false);
    setIsOtpOpen(true);
  };

  const handleApplicationSubmitted = () => {
    showToast('Phone verified! Seller application sent to Admin queue.', 'success');
  };

  const handleOrderPlaced = (order) => {
    setRecentOrder(order);
    showToast(`Order #${order.id} placed! QR pass & PIN generated.`, 'success');
  };

  const handleLoginSuccess = (role) => {
    if (role === 'seller') {
      setCurrentView('seller');
    } else if (role === 'admin') {
      setIsAdminApprovalOpen(true);
    } else {
      setCurrentView('customer');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#09090b', color: '#ffffff' }}>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Main Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenCustomerRegister={() => setIsCustomerRegisterOpen(true)}
        onOpenSellerRegister={() => setIsSellerRegisterOpen(true)}
        onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenFirebaseSetup={() => setIsFirebaseSetupOpen(true)}
      />

      {/* Active View */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage
            onExploreMenu={() => setCurrentView('customer')}
            onOpenSellerRegister={() => setIsSellerRegisterOpen(true)}
            onOpenCustomerRegister={() => setIsCustomerRegisterOpen(true)}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {currentView === 'customer' && (
          <CustomerDashboard
            onOpenCart={() => setIsCartOpen(true)}
            onOpenOrders={() => setIsOrdersOpen(true)}
          />
        )}

        {currentView === 'seller' && <SellerDashboard />}
      </main>

      {/* Modals & Drawers */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenCustomerRegister={() => setIsCustomerRegisterOpen(true)}
        onOpenSellerRegister={() => setIsSellerRegisterOpen(true)}
        onSuccessLogin={handleLoginSuccess}
      />

      <CustomerRegisterModal
        isOpen={isCustomerRegisterOpen}
        onClose={() => setIsCustomerRegisterOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSuccess={() => {
          showToast('Account created! Welcome to MondayMarket.');
          setCurrentView('customer');
        }}
      />

      <SellerRegisterModal
        isOpen={isSellerRegisterOpen}
        onClose={() => setIsSellerRegisterOpen(false)}
        onProceedToOtp={handleProceedToOtp}
      />

      <OtpVerificationModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        sellerData={sellerRegData}
        onApplicationSubmitted={handleApplicationSubmitted}
        onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
      />

      <AdminApprovalModal
        isOpen={isAdminApprovalOpen}
        onClose={() => setIsAdminApprovalOpen(false)}
        onSwitchToSeller={() => setCurrentView('seller')}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderSuccessModal
        isOpen={Boolean(recentOrder)}
        order={recentOrder}
        onClose={() => setRecentOrder(null)}
        onOpenOrders={() => {
          setRecentOrder(null);
          setIsOrdersOpen(true);
        }}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <FirebaseSetupModal
        isOpen={isFirebaseSetupOpen}
        onClose={() => setIsFirebaseSetupOpen(false)}
        onConfigSaved={() => showToast('Firebase Realtime Database connected! Live sync enabled.')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <MainApp />
      </MarketProvider>
    </AuthProvider>
  );
}
