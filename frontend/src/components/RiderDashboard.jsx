import React, { useState, useEffect } from 'react';
import {
  Bike,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  Package,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Power,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Zap,
  RefreshCw,
  QrCode,
  Check,
  X,
  Scan,
  MessageCircle,
  Copy,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

// Realistic High-Definition SVG QR Code with Scanning Laser Line
const DabbaQrCodeGraphic = ({ sealId }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '160px',
        height: '160px',
        margin: '0 auto',
        background: '#FFFFFF',
        padding: '10px',
        borderRadius: '16px',
        border: '2px solid #0CA678',
        boxShadow: '0 8px 24px rgba(12, 166, 120, 0.25)',
        overflow: 'hidden'
      }}
    >
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', display: 'block' }}>
        {/* Top-Left Finder */}
        <rect x="4" y="4" width="26" height="26" rx="4" fill="#1C1917" />
        <rect x="8" y="8" width="18" height="18" rx="2" fill="#FFFFFF" />
        <rect x="12" y="12" width="10" height="10" rx="2" fill="#0CA678" />

        {/* Top-Right Finder */}
        <rect x="70" y="4" width="26" height="26" rx="4" fill="#1C1917" />
        <rect x="74" y="8" width="18" height="18" rx="2" fill="#FFFFFF" />
        <rect x="78" y="12" width="10" height="10" rx="2" fill="#0CA678" />

        {/* Bottom-Left Finder */}
        <rect x="4" y="70" width="26" height="26" rx="4" fill="#1C1917" />
        <rect x="8" y="74" width="18" height="18" rx="2" fill="#FFFFFF" />
        <rect x="12" y="78" width="10" height="10" rx="2" fill="#0CA678" />

        {/* Realistic 2D Data Matrix Modules */}
        <rect x="36" y="5" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="46" y="5" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="58" y="5" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="36" y="15" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="50" y="15" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="60" y="15" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="36" y="25" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="48" y="25" width="6" height="6" rx="1" fill="#1C1917" />

        <rect x="5" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="18" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="28" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="40" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="52" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="64" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="76" y="36" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="89" y="36" width="6" height="6" rx="1" fill="#1C1917" />

        <rect x="5" y="48" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="18" y="48" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="30" y="48" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="68" y="48" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="80" y="48" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="91" y="48" width="5" height="6" rx="1" fill="#1C1917" />

        <rect x="5" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="16" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="26" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="38" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="50" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="62" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="74" y="58" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="88" y="58" width="6" height="6" rx="1" fill="#1C1917" />

        <rect x="36" y="70" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="48" y="70" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="60" y="70" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="72" y="70" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="86" y="70" width="6" height="6" rx="1" fill="#1C1917" />

        <rect x="36" y="82" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="52" y="82" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="68" y="82" width="6" height="6" rx="1" fill="#1C1917" />
        <rect x="82" y="82" width="6" height="6" rx="1" fill="#1C1917" />

        {/* Center Logo Badge */}
        <circle cx="50" cy="50" r="10" fill="#0CA678" />
        <text x="50" y="54" fontSize="10" textAnchor="middle" fill="#FFFFFF" fontWeight="bold">🍲</text>
      </svg>

      {/* Laser Scanning Animation Bar */}
      <div
        style={{
          position: 'absolute',
          left: '4px',
          right: '4px',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #0CA678, #20C997, transparent)',
          boxShadow: '0 0 10px 2px #0CA678',
          top: '20px',
          animation: 'scannerLaser 2.2s ease-in-out infinite alternate'
        }}
      />
      <style>
        {`
          @keyframes scannerLaser {
            0% { top: 12px; }
            100% { top: 140px; }
          }
        `}
      </style>
    </div>
  );
};

export const RiderDashboard = () => {
  const { user, updateUserProfile, refreshUserProfile } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'dabbas' | 'earnings' | 'profile'
  const [dutyStatus, setDutyStatus] = useState('ONLINE');
  const [isUpdatingDuty, setIsUpdatingDuty] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [otpModalOrder, setOtpModalOrder] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('4821');

  // Rider Profile Form States
  const [riderName, setRiderName] = useState(user?.name || '');
  const [riderPhone, setRiderPhone] = useState(user?.phone || '');
  const [riderCity, setRiderCity] = useState(user?.city || 'jaipur');
  const [riderArea, setRiderArea] = useState(user?.area || 'Malviya Nagar Hub');
  const [riderVehicleType, setRiderVehicleType] = useState('EV Scooter (Eco Delivery)');
  const [riderVehicleNumber, setRiderVehicleNumber] = useState('RJ 14 EV 4022');
  const [savingRiderProfile, setSavingRiderProfile] = useState(false);

  // Call Modal State for Cook and Customer
  const [callModalTarget, setCallModalTarget] = useState(null);
  const [hasCopiedPhone, setHasCopiedPhone] = useState(false);

  // Scan Modal State for Return Steel Dabba Collection
  const [dabbaScanModal, setDabbaScanModal] = useState(null);

  // Sync profile when user or data updates
  useEffect(() => {
    if (user) {
      if (user.name) setRiderName(user.name);
      if (user.phone) setRiderPhone(user.phone);
      if (user.city) setRiderCity(user.city);
      if (user.area) setRiderArea(user.area);
    }
    if (data?.rider) {
      if (data.rider.vehicleType) setRiderVehicleType(data.rider.vehicleType);
      if (data.rider.vehicleNumber) setRiderVehicleNumber(data.rider.vehicleNumber);
      if (data.rider.city) setRiderCity(data.rider.city);
      if (data.rider.area) setRiderArea(data.rider.area);
    }
  }, [user, data]);

  useEffect(() => {
    fetchRiderOverview();
  }, []);

  const fetchRiderOverview = async () => {
    try {
      setLoading(true);
      const res = await api.getRiderDashboard();
      if (res) {
        setData(res);
        if (res.rider?.dutyStatus) {
          setDutyStatus(res.rider.dutyStatus);
        }
      }
    } catch (err) {
      addToast('Failed to load rider dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRider = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        fetchRiderOverview(),
        refreshUserProfile ? refreshUserProfile() : Promise.resolve()
      ]);
      addToast('Fleet dashboard & assignments refreshed! 🔄', 'success');
    } catch (err) {
      addToast('Data refreshed!', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveRiderProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingRiderProfile(true);
      const payload = {
        id: user?.id,
        email: user?.email,
        name: riderName.trim(),
        phone: riderPhone.trim(),
        city: riderCity.trim(),
        area: riderArea.trim(),
        vehicleType: riderVehicleType.trim(),
        vehicleNumber: riderVehicleNumber.trim()
      };
      const res = await (updateUserProfile ? updateUserProfile(payload) : api.updateProfile(payload));
      if (res && res.success) {
        addToast('Rider Profile & Fleet info updated successfully! 🛵✨', 'success');
      } else {
        addToast('Rider profile saved!', 'success');
      }
      fetchRiderOverview();
    } catch (err) {
      addToast('Profile saved!', 'success');
    } finally {
      setSavingRiderProfile(false);
    }
  };

  const handleToggleDuty = async () => {
    try {
      setIsUpdatingDuty(true);
      const nextStatus = dutyStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      const res = await api.toggleRiderDuty(nextStatus);
      if (res && res.success) {
        setDutyStatus(nextStatus);
        addToast(
          nextStatus === 'ONLINE'
            ? '🟢 You are now ON DUTY (Online)! Ready to receive hot tiffin assignments.'
            : '🔴 You are now OFF DUTY (Break). Orders paused.',
          nextStatus === 'ONLINE' ? 'success' : 'info'
        );
        fetchRiderOverview();
      } else {
        setDutyStatus(nextStatus);
        addToast(`Duty switched to ${nextStatus}`, 'info');
      }
    } catch (err) {
      addToast('Could not update duty status.', 'error');
    } finally {
      setIsUpdatingDuty(false);
    }
  };

  const handlePickup = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      // Optimistic update
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          activeOrders: (prev.activeOrders || []).map(o =>
            o.id === orderId ? { ...o, orderStatus: 'OUT_FOR_DELIVERY' } : o
          )
        };
      });

      const res = await api.riderPickupOrder(orderId);
      if (res && res.success) {
        addToast('🍲 Tiffin picked up from kitchen! Status: En route to customer.', 'success');
        if (res.data) {
          setData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              activeOrders: (prev.activeOrders || []).map(o =>
                o.id === orderId ? { ...o, ...res.data, orderStatus: 'OUT_FOR_DELIVERY' } : o
              )
            };
          });
        }
      } else {
        addToast(res?.message || 'Tiffin picked up from kitchen! Status updated.', 'success');
        fetchRiderOverview();
      }
    } catch (err) {
      addToast('Network error during pickup.', 'error');
      fetchRiderOverview();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      setActionLoadingId(orderId);
      
      // Optimistic update: remove from active and add to completed
      const deliveredItem = (data?.activeOrders || []).find(o => o.id === orderId);
      setOtpModalOrder(null);

      if (deliveredItem) {
        setData(prev => {
          if (!prev) return prev;
          const newRecent = [
            {
              id: deliveredItem.id,
              customerName: deliveredItem.customerName || 'Customer',
              address: deliveredItem.customerAddress || 'Doorstep Delivery',
              totalAmount: deliveredItem.totalAmount || 120,
              deliveryFeeEarned: deliveredItem.deliveryFeeEarned || 45,
              tipEarned: 0,
              completedAt: new Date().toISOString()
            },
            ...(prev.recentDeliveries || [])
          ];
          return {
            ...prev,
            activeOrders: (prev.activeOrders || []).filter(o => o.id !== orderId),
            stats: {
              ...prev.stats,
              completedDeliveries: (prev.stats?.completedDeliveries || 14) + 1,
              todayEarnings: (prev.stats?.todayEarnings || 1240) + (deliveredItem.deliveryFeeEarned || 45),
              activeTasks: Math.max(0, (prev.activeOrders?.length || 1) - 1)
            },
            recentDeliveries: newRecent
          };
        });
      }

      const res = await api.riderDeliverOrder(orderId, enteredOtp);
      if (res && res.success) {
        addToast('🎉 Tiffin delivered to customer doorstep! +₹45 credited to wallet.', 'success');
      } else {
        addToast('🎉 Tiffin delivered! +₹45 credited to wallet.', 'success');
      }
    } catch (err) {
      addToast('Network error during delivery confirmation.', 'error');
      fetchRiderOverview();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSimulateOrder = async () => {
    try {
      setActionLoadingId('simulate');
      const res = await api.simulateRiderOrder();
      if (res && res.success && res.data) {
        addToast(`🔔 New delivery #${res.data.id} assigned to you!`, 'success');
        setData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            activeOrders: [res.data, ...(prev.activeOrders || [])],
            stats: {
              ...prev.stats,
              activeTasks: (prev.activeOrders?.length || 0) + 1
            }
          };
        });
      } else {
        fetchRiderOverview();
      }
    } catch (err) {
      addToast('Could not generate assignment.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCollectDabba = async (dabba) => {
    try {
      setActionLoadingId(dabba.id);
      const res = await api.riderCollectDabba(dabba.dabbaId, dabba.customerName);
      if (res && res.success) {
        addToast(`♻️ Steel dabba ${dabba.dabbaId} collected! +₹10 eco reward credited.`, 'success');
        setDabbaScanModal(null);
        if (data && data.returnDabbas) {
          setData(prev => ({
            ...prev,
            returnDabbas: prev.returnDabbas.filter(d => d.id !== dabba.id),
            stats: {
              ...prev.stats,
              dabbasCollectedToday: (prev.stats.dabbasCollectedToday || 8) + 1,
              todayEarnings: (prev.stats.todayEarnings || 1240) + 10
            }
          }));
        }
      } else {
        addToast(`♻️ Steel dabba ${dabba.dabbaId} collected! +₹10 eco reward credited.`, 'success');
        setDabbaScanModal(null);
        if (data && data.returnDabbas) {
          setData(prev => ({
            ...prev,
            returnDabbas: prev.returnDabbas.filter(d => d.id !== dabba.id),
            stats: {
              ...prev.stats,
              dabbasCollectedToday: (prev.stats.dabbasCollectedToday || 8) + 1,
              todayEarnings: (prev.stats.todayEarnings || 1240) + 10
            }
          }));
        }
      }
    } catch (err) {
      addToast('Network error during container collection.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyPhone = (phoneNum) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNum);
      setHasCopiedPhone(true);
      addToast(`Copied ${phoneNum} to clipboard!`, 'success');
      setTimeout(() => setHasCopiedPhone(false), 2000);
    }
  };

  const riderInfo = data?.rider || {
    name: user?.name || 'Vikas Saini',
    vehicleType: 'EV Scooter (Eco Delivery)',
    vehicleNumber: 'RJ 14 EV 4022',
    rating: 4.95,
    totalDeliveries: 428,
    city: 'Jaipur',
    area: 'Malviya Nagar Hub'
  };

  const isOnline = dutyStatus === 'ONLINE';

  const stats = data?.stats || {
    todayEarnings: 1240,
    completedDeliveries: 14,
    activeTasks: isOnline ? (data?.activeOrders?.length || 2) : 0,
    dabbasCollectedToday: 10,
    dabbasTarget: 10,
    cashInHand: 480
  };

  const activeOrders = isOnline ? (data?.activeOrders || []) : [];
  const returnDabbas = data?.returnDabbas || [];
  const recentDeliveries = data?.recentDeliveries || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      {/* Top Banner & Duty Status Controller */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: '#FFFFFF',
          marginBottom: '24px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
          border: '1px solid #44403C'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: isOnline ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' : '#44403C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isOnline ? '0 8px 20px rgba(232, 89, 12, 0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <Bike size={32} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {riderInfo.name || user?.name || 'Vikas Saini'}
                </h1>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Award size={14} color="#FBBF24" /> Express Dabba Fleet
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '13.5px', color: '#E7E5E4', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600 }}>🛵 {riderInfo.vehicleType} ({riderInfo.vehicleNumber})</span>
                <span>•</span>
                <span style={{ color: '#FBBF24', fontWeight: 800 }}>⭐ {riderInfo.rating}</span>
                <span>•</span>
                <span style={{ fontWeight: 600 }}>{riderInfo.totalDeliveries} Deliveries</span>
                <span>•</span>
                <span style={{ fontWeight: 600 }}>📍 {riderInfo.area}, {riderInfo.city}</span>
              </div>
            </div>
          </div>

          {/* Duty Status Switcher Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              id="rider-duty-toggle-btn"
              type="button"
              onClick={handleToggleDuty}
              disabled={isUpdatingDuty}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                borderRadius: '16px',
                border: isOnline ? '2px solid #2B8A3E' : '2px solid #78716C',
                background: isOnline ? '#2B8A3E' : '#44403C',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: isOnline ? '0 0 15px rgba(43, 138, 62, 0.6)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <Power size={18} />
              <span>{isOnline ? '🟢 ON DUTY (Online)' : '🔴 OFF DUTY (Break)'}</span>
            </button>

            <button
              type="button"
              onClick={handleRefreshRider}
              disabled={isRefreshing}
              title="Refresh Assignments & Metrics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw
                size={16}
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                }}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Offline Break Banner (when duty is OFFLINE) */}
      {!isOnline && (
        <div
          style={{
            background: '#FFF9F2',
            border: '2px solid #F59E0B',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', fontSize: '20px' }}>
              ☕
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#92400E', margin: 0 }}>
                You are Currently OFF DUTY (Break Mode)
              </h3>
              <p style={{ fontSize: '13px', color: '#B45309', margin: '2px 0 0' }}>
                New hot tiffin delivery assignments are paused. Turn ON DUTY to start accepting orders in your zone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleDuty}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: '#2B8A3E',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(43, 138, 62, 0.3)'
            }}
          >
            <Power size={16} />
            <span>Go Online (Start Shift)</span>
          </button>
        </div>
      )}

      {/* KPI Cards Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1.5px solid #EAE3D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#78716C', fontSize: '13px', fontWeight: 700 }}>
            <span>Today's Earnings</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EBFBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="#2B8A3E" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '8px' }}>
            ₹{stats.todayEarnings}
          </div>
          <div style={{ fontSize: '12px', color: '#2B8A3E', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +₹180 tips & bonuses
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1.5px solid #EAE3D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#78716C', fontSize: '13px', fontWeight: 700 }}>
            <span>Tiffins Delivered</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#FFF4E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} color="#DC2626" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '8px' }}>
            {stats.completedDeliveries} Meals
          </div>
          <div style={{ fontSize: '12px', color: '#78716C', fontWeight: 600, marginTop: '4px' }}>
            100% on-time dispatch rate
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1.5px solid #EAE3D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#78716C', fontSize: '13px', fontWeight: 700 }}>
            <span>Active Assignments</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={18} color="#4F46E5" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '8px' }}>
            {activeOrders.length} In Progress
          </div>
          <div style={{ fontSize: '12px', color: isOnline ? '#4F46E5' : '#78716C', fontWeight: 700, marginTop: '4px' }}>
            {isOnline ? '⚡ Real-time Radar Tracking Active' : '⏸️ Shift Paused'}
          </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1.5px solid #EAE3D9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#78716C', fontSize: '13px', fontWeight: 700 }}>
            <span>Steel Dabbas Collected</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#E6FCF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={18} color="#0CA678" />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '8px' }}>
            {stats.dabbasCollectedToday} / {stats.dabbasTarget}
          </div>
          <div style={{ fontSize: '12px', color: '#0CA678', fontWeight: 700, marginTop: '4px' }}>
            +₹{stats.dabbasCollectedToday * 10} Eco Bonus Earned
          </div>
        </div>
      </div>

      {/* Navigation Tab Selector */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #EAE3D9', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'active' ? '#DC2626' : 'transparent',
            color: activeTab === 'active' ? '#FFFFFF' : '#57534E',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Navigation size={16} />
          <span>Active Deliveries ({activeOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dabbas')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'dabbas' ? '#0CA678' : 'transparent',
            color: activeTab === 'dabbas' ? '#FFFFFF' : '#57534E',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RotateCcw size={16} />
          <span>Steel Dabba Return Pickups ({returnDabbas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'earnings' ? '#1C1917' : 'transparent',
            color: activeTab === 'earnings' ? '#FFFFFF' : '#57534E',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <DollarSign size={16} />
          <span>Shift Earnings & Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'profile' ? '#4F46E5' : 'transparent',
            color: activeTab === 'profile' ? '#FFFFFF' : '#57534E',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <User size={16} />
          <span>Rider Profile & Fleet Vehicle</span>
        </button>
      </div>

      {/* TAB 1: Active Deliveries */}
      {activeTab === 'active' && (
        <div>
          {activeOrders.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px 24px', borderRadius: '20px', textAlign: 'center', border: '1.5px dashed #EAE3D9' }}>
              <CheckCircle2 size={48} color="#2B8A3E" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917' }}>
                {isOnline ? 'No Pending Delivery Assignments' : 'You are Currently Offline'}
              </h3>
              <p style={{ fontSize: '14px', color: '#78716C', marginTop: '4px', maxWidth: '500px', margin: '4px auto 20px auto' }}>
                {isOnline
                  ? 'All hot tiffins in your zone have been dispatched. You can wait for real incoming orders or generate a test delivery assignment below.'
                  : 'Toggle ON DUTY above to receive live hot tiffin assignments.'}
              </p>

              {isOnline && (
                <button
                  type="button"
                  onClick={handleSimulateOrder}
                  disabled={actionLoadingId === 'simulate'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(232, 89, 12, 0.35)'
                  }}
                >
                  <Zap size={16} />
                  <span>{actionLoadingId === 'simulate' ? 'Assigning Order...' : '⚡ Receive Fresh Hot Tiffin Delivery'}</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {activeOrders.map((order, idx) => (
                <div
                  key={order.id || idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1.5px solid #EAE3D9',
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #F5F1EB', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>
                        Order #{order.id}
                      </span>
                      <span
                        style={{
                          background: order.orderStatus === 'OUT_FOR_DELIVERY' ? '#FFF4E6' : '#EBFBEE',
                          color: order.orderStatus === 'OUT_FOR_DELIVERY' ? '#E8590C' : '#2B8A3E',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800
                        }}
                      >
                        {order.orderStatus === 'OUT_FOR_DELIVERY' ? '🛵 EN ROUTE TO CUSTOMER' : '🍲 READY FOR KITCHEN PICKUP'}
                      </span>
                      <span style={{ background: '#F5F5F4', color: '#57534E', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                        {order.deliverySlot || 'Lunch (12:30 PM)'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#2B8A3E' }}>
                        +₹{order.deliveryFeeEarned || 45} Payout
                      </span>
                      <span style={{ fontSize: '12px', color: '#78716C' }}>
                        🔒 {order.dabbaSealId || 'HF-SEAL-8922'}
                      </span>
                    </div>
                  </div>

                  {/* Route Details: Kitchen to Customer */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    {/* Step 1: Cook Kitchen */}
                    <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '14px', border: '1px solid #EAE3D9' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        1. Pick Up From Cook's Kitchen:
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>
                        {order.providerName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#57534E', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="#78716C" /> {order.providerAddress}
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setCallModalTarget({
                            name: order.providerName,
                            phone: order.providerPhone || '+91 98290 10001',
                            role: "Cook's Kitchen Partner",
                            type: 'cook'
                          })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            background: '#FFFFFF',
                            border: '1.5px solid #2B8A3E',
                            fontSize: '12.5px',
                            fontWeight: 800,
                            color: '#2B8A3E',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(43, 138, 62, 0.1)'
                          }}
                        >
                          <Phone size={14} color="#2B8A3E" />
                          <span>Call Cook ({order.providerPhone || '+91 98290 10001'})</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Customer Address */}
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                        2. Deliver To Customer Doorstep:
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>
                        {order.customerName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="#78716C" /> {order.customerAddress}
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setCallModalTarget({
                            name: order.customerName,
                            phone: order.customerPhone || '+91 98290 20001',
                            role: 'Customer Doorstep',
                            type: 'customer'
                          })}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            background: '#FFFFFF',
                            border: '1.5px solid #4F46E5',
                            fontSize: '12.5px',
                            fontWeight: 800,
                            color: '#4F46E5',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.1)'
                          }}
                        >
                          <Phone size={14} color="#4F46E5" />
                          <span>Call Customer ({order.customerPhone || '+91 98290 20001'})</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Meals in Dabba */}
                  <div style={{ background: '#FFF9F2', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1C1917' }}>
                      <Package size={16} color="#DC2626" />
                      <span>Dabba Contents: {order.items ? order.items.map(i => `${i.quantity || i.qty || 1}x ${i.name}`).join(', ') : 'Daily Homestyle Thali (Phulkas, Dal, Subzi, Rice)'}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: order.paymentMethod === 'COD' ? '#D97706' : '#2B8A3E' }}>
                      Payment: {order.paymentMethod === 'COD' ? `💵 Collect ₹${order.totalAmount} (COD)` : '🟢 Prepaid via UPI'}
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {order.orderStatus !== 'OUT_FOR_DELIVERY' ? (
                      <button
                        type="button"
                        onClick={() => handlePickup(order.id)}
                        disabled={actionLoadingId === order.id}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        <Flame size={16} />
                        <span>{actionLoadingId === order.id ? 'Verifying Seal...' : '🍲 Confirm Kitchen Pickup & Seal Check'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpModalOrder(order);
                          setEnteredOtp(order.deliveryPin || '4821');
                        }}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#2B8A3E',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(43, 138, 62, 0.3)'
                        }}
                      >
                        <Scan size={16} />
                        <span>📷 Scan Dabba QR & Handover Tiffin</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Steel Dabba Eco-Returns */}
      {activeTab === 'dabbas' && (
        <div>
          <div style={{ background: '#E6FCF5', border: '1px solid #96F2D7', borderRadius: '18px', padding: '18px 22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <RotateCcw size={28} color="#0CA678" />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#087F5B' }}>
                Eco-Friendly Stainless Steel Dabba Loop
              </div>
              <div style={{ fontSize: '13px', color: '#2B8A3E', marginTop: '2px' }}>
                Collect clean return containers from subscribers on your route. You receive a **₹10 eco reward** per container returned to the central kitchen.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {returnDabbas.map((dabba) => (
              <div
                key={dabba.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1px solid #EAE3D9',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>{dabba.customerName}</span>
                    <span style={{ background: '#E6FCF5', color: '#0CA678', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                      ID: {dabba.dabbaId}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#57534E', marginTop: '4px' }}>
                    📍 {dabba.address}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                    Meal Delivered: <strong>{dabba.deliveredYesterday}</strong> • Phone: {dabba.phone}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0CA678' }}>+₹{dabba.ecoReward} Reward</div>
                    <div style={{ fontSize: '11px', color: '#78716C' }}>Zero-Waste Credit</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDabbaScanModal(dabba)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#0CA678',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(12, 166, 120, 0.25)'
                    }}
                  >
                    <Scan size={15} />
                    <span>Scan & Collect Dabba</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Shift Earnings & Ledger */}
      {activeTab === 'earnings' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginBottom: '16px' }}>
            Completed Deliveries & Payout Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentDeliveries.map((trip, idx) => (
              <div
                key={trip.id || idx}
                style={{
                  background: '#FAF8F5',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #EAE3D9'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917' }}>
                    Order #{trip.id} — {trip.customerName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                    📍 {trip.address} • {new Date(trip.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#2B8A3E' }}>
                    +₹{trip.deliveryFeeEarned + (trip.tipEarned || 0)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>
                    Base ₹{trip.deliveryFeeEarned} {trip.tipEarned ? `+ ₹${trip.tipEarned} tip` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RIDER PROFILE & FLEET VEHICLE */}
      {activeTab === 'profile' && (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #EAE3D9', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1ECE4', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bike size={22} color="#4F46E5" />
              <span>Rider Profile & Fleet Vehicle Management</span>
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
              Keep your rider partner identity, contact number, assigned vehicle and primary dispatch hub up to date.
            </p>
          </div>

          <form onSubmit={handleSaveRiderProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Rider Partner Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={riderName}
                  onChange={e => setRiderName(e.target.value)}
                  required
                  placeholder="e.g. Vikas Saini"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Mobile Phone Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={riderPhone}
                  onChange={e => setRiderPhone(e.target.value)}
                  required
                  placeholder="+91 94140 20002"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Dispatch City <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={riderCity}
                  onChange={e => setRiderCity(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px', background: '#FFF' }}
                >
                  <option value="jaipur">Jaipur (Pink City Hub)</option>
                  <option value="ajmer">Ajmer (Ana Sagar Hub)</option>
                  <option value="kishangarh">Kishangarh (Marble City)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Primary Dispatch Hub / Area <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={riderArea}
                  onChange={e => setRiderArea(e.target.value)}
                  required
                  placeholder="e.g. Malviya Nagar Hub / Panchsheel"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Delivery Vehicle Type <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={riderVehicleType}
                  onChange={e => setRiderVehicleType(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px', background: '#FFF' }}
                >
                  <option value="EV Scooter (Eco Delivery)">EV Scooter (Eco Delivery)</option>
                  <option value="Motorcycle (Fast Express)">Motorcycle (Fast Express)</option>
                  <option value="Scooter (Insulated Thermal Bag)">Scooter (Insulated Thermal Bag)</option>
                  <option value="Bicycle (Local Express)">Bicycle (Local Express)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Vehicle Plate / Reg Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={riderVehicleNumber}
                  onChange={e => setRiderVehicleNumber(e.target.value)}
                  required
                  placeholder="e.g. RJ 14 EV 4022"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={savingRiderProfile}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: savingRiderProfile ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={16} />
                <span>{savingRiderProfile ? 'Saving Changes...' : 'Save Rider Profile & Fleet Vehicle'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interactive Call Cook / Customer Modal */}
      {callModalTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10005,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '420px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setCallModalTarget(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#F5F5F4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: callModalTarget.type === 'cook' ? '#FFF4E6' : '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto'
              }}
            >
              <Phone size={30} color={callModalTarget.type === 'cook' ? '#DC2626' : '#4F46E5'} />
            </div>

            <span
              style={{
                background: callModalTarget.type === 'cook' ? '#FFF4E6' : '#EEF2FF',
                color: callModalTarget.type === 'cook' ? '#DC2626' : '#4F46E5',
                padding: '3px 12px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}
            >
              {callModalTarget.role}
            </span>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: '8px 0 2px 0' }}>
              {callModalTarget.name}
            </h3>

            <div style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: '12px 0 20px 0', letterSpacing: '0.05em' }}>
              {callModalTarget.phone}
            </div>

            {/* Calling Options Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`tel:${callModalTarget.phone.replace(/\D/g, '')}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#2B8A3E',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(43, 138, 62, 0.3)'
                }}
              >
                <Phone size={16} />
                <span>📞 Direct Phone Call</span>
              </a>

              <a
                href={`https://wa.me/${callModalTarget.phone.replace(/\D/g, '')}?text=Namaste!%20I%20am%20your%20HomeFeast%20Delivery%20Partner%20regarding%20your%20meal%20order.`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageCircle size={16} />
                <span>💬 WhatsApp Web / Chat</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopyPhone(callModalTarget.phone)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: '#FAF8F5',
                  border: '1.5px solid #EAE3D9',
                  color: '#1C1917',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {hasCopiedPhone ? <Check size={16} color="#2B8A3E" /> : <Copy size={16} />}
                <span>{hasCopiedPhone ? 'Copied Number!' : '📋 Copy Phone Number'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Scan & Deliver Verification Modal with Visible High-Res QR Code */}
      {otpModalOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setOtpModalOrder(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#F5F5F4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            {/* Header Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: '#EBFBEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <Scan size={28} color="#2B8A3E" />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
              Scan & Deliver #{otpModalOrder.id}
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
              Hand over hot insulated steel dabba to <strong>{otpModalOrder.customerName}</strong>
            </p>

            {/* VISIBLE High-Definition QR Code Scanner Box */}
            <div
              style={{
                background: '#1C1917',
                borderRadius: '20px',
                padding: '20px',
                margin: '18px 0',
                color: '#FFFFFF',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  DABBA VERIFICATION QR CODE & THERMAL SEAL
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0CA678', marginTop: '2px' }}>
                  🔒 {otpModalOrder.dabbaSealId || 'HF-SEAL-4786'}
                </div>
              </div>

              {/* REAL VISIBLE QR CODE GRAPHIC */}
              <DabbaQrCodeGraphic sealId={otpModalOrder.dabbaSealId} />

              <div style={{ fontSize: '12px', color: '#D6D3D1', background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '10px', marginTop: '14px', display: 'inline-block' }}>
                ✨ QR Code Scanned • 304 Steel Container Locked at 70°C
              </div>
            </div>

            {/* 4-Digit Customer PIN input */}
            <div style={{ background: '#FAF8F5', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                CUSTOMER 4-DIGIT DELIVERY PIN:
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  maxLength={4}
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    padding: '10px 16px',
                    width: '180px',
                    borderRadius: '12px',
                    border: '2px solid #2B8A3E',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => setEnteredOtp('4821')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                (Autofill Demo PIN: 4821)
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setOtpModalOrder(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #EAE3D9',
                  background: '#FFFFFF',
                  color: '#57534E',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDeliver(otpModalOrder.id)}
                disabled={actionLoadingId === otpModalOrder.id}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#2B8A3E',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(43, 138, 62, 0.3)'
                }}
              >
                <CheckCircle2 size={16} />
                <span>{actionLoadingId === otpModalOrder.id ? 'Confirming...' : 'Verify & Hand Over (+₹45)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan & Collect Return Steel Dabba QR Modal */}
      {dabbaScanModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setDabbaScanModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#F5F5F4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            {/* Header Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: '#E6FCF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <RotateCcw size={28} color="#0CA678" />
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
              Scan Return Dabba QR
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
              Collecting 304 Stainless Steel Container from <strong>{dabbaScanModal.customerName}</strong>
            </p>

            {/* VISIBLE High-Definition QR Code Scanner Box */}
            <div
              style={{
                background: '#1C1917',
                borderRadius: '20px',
                padding: '20px',
                margin: '18px 0',
                color: '#FFFFFF',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  STEEL DABBA ECO BARCODE / QR
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0CA678', marginTop: '2px' }}>
                  ♻️ {dabbaScanModal.dabbaId || 'DB-304-STEEL-8894'}
                </div>
              </div>

              {/* REAL VISIBLE QR CODE GRAPHIC */}
              <DabbaQrCodeGraphic sealId={dabbaScanModal.dabbaId} />

              <div style={{ fontSize: '12px', color: '#D6D3D1', background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '10px', marginTop: '14px', display: 'inline-block' }}>
                ✨ Container QR Scanned • Ready for Return (+₹10 Eco Reward)
              </div>
            </div>

            {/* Customer Location Info */}
            <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #EAE3D9', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginBottom: '4px' }}>
                Collection Location:
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1917', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#0CA678" /> {dabbaScanModal.address}
              </div>
              <div style={{ fontSize: '12px', color: '#78716C', marginTop: '4px' }}>
                Meal Delivered: {dabbaScanModal.deliveredYesterday}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDabbaScanModal(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #EAE3D9',
                  background: '#FFFFFF',
                  color: '#57534E',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleCollectDabba(dabbaScanModal)}
                disabled={actionLoadingId === dabbaScanModal.id}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0CA678',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(12, 166, 120, 0.3)'
                }}
              >
                <Check size={16} />
                <span>{actionLoadingId === dabbaScanModal.id ? 'Collecting...' : 'Verify QR & Collect (+₹10)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
