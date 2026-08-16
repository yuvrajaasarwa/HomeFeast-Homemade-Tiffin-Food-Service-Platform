import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BottomAppNav } from './components/BottomAppNav';
import { HomePage } from './pages/HomePage';
import { KitchensPage } from './pages/KitchensPage';
import { ProviderProfilePage } from './pages/ProviderProfilePage';
import { MenuPage } from './pages/MenuPage';
import { ThaliBuilderPage } from './pages/ThaliBuilderPage';
import { PlansPage } from './pages/PlansPage';
import { SubscriptionManagerPage } from './pages/SubscriptionManagerPage';
import { ProviderDashboard } from './components/ProviderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RiderDashboard } from './components/RiderDashboard';
import { HygienePage } from './pages/HygienePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PlanCheckoutModal } from './components/PlanCheckoutModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { ReviewModal } from './components/ReviewModal';
import { ComplaintModal } from './components/ComplaintModal';
import { RiderDashboardModal } from './components/RiderDashboardModal';

import { useAuth } from './context/AuthContext';

function RoleAccessBarrier({ requiredRole, requiredTitle, requiredIcon, onGoHome }) {
  const { user, setIsAuthModalOpen, setAuthModalTab } = useAuth();
  const currentRole = user?.role || 'GUEST';

  return (
    <div data-testid="role-access-barrier" style={{ maxWidth: '640px', margin: '60px auto', padding: '36px 24px', textAlign: 'center', background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #EAE3D9', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.07)' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
        🔒
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEE2E2', color: '#B91C1C', padding: '4px 12px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
        Access Restricted • Current Role: {currentRole}
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1C1917', marginBottom: '8px' }}>
        {requiredTitle}
      </h2>
      <p style={{ fontSize: '14px', color: '#78716C', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.5 }}>
        This management portal requires verified <strong>{requiredRole}</strong> account credentials. Direct navigation without authorization is blocked by Platform Role-Based Access Control (RBAC).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto' }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            setAuthModalTab('login');
            setIsAuthModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 20px', fontWeight: 700, borderRadius: '12px' }}
        >
          <span>🔐 Sign In with {requiredRole} Credentials</span>
        </button>
        <button
          className="btn btn-secondary"
          data-testid="barrier-go-home-button"
          onClick={onGoHome}
          style={{ padding: '10px 20px', fontWeight: 600, borderRadius: '12px' }}
        >
          Return to Food Discovery 🍲
        </button>
      </div>
    </div>
  );
}

export function App() {
  const { user } = useAuth();
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '');
    const validPages = [
      'home',
      'kitchens',
      'provider-profile',
      'menu',
      'thali-builder',
      'plans',
      'my-pass',
      'provider-portal',
      'rider-portal',
      'admin',
      'hygiene',
      'about',
      'contact'
    ];
    return validPages.includes(hash) ? hash : 'home';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [selectedProviderId, setSelectedProviderId] = useState('prov_1');

  // Sync page state with browser URL hash
  const navigateTo = (pageName, param = null) => {
    if (param && pageName === 'provider-profile') {
      setSelectedProviderId(param);
    }
    setActivePage(pageName);
    window.location.hash = pageName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = [
        'home',
        'kitchens',
        'provider-profile',
        'menu',
        'thali-builder',
        'plans',
        'my-pass',
        'provider-portal',
        'rider-portal',
        'admin',
        'hygiene',
        'about',
        'contact'
      ];
      if (validPages.includes(hash)) {
        setActivePage(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={navigateTo}
      />

      {/* Main Page Router */}
      <main style={{ flexGrow: 1 }}>
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectProvider={(provId) => navigateTo('provider-profile', provId)}
          />
        )}

        {activePage === 'kitchens' && (
          <KitchensPage
            onSelectProvider={(provId) => navigateTo('provider-profile', provId)}
            onBack={() => navigateTo('home')}
            onExploreThali={() => navigateTo('thali-builder')}
          />
        )}

        {activePage === 'provider-profile' && (
          <ProviderProfilePage
            providerId={selectedProviderId}
            onBack={() => navigateTo('kitchens')}
            onOpenThaliBuilder={() => navigateTo('thali-builder')}
          />
        )}

        {activePage === 'menu' && (
          <MenuPage
            onBack={() => navigateTo('home')}
            onOpenThaliBuilder={() => navigateTo('thali-builder')}
          />
        )}

        {activePage === 'thali-builder' && (
          <ThaliBuilderPage onBack={() => navigateTo('home')} />
        )}

        {activePage === 'plans' && (
          <PlansPage
            onBack={() => navigateTo('home')}
            onNavigateToPass={() => navigateTo('my-pass')}
          />
        )}

        {activePage === 'my-pass' && (
          <SubscriptionManagerPage
            onBack={() => navigateTo('home')}
            onExplorePlans={() => navigateTo('plans')}
          />
        )}

        {activePage === 'provider-portal' && (
          user?.role === 'PROVIDER'
            ? <ProviderDashboard />
            : <RoleAccessBarrier requiredRole="PROVIDER" requiredTitle="Home Cook Kitchen Portal" requiredIcon="👩‍🍳" onGoHome={() => navigateTo('home')} />
        )}

        {activePage === 'rider-portal' && (
          user?.role === 'RIDER'
            ? <RiderDashboard />
            : <RoleAccessBarrier requiredRole="RIDER" requiredTitle="Green Fleet Rider Portal" requiredIcon="🚴" onGoHome={() => navigateTo('home')} />
        )}

        {activePage === 'admin' && (
          user?.role === 'ADMIN'
            ? <AdminDashboard />
            : <RoleAccessBarrier requiredRole="ADMIN" requiredTitle="Platform Operations Hub" requiredIcon="🛡️" onGoHome={() => navigateTo('home')} />
        )}

        {activePage === 'hygiene' && (
          <HygienePage onBack={() => navigateTo('home')} />
        )}

        {activePage === 'about' && (
          <AboutPage
            onExploreMenu={() => navigateTo('menu')}
            onExplorePlans={() => navigateTo('plans')}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage
            onExploreMenu={() => navigateTo('menu')}
            onExplorePlans={() => navigateTo('plans')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom App Navigation (Mobile) */}
      <BottomAppNav
        activePage={activePage}
        setActivePage={navigateTo}
      />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <PlanCheckoutModal />
      <LocationModal />
      <AuthModal />
      <ReviewModal />
      <ComplaintModal />
      <RiderDashboardModal />

      {/* Floating WhatsApp Support Widget */}
      <a
        href="https://wa.me/919829012345?text=Hello%20HomeFeast!%20I%20want%20to%20inquire%20about%20tiffin%20subscriptions%20and%20daily%20homestyle%20meals."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp Web (24/7 Support)"
        style={{
          position: 'fixed',
          bottom: '76px',
          right: '24px',
          zIndex: 999,
          background: '#25D366',
          color: '#FFFFFF',
          borderRadius: '9999px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '13px',
          transition: 'all 0.2s ease',
          border: '1.5px solid rgba(255, 255, 255, 0.4)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.55)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
        }}
      >
        <MessageCircle size={19} color="#FFFFFF" />
        <span>WhatsApp Support</span>
      </a>
    </div>
  );
}

export default App;
