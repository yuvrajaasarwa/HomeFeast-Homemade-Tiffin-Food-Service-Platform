import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  Sparkles,
  ChefHat,
  User,
  Utensils,
  Bell,
  CheckCircle2,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  AlertTriangle,
  HeartHandshake,
  Search,
  MessageSquareWarning,
  Bike
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Navbar = ({ activePage, setActivePage }) => {
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const {
    user,
    logoutUser,
    selectedCity,
    selectedLocality,
    activeSubscription,
    setIsLocationModalOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead
  } = useAuth();
  const { addToast } = useToast();

  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const notiMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const formattedCityName = selectedCity
    ? selectedCity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Jaipur';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notiMenuRef.current && !notiMenuRef.current.contains(event.target)) {
        setIsNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'HF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const isGuest = !user || !user.id || user.id === 'guest';
  const role = (user?.role || 'CUSTOMER').toUpperCase();

  return (
    <header className="navbar-wrapper">
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
          {/* Brand Logo & Location Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="#home"
              data-testid="nav-brand-logo"
              onClick={(e) => { e.preventDefault(); setActivePage('home'); }}
              className="brand-logo"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                  fontSize: '22px'
                }}
              >
                🍲
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  Home<span style={{ color: '#DC2626' }}>Feast</span>
                </span>
                <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#DC2626', textTransform: 'uppercase', marginTop: '2px' }}>
                  Homemade Tiffin Platform
                </span>
              </div>
            </a>

            {/* City Selector Pill */}
            <button
              type="button"
              data-testid="city-selector-button"
              onClick={() => setIsLocationModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1C1917',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <MapPin size={15} color="#DC2626" />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontWeight: 800, fontSize: '13px', color: '#1C1917' }}>{formattedCityName}</div>
                <div style={{ fontSize: '10.5px', color: '#78716C', maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedLocality || 'Select Hub'}
                </div>
              </div>
              <ChevronDown size={14} color="#78716C" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setActivePage('home')}
              data-testid="nav-home"
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: activePage === 'home' ? '#FEF2F2' : 'transparent',
                color: activePage === 'home' ? '#DC2626' : '#57534E',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('kitchens')}
              data-testid="nav-kitchens"
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: activePage === 'kitchens' ? '#FEF2F2' : 'transparent',
                color: activePage === 'kitchens' ? '#DC2626' : '#57534E',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ChefHat size={16} color={activePage === 'kitchens' ? '#DC2626' : '#78716C'} />
              <span>Find Cooks</span>
            </button>
            <button
              onClick={() => setActivePage('menu')}
              data-testid="nav-menu"
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: activePage === 'menu' ? '#FEF2F2' : 'transparent',
                color: activePage === 'menu' ? '#DC2626' : '#57534E',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Daily Dishes
            </button>
            <button
              onClick={() => setActivePage('plans')}
              data-testid="nav-plans"
              style={{
                padding: '8px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: activePage === 'plans' ? '#FEF2F2' : 'transparent',
                color: activePage === 'plans' ? '#DC2626' : '#57534E',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={15} color={activePage === 'plans' ? '#DC2626' : '#EAB308'} />
              <span>Meal Plans</span>
            </button>

            {/* Role specific quick tabs (Only for logged-in users) */}
            {!isGuest && role === 'CUSTOMER' && (
              <button
                onClick={() => setActivePage('my-pass')}
                data-testid="nav-customer-hub"
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activePage === 'my-pass' ? '#FEF2F2' : 'transparent',
                  color: activePage === 'my-pass' ? '#DC2626' : '#57534E',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Calendar size={15} />
                <span>My Passes & Orders</span>
              </button>
            )}

            {!isGuest && role === 'PROVIDER' && (
              <button
                onClick={() => setActivePage('provider-portal')}
                data-testid="nav-cook-portal"
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activePage === 'provider-portal' ? '#EBFBEE' : 'transparent',
                  color: activePage === 'provider-portal' ? '#2B8A3E' : '#2B8A3E',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ChefHat size={15} />
                <span>Cook Portal</span>
              </button>
            )}

            {!isGuest && role === 'RIDER' && (
              <button
                onClick={() => setActivePage('rider-portal')}
                data-testid="nav-rider-hub"
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activePage === 'rider-portal' ? '#FEF2F2' : 'transparent',
                  color: activePage === 'rider-portal' ? '#D9480F' : '#D9480F',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Bike size={15} />
                <span>Rider Hub</span>
              </button>
            )}

            {!isGuest && role === 'ADMIN' && (
              <button
                onClick={() => setActivePage('admin')}
                data-testid="nav-admin-hub"
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activePage === 'admin' ? '#EEF2FF' : 'transparent',
                  color: activePage === 'admin' ? '#4F46E5' : '#4F46E5',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={15} />
                <span>Admin Hub</span>
              </button>
            )}
          </div>

          {/* Right Action Icons: Notification, Cart, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification Bell Dropdown */}
            <div style={{ position: 'relative' }} ref={notiMenuRef}>
              <button
                type="button"
                data-testid="notifications-button"
                onClick={() => setIsNotiOpen(!isNotiOpen)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isNotiOpen ? '#FEF2F2' : '#FFFFFF',
                  border: '1.5px solid #EAE3D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                title="Notifications"
              >
                <Bell size={18} color="#1C1917" />
                {unreadNotifCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF'
                    }}
                  >
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotiOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '52px',
                    right: '0',
                    width: '340px',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                    border: '1px solid #EAE3D9',
                    zIndex: 200,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '14px 18px', background: '#FAF8F5', borderBottom: '1px solid #EAE3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>In-App Notifications</span>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ border: 'none', background: 'none', fontSize: '11px', color: '#DC2626', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '6px' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#78716C', fontSize: '13px' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.actionUrl) {
                              const target = n.actionUrl.replace('#', '');
                              if (target === 'my-pass' || target === 'orders' || target === 'passes') setActivePage('my-pass');
                              else if (target === 'admin' || target === 'admin-providers' || target === 'admin-complaints') setActivePage('admin');
                              else if (target === 'provider-dashboard' || target === 'provider-orders' || target === 'provider-portal' || target === 'subscriptions' || target === 'reviews') setActivePage('provider-portal');
                              else if (target === 'rider-portal' || target === 'rider-tasks' || target === 'fleet') setActivePage('rider-portal');
                            }
                            setIsNotiOpen(false);
                          }}
                          style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: n.isRead ? '#FFFFFF' : '#FEF2F2',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            border: n.isRead ? '1px solid transparent' : '1px solid #FECACA',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#1C1917' }}>{n.title}</span>
                            {!n.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626' }}></span>}
                          </div>
                          <p style={{ fontSize: '11.5px', color: '#57534E', lineHeight: 1.4 }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              type="button"
              data-testid="cart-button"
              onClick={() => setIsDrawerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                background: totalItemsCount > 0 ? '#DC2626' : '#FFFFFF',
                color: totalItemsCount > 0 ? '#FFFFFF' : '#1C1917',
                border: totalItemsCount > 0 ? 'none' : '1.5px solid #EAE3D9',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: totalItemsCount > 0 ? '0 4px 14px rgba(220, 38, 38, 0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <ShoppingBag size={17} />
              <span>Dabba</span>
              {totalItemsCount > 0 && (
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile & Role Switcher Menu */}
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              {isGuest ? (
                <button
                  type="button"
                  data-testid="login-register-button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '9999px',
                    border: '1.5px solid #EAE3D9',
                    background: '#FFFFFF',
                    color: '#1C1917',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <User size={16} color="#DC2626" />
                  <span>Login / Register</span>
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="user-profile-button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px 6px 6px',
                    borderRadius: '9999px',
                    border: '1.5px solid #EAE3D9',
                    background: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: role === 'ADMIN' ? '#4F46E5' : role === 'PROVIDER' ? '#2B8A3E' : '#DC2626',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px'
                    }}
                  >
                    {getInitials(user?.name)}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1C1917', maxWidth: '90px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name?.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: role === 'ADMIN' ? '#4F46E5' : role === 'PROVIDER' ? '#2B8A3E' : '#DC2626' }}>
                      {role}
                    </div>
                  </div>
                  <ChevronDown size={14} color="#78716C" />
                </button>
              )}

              {/* Profile Dropdown Panel */}
              {isProfileMenuOpen && !isGuest && (
                <div
                  style={{
                    position: 'absolute',
                    top: '52px',
                    right: '0',
                    width: '280px',
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)',
                    border: '1px solid #EAE3D9',
                    zIndex: 200,
                    overflow: 'hidden',
                    padding: '8px'
                  }}
                >
                  {/* User info card */}
                  <div style={{ padding: '12px', background: '#FAF8F5', borderRadius: '14px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1C1917' }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', color: '#78716C' }}>{user?.email}</div>
                    <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: role === 'ADMIN' ? '#EEF2FF' : role === 'PROVIDER' ? '#EBFBEE' : '#FEF2F2', color: role === 'ADMIN' ? '#4F46E5' : role === 'PROVIDER' ? '#2B8A3E' : '#DC2626', padding: '2px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 800 }}>
                      <span>ROLE: {role}</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px 0' }}>
                    <button
                      onClick={() => { setActivePage('my-pass'); setIsProfileMenuOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#1C1917', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <Calendar size={16} color="#DC2626" />
                      <span>Customer Dashboard</span>
                    </button>
                    {(role === 'PROVIDER' || role === 'ADMIN') && (
                      <button
                        onClick={() => { setActivePage('provider-portal'); setIsProfileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#2B8A3E', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <ChefHat size={16} color="#2B8A3E" />
                        <span>Provider Management Portal</span>
                      </button>
                    )}
                    {(role === 'RIDER' || role === 'ADMIN') && (
                      <button
                        onClick={() => { setActivePage('rider-portal'); setIsProfileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#D9480F', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <Bike size={16} color="#D9480F" />
                        <span>Rider Fleet & Delivery Portal</span>
                      </button>
                    )}
                    {role === 'ADMIN' && (
                      <button
                        onClick={() => { setActivePage('admin'); setIsProfileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#4F46E5', cursor: 'pointer', textAlign: 'left' }}
                      >
                        <ShieldCheck size={16} color="#4F46E5" />
                        <span>Admin Platform Governance</span>
                      </button>
                    )}
                    <button
                      onClick={() => { logoutUser(); setIsProfileMenuOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', border: 'none', background: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#DC2626', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <LogOut size={16} color="#DC2626" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              style={{
                display: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EAE3D9', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => { setActivePage('home'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px' }}>Home</button>
          <button onClick={() => { setActivePage('kitchens'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px' }}>Find Home Cooks</button>
          <button onClick={() => { setActivePage('menu'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px' }}>Daily Menus</button>
          <button onClick={() => { setActivePage('plans'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px' }}>Meal Plans</button>
          <button onClick={() => { setActivePage('my-pass'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px' }}>Customer Dashboard</button>
          {(role === 'PROVIDER' || role === 'ADMIN') && (
            <button onClick={() => { setActivePage('provider-portal'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#2B8A3E' }}>Cook Portal</button>
          )}
          {role === 'ADMIN' && (
            <button onClick={() => { setActivePage('admin'); setIsMobileNavOpen(false); }} style={{ padding: '10px', border: 'none', background: 'none', textAlign: 'left', fontWeight: 700, fontSize: '15px', color: '#4F46E5' }}>Admin Hub</button>
          )}
        </div>
      )}
    </header>
  );
};
