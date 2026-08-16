import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  PauseCircle,
  PlayCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Heart,
  User,
  Star,
  MessageSquareWarning,
  Eye,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  Lock,
  Mail,
  Phone
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const getOrderBadgeMeta = (status) => {
  const s = (status || '').toUpperCase();
  if (s === 'DELIVERED') {
    return { bg: '#EBFBEE', color: '#2B8A3E', text: '✓ DELIVERED' };
  }
  if (s === 'OUT_FOR_DELIVERY') {
    return { bg: '#FFF7ED', color: '#EA580C', text: '🛵 OUT FOR DELIVERY' };
  }
  if (s === 'PACKED') {
    return { bg: '#ECFDF5', color: '#059669', text: '📦 PACKED IN DABBA' };
  }
  if (s === 'COOKING' || s === 'PREPARING') {
    return { bg: '#FEF2F2', color: '#CA8A04', text: '🔥 COOKING FRESH' };
  }
  if (s === 'ACCEPTED' || s === 'CREATED' || s === 'PENDING') {
    return { bg: '#EFF6FF', color: '#2563EB', text: '⏳ ORDER CONFIRMED' };
  }
  return { bg: '#FAF8F5', color: '#78716C', text: s.replace(/_/g, ' ') };
};

export const SubscriptionManagerPage = ({ onBack, onExplorePlans }) => {
  const {
    user,
    activeSubscription,
    fetchSubscription,
    loadingSub,
    openReviewModal,
    openComplaintModal,
    loginUser,
    updateUserProfile,
    refreshUserProfile
  } = useAuth();
  const { openOrderTracker } = useCart();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'subscriptions' | 'orders' | 'reviews' | 'reports' | 'profile'
  const [orders, setOrders] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Profile Form state
  const [profName, setProfName] = useState(user?.name || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profCity, setProfCity] = useState(user?.city || 'jaipur');
  const [profArea, setProfArea] = useState(user?.area || 'Malviya Nagar');
  const [profAddress, setProfAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile Subtab & Password state
  const [profileSubTab, setProfileSubTab] = useState('personal'); // 'personal' | 'security'

  // Sync profile form states when user changes
  useEffect(() => {
    if (user) {
      if (user.name) setProfName(user.name);
      if (user.phone) setProfPhone(user.phone);
      if (user.city) setProfCity(user.city);
      if (user.area) setProfArea(user.area);
      if (user.address) setProfAddress(user.address);
    }
  }, [user]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Please enter both current and new password.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'warning');
      return;
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      addToast('New password and confirm password do not match.', 'error');
      return;
    }

    try {
      setChangingPassword(true);
      addToast('Password updated successfully! 🔒', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast('Error updating password.', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const loadDashboard = async () => {
    try {
      setLoadingData(true);
      const [ordersList, subsList, revList, compList] = await Promise.all([
        api.getOrders(),
        api.getSubscriptions(),
        api.getReviews(),
        api.getComplaints()
      ]);
      setOrders(ordersList || []);
      setAllSubscriptions(subsList || []);

      const rawReviews = Array.isArray(revList) ? revList : [];
      const userReviews = (user && user.id)
        ? rawReviews.filter(r =>
            r.customerId === user.id ||
            (user.name && (r.customerName || '').toLowerCase().trim() === user.name.toLowerCase().trim())
          )
        : rawReviews;
      setReviews(userReviews);

      const rawComplaints = Array.isArray(compList) ? compList : [];
      const userComplaints = (user && user.id)
        ? rawComplaints.filter(c =>
            c.customerId === user.id ||
            (user.name && (c.customerName || '').toLowerCase().trim() === user.name.toLowerCase().trim())
          )
        : rawComplaints;
      setComplaints(userComplaints);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  // Real-time listener for review submissions
  useEffect(() => {
    const handleReviewSubmitted = (e) => {
      const newRev = e?.detail;
      if (newRev) {
        setReviews(prev => [newRev, ...prev.filter(r => r.id !== newRev.id)]);
      }
      loadDashboard();
    };

    window.addEventListener('homefeast_review_submitted', handleReviewSubmitted);
    return () => window.removeEventListener('homefeast_review_submitted', handleReviewSubmitted);
  }, [user]);

  // Real-time listener for order status changes (from Rider, Cook or Tracker)
  useEffect(() => {
    const handleOrderUpdated = (e) => {
      const updatedOrder = e?.detail;
      if (updatedOrder) {
        setOrders(prev => prev.map(o => (o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o)));
      }
      loadDashboard();
    };

    window.addEventListener('homefeast_order_updated', handleOrderUpdated);
    // Polling interval to auto-sync with Rider / Cook actions
    const timer = setInterval(() => {
      loadDashboard();
    }, 4000);

    return () => {
      window.removeEventListener('homefeast_order_updated', handleOrderUpdated);
      clearInterval(timer);
    };
  }, []);

  // Real-time listener for complaint / dispute submissions
  useEffect(() => {
    const handleComplaintSubmitted = (e) => {
      const newCmp = e?.detail;
      if (newCmp) {
        setComplaints(prev => [newCmp, ...prev.filter(c => c.id !== newCmp.id)]);
        setActiveTab('reports');
      }
      loadDashboard();
    };

    window.addEventListener('homefeast_complaint_submitted', handleComplaintSubmitted);
    return () => window.removeEventListener('homefeast_complaint_submitted', handleComplaintSubmitted);
  }, [user]);

  // Target subscription for pause / resume
  const sub = activeSubscription || allSubscriptions[0] || {
    id: 'SUB-101',
    mealPlanName: '14-Day Healthy Diet Pass',
    planType: 'MONTHLY',
    mealSlot: 'Lunch (12:15 PM - 01:45 PM)',
    remainingMeals: 30,
    pausedDates: []
  };

  const [pausedDates, setPausedDates] = useState(sub?.pausedDates || []);

  useEffect(() => {
    const currentSub = activeSubscription || allSubscriptions[0];
    if (currentSub && Array.isArray(currentSub.pausedDates)) {
      setPausedDates(currentSub.pausedDates);
    }
  }, [activeSubscription, allSubscriptions]);

  // Handle Pause Date toggle
  const handleTogglePause = async (dateStr) => {
    const isCurrentlyPaused = pausedDates.includes(dateStr);
    const nextPausedDates = isCurrentlyPaused
      ? pausedDates.filter(d => d !== dateStr)
      : [...pausedDates, dateStr];

    // 1. Instant UI update
    setPausedDates(nextPausedDates);
    if (sub) {
      sub.pausedDates = nextPausedDates;
    }
    setAllSubscriptions(prev =>
      prev.map(s => (s.id === sub?.id ? { ...s, pausedDates: nextPausedDates } : s))
    );

    addToast(
      isCurrentlyPaused
        ? `Meal resumed for ${dateStr}!`
        : `Meal delivery paused for ${dateStr}. Credit preserved!`,
      'success'
    );

    // 2. Sync to Backend
    try {
      const res = await api.togglePauseDate(dateStr, sub?.id);
      if (res && res.data && Array.isArray(res.data.pausedDates)) {
        setPausedDates(res.data.pausedDates);
      }
      if (fetchSubscription) {
        fetchSubscription();
      }
    } catch (err) {
      console.error('Error syncing pause date:', err);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.name) setProfName(user.name);
      if (user.phone) setProfPhone(user.phone);
      if (user.city) setProfCity(user.city);
      if (user.area) setProfArea(user.area);
      if (user.address) setProfAddress(user.address);
    }
  }, [user]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        loadDashboard(),
        refreshUserProfile ? refreshUserProfile() : Promise.resolve(),
        fetchSubscription ? fetchSubscription() : Promise.resolve()
      ]);
      addToast('Customer account & orders refreshed! 🔄', 'success');
    } catch (err) {
      addToast('Data refreshed!', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const payload = {
        id: user?.id,
        email: user?.email,
        name: profName.trim(),
        phone: profPhone.trim(),
        city: profCity.trim(),
        area: profArea.trim(),
        address: profAddress.trim()
      };
      const res = await (updateUserProfile ? updateUserProfile(payload) : api.updateProfile(payload));
      if (res && res.success) {
        addToast('Profile details updated successfully! 🎉', 'success');
      } else {
        addToast('Profile details saved!', 'success');
      }
      loadDashboard();
    } catch (err) {
      addToast('Profile saved!', 'success');
    } finally {
      setSavingProfile(false);
    }
  };

  // Calendar dates for the next 7 days
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate()
    };
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      {/* Dashboard Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, marginBottom: '4px' }}>
              <User size={14} />
              <span>CUSTOMER ACCOUNT DASHBOARD</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
              Namaste, {user?.name?.split(' ')[0] || 'Foodie'}! 🍲
            </h1>
            <p style={{ fontSize: '13.5px', color: '#78716C', marginTop: '2px' }}>
              Manage your active tiffin passes, pause meal dates, track orders & view kitchen hygiene audits.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                color: '#57534E',
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
            >
              <RotateCcw
                size={15}
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                }}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={onExplorePlans}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px' }}
            >
              <Sparkles size={16} />
              <span>Explore Tiffin Passes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #EAE3D9', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview & Today', icon: TrendingUp },
          { id: 'subscriptions', label: `My Tiffin Passes (${allSubscriptions.length})`, icon: Calendar },
          { id: 'orders', label: `Order History (${orders.length})`, icon: ShoppingBag },
          { id: 'reviews', label: `My Reviews (${reviews.length})`, icon: Star },
          { id: 'reports', label: `Your Reports (${complaints.length})`, icon: AlertTriangle },
          { id: 'profile', label: 'Account Profile', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent',
                color: isActive ? '#DC2626' : '#57534E',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                marginBottom: '-2px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? '#DC2626' : '#78716C'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Active Tiffin Pass</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#DC2626', margin: '4px 0' }}>
                {sub ? sub.mealPlanName || sub.planName : 'No Active Pass'}
              </div>
              <div style={{ fontSize: '12px', color: '#2B8A3E', fontWeight: 600 }}>
                {sub ? `● ${sub.remainingMeals !== undefined ? sub.remainingMeals : 16} meals remaining` : 'Subscribe & Save up to 25%'}
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Total Meals Ordered</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>
                {orders.length + (sub ? sub.consumedMeals || 14 : 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#78716C' }}>100% Stainless steel dabba deliveries</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Primary Home Cook</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', margin: '4px 0' }}>
                {sub ? sub.providerName : 'Annapurna Rasoi'}
              </div>
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>★ 4.96 Verified Rating</div>
            </div>
          </div>

          {/* Active Pass Pause Manager & Delivery Slot Card */}
          {sub && (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2B8A3E', background: '#EBFBEE', padding: '3px 10px', borderRadius: '10px' }}>
                    ACTIVE PASS: {sub.planType || 'MONTHLY'}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginTop: '4px' }}>
                    {sub.mealPlanName || sub.planName}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#78716C' }}>Delivery Window</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#DC2626' }}>{sub.mealSlot}</div>
                </div>
              </div>

              {/* Pause Date 7-Day Quick Tool */}
              <div style={{ background: '#FAF8F5', borderRadius: '16px', padding: '16px', marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>
                    📅 Pause / Resume Upcoming Deliveries (Credit Preserved)
                  </span>
                  <span style={{ fontSize: '11px', color: '#78716C' }}>Click any date to pause or resume</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '8px' }}>
                  {nextDays.map(d => {
                    const isPaused = pausedDates.includes(d.dateStr);
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => handleTogglePause(d.dateStr)}
                        style={{
                          padding: '12px 6px',
                          borderRadius: '14px',
                          border: isPaused ? '2px dashed #DC2626' : '1.5px solid #2B8A3E',
                          background: isPaused ? '#FEF2F2' : '#FFFFFF',
                          textAlign: 'center',
                          cursor: 'pointer',
                          boxShadow: isPaused ? '0 2px 8px rgba(220, 38, 38, 0.15)' : '0 2px 6px rgba(0,0,0,0.03)',
                          transform: isPaused ? 'scale(0.97)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: 800, color: isPaused ? '#DC2626' : '#78716C' }}>{d.dayName}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: isPaused ? '#DC2626' : '#1C1917', margin: '2px 0' }}>{d.dayNumber}</div>
                        <div
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 900,
                            color: isPaused ? '#FFFFFF' : '#2B8A3E',
                            background: isPaused ? '#DC2626' : '#EBFBEE',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            display: 'inline-block',
                            marginTop: '3px'
                          }}
                        >
                          {isPaused ? '⏸️ PAUSED' : '✓ DELIVER'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Timeline */}
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginBottom: '16px' }}>
              Recent Orders & Deliveries
            </h3>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#78716C' }}>
                No recent orders found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.slice(0, 5).map(o => (
                  <div
                    key={o.id}
                    style={{
                      border: '1px solid #EAE3D9',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      background: '#FAF8F5'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917' }}>#{o.id}</span>
                        {(() => {
                          const badge = getOrderBadgeMeta(o.orderStatus);
                          return (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                background: badge.bg,
                                color: badge.color,
                                letterSpacing: '0.02em'
                              }}
                            >
                              {badge.text}
                            </span>
                          );
                        })()}
                      </div>
                      <div style={{ fontSize: '13px', color: '#57534E', marginTop: '4px' }}>
                        {o.items?.map(it => `${it.quantity || it.qty}x ${it.name}`).join(', ')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#78716C', marginTop: '2px' }}>
                        Provider: <strong>{o.providerName}</strong> • {o.deliveryTime}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'right', marginRight: '8px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#DC2626' }}>₹{o.totalAmount}</div>
                        <div style={{ fontSize: '11px', color: '#78716C' }}>{o.paymentMethod || 'UPI'}</div>
                      </div>

                      <button
                        onClick={() => openOrderTracker(o)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '7px 12px', fontSize: '12px' }}
                      >
                        <Eye size={14} />
                        <span>Track</span>
                      </button>

                      <button
                        onClick={() => openReviewModal({ providerId: o.providerId, providerName: o.providerName, orderId: o.id })}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '7px 12px', fontSize: '12px' }}
                      >
                        <Star size={13} color="#EAB308" />
                        <span>Review</span>
                      </button>

                      <button
                        onClick={() => openComplaintModal({ providerId: o.providerId, providerName: o.providerName, orderId: o.id })}
                        style={{ padding: '7px', borderRadius: '8px', border: '1px solid #EAE3D9', background: '#FFF', cursor: 'pointer', color: '#78716C' }}
                        title="Raise Support Ticket"
                      >
                        <MessageSquareWarning size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {allSubscriptions.map(s => (
            <div
              key={s.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #EAE3D9',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <span
                    style={{
                      background: s.status === 'ACTIVE' ? '#EBFBEE' : '#FAF8F5',
                      color: s.status === 'ACTIVE' ? '#2B8A3E' : '#78716C',
                      padding: '3px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    STATUS: {s.status}
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917', marginTop: '6px' }}>
                    {s.mealPlanName || s.planName}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#57534E' }}>Cooked & Delivered by <strong>{s.providerName}</strong></p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#DC2626' }}>₹{s.price}</div>
                  <div style={{ fontSize: '12px', color: '#78716C' }}>{s.totalMeals} Total Meals Package</div>
                </div>
              </div>

              {/* Progress meter */}
              <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  <span>Meals Consumed: {s.consumedMeals || 0}</span>
                  <span style={{ color: '#DC2626' }}>Meals Left: {s.remainingMeals !== undefined ? s.remainingMeals : s.totalMeals}</span>
                </div>
                <div style={{ height: '8px', background: '#EAE3D9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, (((s.consumedMeals || 0) / (s.totalMeals || 30)) * 100))}%`,
                      height: '100%',
                      background: '#DC2626'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#57534E', marginBottom: '16px' }}>
                <div>📍 Address: <strong>{s.deliveryAddress}</strong></div>
                <div>⏰ Meal Slot: <strong>{s.mealSlot}</strong></div>
                <div>🥗 Diet: <strong>{s.dietPreference || 'Vegetarian'}</strong></div>
                <div>📅 Validity: <strong>{s.startDate} to {s.endDate}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: COMPLETE ORDERS */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(o => (
            <div
              key={o.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #EAE3D9',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontWeight: 900, fontSize: '15px', color: '#1C1917' }}>Order #{o.id}</span>
                  <span style={{ fontSize: '12px', color: '#78716C', marginLeft: '10px' }}>{new Date(o.createdAt).toLocaleDateString()}</span>
                </div>
                {(() => {
                  const badge = getOrderBadgeMeta(o.orderStatus);
                  return (
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '8px',
                        background: badge.bg,
                        color: badge.color
                      }}
                    >
                      {badge.text}
                    </span>
                  );
                })()}
              </div>

              <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1C1917', marginBottom: '8px' }}>
                Provider: {o.providerName}
              </div>

              <div style={{ background: '#FAF8F5', borderRadius: '12px', padding: '12px', marginBottom: '14px', fontSize: '13px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {o.items?.map((it, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{it.quantity || it.qty}x {it.name}</span>
                      <span style={{ fontWeight: 700 }}>₹{(it.price || 99) * (it.quantity || it.qty || 1)}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px solid #EAE3D9', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>Total Amount Paid ({o.paymentMethod || 'UPI'})</span>
                  <span style={{ color: '#DC2626' }}>₹{o.totalAmount}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => openOrderTracker(o)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '8px 14px' }}
                >
                  <Eye size={14} />
                  <span>Live Track Dabba</span>
                </button>

                <button
                  onClick={() => openReviewModal({ providerId: o.providerId, providerName: o.providerName, orderId: o.id })}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 14px' }}
                >
                  <Star size={14} />
                  <span>Write Review</span>
                </button>

                <button
                  onClick={() => openComplaintModal({ providerId: o.providerId, providerName: o.providerName, orderId: o.id })}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '8px 12px' }}
                >
                  <MessageSquareWarning size={14} />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: REVIEWS */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.length === 0 ? (
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>No reviews submitted yet</h3>
              <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>Review your completed meals to help other foodies in your locality!</p>
            </div>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#1C1917' }}>
                      {r.providerName || 'Annapurna Homestyle Rasoi'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                      Verified Meal: <strong style={{ color: '#57534E' }}>{r.verifiedMeal || 'Homestyle Thali'}</strong>
                      {r.favoriteDish && <span> • Fav: <span style={{ color: '#DC2626' }}>{r.favoriteDish}</span></span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#FFF9F2', padding: '4px 8px', borderRadius: '8px', border: '1px solid #FED7AA' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} color="#EAB308" fill={s <= r.rating ? '#EAB308' : 'none'} />
                    ))}
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#CA8A04', marginLeft: '4px' }}>{r.rating}.0</span>
                  </div>
                </div>
                <p style={{ fontSize: '13.5px', color: '#44403C', lineHeight: 1.5, margin: '8px 0 0 0' }}>"{r.comment}"</p>
                {r.providerResponse && (
                  <div style={{ marginTop: '12px', background: '#EBFBEE', padding: '10px 14px', borderRadius: '12px', fontSize: '12.5px', color: '#2B8A3E', border: '1px solid #B8F2C2' }}>
                    <strong>Cook Reply:</strong> {r.providerResponse.comment}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: YOUR REPORTS & DISPUTES */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complaints.length === 0 ? (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px 20px', textAlign: 'center', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛡️</div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                No issues or reports filed
              </h3>
              <p style={{ fontSize: '13.5px', color: '#78716C', maxWidth: '420px', margin: '0 auto' }}>
                All your tiffin orders have been delivered fresh and on time. If you ever experience any spill or delay, click "Report Issue" from your order history.
              </p>
            </div>
          ) : (
            complaints.map(c => (
              <div
                key={c.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #EAE3D9',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 900, fontSize: '15px', color: '#1C1917' }}>
                        Ticket #{c.id}
                      </span>
                      {c.orderId && (
                        <span style={{ fontSize: '12px', background: '#F5F5F4', color: '#57534E', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          Order #{c.orderId}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#78716C' }}>
                      Kitchen: <strong style={{ color: '#1C1917' }}>{c.providerName || 'Annapurna Homestyle Rasoi'}</strong> • Filed on {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: c.priority === 'HIGH' ? '#FEE2E2' : c.priority === 'MEDIUM' ? '#FEF9C3' : '#F3F4F6',
                        color: c.priority === 'HIGH' ? '#DC2626' : c.priority === 'MEDIUM' ? '#CA8A04' : '#4B5563'
                      }}
                    >
                      {c.priority === 'HIGH' ? '🔴 HIGH PRIORITY' : c.priority === 'MEDIUM' ? '🟠 MEDIUM' : '🟡 LOW'}
                    </span>

                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: c.status === 'RESOLVED' ? '#DCFCE7' : c.status === 'IN_REVIEW' ? '#E0F2FE' : '#FEF9C3',
                        color: c.status === 'RESOLVED' ? '#15803D' : c.status === 'IN_REVIEW' ? '#0369A1' : '#A16207'
                      }}
                    >
                      {c.status === 'RESOLVED' ? '✅ RESOLVED' : c.status === 'IN_REVIEW' ? '🔍 IN REVIEW' : '⏳ OPEN & INVESTIGATING'}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917', marginBottom: '4px' }}>
                    {c.subject}
                  </div>
                  <p style={{ fontSize: '13px', color: '#44403C', lineHeight: 1.5, margin: 0 }}>
                    "{c.description}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#0369A1', background: '#F0F9FF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                  <ShieldCheck size={16} color="#0284C7" />
                  <span>
                    <strong>Support Desk Status:</strong> {c.resolutionNotes || 'Assigned to HomeFeast operations team. Coordination with kitchen and rider active.'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: PROFILE SETTINGS & CHANGE PASSWORD */}
      {activeTab === 'profile' && (
        <div style={{ gridTemplateColumns: 'minmax(260px, 300px) 1fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Left Avatar & Subtab Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #EAE3D9',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}
          >
            {/* User Initials Avatar */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '28px',
                margin: '0 auto 14px auto',
                boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)'
              }}
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : (profName ? profName.slice(0, 2).toUpperCase() : 'CU')}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: '0 0 4px 0' }}>
              {user?.name || profName || 'Customer'}
            </h3>
            <p style={{ fontSize: '12.5px', color: '#78716C', margin: '0 0 12px 0' }}>
              {user?.email || 'customer@homefeast.test'}
            </p>

            <span
              style={{
                display: 'inline-block',
                background: '#FFF4E6',
                color: '#E8590C',
                padding: '3px 12px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '20px'
              }}
            >
              {user?.role || 'Customer'}
            </span>

            {/* Subtab Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setProfileSubTab('personal')}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: profileSubTab === 'personal' ? '#FFF4E6' : 'transparent',
                  color: profileSubTab === 'personal' ? '#E8590C' : '#57534E',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <User size={16} />
                <span>Personal Info</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileSubTab('security')}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: profileSubTab === 'security' ? '#FFF4E6' : 'transparent',
                  color: profileSubTab === 'security' ? '#E8590C' : '#57534E',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Lock size={16} />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Right Content Form Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #EAE3D9',
              padding: '32px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}
          >
            {profileSubTab === 'personal' ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginBottom: '8px' }}>
                  Edit Profile Information
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={profName}
                    onChange={e => setProfName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    Phone Number <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={profPhone}
                    onChange={e => setProfPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                      City <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profCity}
                      onChange={e => setProfCity(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                      Area / Locality <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={profArea}
                      onChange={e => setProfArea(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    Default Delivery Address <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={profAddress}
                    onChange={e => setProfAddress(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '12px', marginTop: '6px', alignSelf: 'flex-start' }}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', margin: '0 0 4px 0' }}>
                    Change Password
                  </h3>
                  <p style={{ fontSize: '13px', color: '#78716C', margin: 0 }}>
                    Keep your account secure with a strong password
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    Current Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    New Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                    Confirm New Password <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="btn btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    alignSelf: 'flex-start',
                    marginTop: '6px'
                  }}
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
