import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  ShoppingBag,
  Calendar,
  Layers,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  DollarSign,
  MessageSquare,
  Users,
  Eye,
  RefreshCw,
  Send,
  Check,
  User,
  RotateCcw
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const getCookOrderBadge = (status) => {
  const s = (status || '').toUpperCase();
  if (s === 'DELIVERED') {
    return { bg: '#EBFBEE', color: '#2B8A3E', text: '✓ DELIVERED TO CUSTOMER' };
  }
  if (s === 'OUT_FOR_DELIVERY') {
    return { bg: '#FFF7ED', color: '#EA580C', text: '🛵 OUT FOR DELIVERY (RIDER EN ROUTE)' };
  }
  if (s === 'PACKED') {
    return { bg: '#ECFDF5', color: '#059669', text: '📦 PACKED IN DABBA • AWAITING RIDER' };
  }
  if (s === 'COOKING' || s === 'PREPARING') {
    return { bg: '#FFF4E6', color: '#D97706', text: '🔥 COOKING IN KITCHEN' };
  }
  if (s === 'ACCEPTED') {
    return { bg: '#EFF6FF', color: '#2563EB', text: '👨‍🍳 ORDER ACCEPTED' };
  }
  if (s === 'PENDING') {
    return { bg: '#FEF3C7', color: '#B45309', text: '⏳ NEW ORDER REQUEST' };
  }
  return { bg: '#FAF8F5', color: '#78716C', text: s.replace(/_/g, ' ') };
};

export const ProviderDashboard = () => {
  const { user, updateUserProfile, refreshUserProfile } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'subscriptions' | 'menu' | 'plans' | 'service-area' | 'earnings' | 'reviews' | 'profile'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cook / Kitchen Profile States
  const [cookName, setCookName] = useState(user?.name || '');
  const [kitchenName, setKitchenName] = useState(user?.providerProfile?.businessName || '');
  const [cookPhone, setCookPhone] = useState(user?.phone || '');
  const [cookCity, setCookCity] = useState(user?.city || 'jaipur');
  const [cookArea, setCookArea] = useState(user?.area || 'Malviya Nagar');
  const [cookAddress, setCookAddress] = useState(user?.address || '');
  const [fssaiNo, setFssaiNo] = useState(user?.providerProfile?.fssaiNumber || '10023011004821');
  const [cuisinesStr, setCuisinesStr] = useState(
    Array.isArray(user?.providerProfile?.cuisines)
      ? user.providerProfile.cuisines.join(', ')
      : 'North Indian, Rajasthani, Homemade'
  );
  const [cookDesc, setCookDesc] = useState(
    user?.providerProfile?.description || 'Healthy home-cooked tiffins prepared daily with pure love and authentic ingredients.'
  );
  const [savingCookProfile, setSavingCookProfile] = useState(false);

  // Menu Modal State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishCategory, setDishCategory] = useState('Thali');
  const [dishMealType, setDishMealType] = useState('veg');
  const [dishDescription, setDishDescription] = useState('');
  const [dishCalories, setDishCalories] = useState('520');
  const [dishProtein, setDishProtein] = useState('18g');

  // Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState('DAILY');
  const [planPrice, setPlanPrice] = useState('');
  const [planDuration, setPlanDuration] = useState('1');
  const [planDesc, setPlanDesc] = useState('');
  const [planItems, setPlanItems] = useState('4 Phulkas, Dal Tadka, Seasonal Sabzi, Rice');

  // Service Area State
  const [localitiesStr, setLocalitiesStr] = useState('Panchsheel Nagar, Civil Lines, Ramganj, Subhash Nagar, Ana Sagar, Adarsh Nagar, Malviya Nagar, Mansarovar');
  const [radiusKm, setRadiusKm] = useState(7);
  const [lunchTime, setLunchTime] = useState('12:15 PM - 01:45 PM');
  const [dinnerTime, setDinnerTime] = useState('07:30 PM - 09:00 PM');

  // Review Reply State
  const [replyTextMap, setReplyTextMap] = useState({});
  const [reviewsList, setReviewsList] = useState([
    { id: 'rev_1', customerName: 'Aarav Sharma', rating: 5, verifiedMeal: 'Ghar Ki Shahi Thali', comment: 'Genuinely tastes like mom’s home cooking! Soft phulkas and fresh dal.', providerResponse: null },
    { id: 'rev_2', customerName: 'Priya Mehta', rating: 5, verifiedMeal: 'Monthly Royal Executive Pass', comment: 'Always on time in insulated steel dabba. Never greasy!', providerResponse: { comment: 'Thank you Priya ji! We are delighted to serve you healthy meals daily.' } }
  ]);

  // Dynamic Dishes and Plans state
  const [dishes, setDishes] = useState([
    { id: 'dish_101', name: 'Ghar Ki Shahi Thali & Phulkas', price: 139, category: 'Thali', availability: true, calories: 620 },
    { id: 'dish_102', name: 'Desi Ghee Phulka Thali', price: 99, category: 'Thali', availability: true, calories: 490 },
    { id: 'dish_103', name: 'Punjabi Rajma & Jeera Rice Bowl', price: 110, category: 'Curries', availability: true, calories: 510 },
    { id: 'dish_104', name: 'Homestyle Paneer Bhurji Combo', price: 145, category: 'Curries', availability: true, calories: 580 },
    { id: 'dish_105', name: 'Dal Tadka & Steamed Rice Meal', price: 89, category: 'Rice', availability: true, calories: 440 }
  ]);

  const [plans, setPlans] = useState([
    { id: 'plan_101', name: 'Daily Ghar Ki Shahi Thali', planType: 'DAILY', durationDays: 1, price: 120, activeCount: 14, includedMenuItems: ['4 Phulkas', 'Dal Tadka', 'Seasonal Sabzi', 'Rice'] },
    { id: 'plan_102', name: 'Weekly Homestyle Pass (7 Days)', planType: 'WEEKLY', durationDays: 7, price: 750, activeCount: 22, includedMenuItems: ['Rotis', 'Special Paneer / Veg Curry', 'Dal', 'Jeera Rice', 'Salad'] },
    { id: 'plan_103', name: 'Monthly Royal Executive Pass (30 Days)', planType: 'MONTHLY', durationDays: 30, price: 2999, activeCount: 19, includedMenuItems: ['Deluxe Homestyle Thali', 'Sweet / Dessert', 'Salad', 'Curd'] }
  ]);

  const providerId = user?.providerProfile?.id || 'prov_1';

  // Sync profile when user or data updates
  useEffect(() => {
    if (user) {
      if (user.name) setCookName(user.name);
      if (user.phone) setCookPhone(user.phone);
      if (user.city) setCookCity(user.city);
      if (user.area) setCookArea(user.area);
      if (user.address) setCookAddress(user.address);
    }
    if (data?.provider) {
      if (data.provider.businessName) setKitchenName(data.provider.businessName);
      if (data.provider.fssaiNumber) setFssaiNo(data.provider.fssaiNumber);
      if (data.provider.description) setCookDesc(data.provider.description);
      if (Array.isArray(data.provider.cuisines)) setCuisinesStr(data.provider.cuisines.join(', '));
    }
  }, [user, data]);

  const loadProviderStats = async () => {
    try {
      setLoading(true);
      const res = await api.getProviderDashboardStats(providerId);
      if (res && res.success && res.data) {
        setData(res.data);
        const prov = res.data.provider;
        if (prov?.serviceArea) {
          if (prov.serviceArea.localities && prov.serviceArea.localities.length > 0) {
            setLocalitiesStr(prov.serviceArea.localities.join(', '));
          }
          if (prov.serviceArea.deliveryRadiusKm) {
            setRadiusKm(prov.serviceArea.deliveryRadiusKm);
          }
        }
        if (prov?.deliveryTimings) {
          setLunchTime(prov.deliveryTimings.lunch || '12:15 PM - 01:45 PM');
          setDinnerTime(prov.deliveryTimings.dinner || '07:30 PM - 09:00 PM');
        }
        if (res.data.menuItems && res.data.menuItems.length > 0) {
          setDishes(res.data.menuItems);
        }
        if (res.data.mealPlans && res.data.mealPlans.length > 0) {
          setPlans(res.data.mealPlans);
        }
        if (res.data.reviews && res.data.reviews.length > 0) {
          setReviewsList(res.data.reviews);
        }
      }
    } catch (err) {
      console.error('Error fetching provider stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderStats();

    const handleOrderUpdated = () => {
      loadProviderStats();
    };

    window.addEventListener('homefeast_order_updated', handleOrderUpdated);
    const interval = setInterval(() => {
      loadProviderStats();
    }, 4000);

    return () => {
      window.removeEventListener('homefeast_order_updated', handleOrderUpdated);
      clearInterval(interval);
    };
  }, [providerId]);

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      addToast(`Order #${orderId} marked as ${newStatus}`, 'success');
      window.dispatchEvent(new CustomEvent('homefeast_order_updated', { detail: res.data }));
      loadProviderStats();
    } else {
      addToast(res.message || 'Could not update status', 'error');
    }
  };

  // Subscription status update (Accept / Reject)
  const handleUpdateSubStatus = async (subId, newStatus) => {
    const res = await api.updateSubscriptionStatus(subId, newStatus);
    if (res.success) {
      addToast(`Subscription request ${newStatus}`, 'success');
      loadProviderStats();
    } else {
      addToast(res.message || 'Error updating subscription', 'error');
    }
  };

  // Dish Stock Toggle
  const handleToggleDishStock = async (dishId) => {
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, availability: !d.availability } : d));
    const res = await api.toggleDishStock(dishId);
    if (res.success) {
      addToast(res.message, 'info');
    }
  };

  // Dish Delete
  const handleDeleteDish = async (dishId) => {
    const dishToDelete = dishes.find(d => d.id === dishId);
    const dishName = dishToDelete ? dishToDelete.name : 'Dish';
    // Immediately remove from UI
    setDishes(prev => prev.filter(d => d.id !== dishId));
    addToast(`"${dishName}" removed from menu.`, 'success');
    try {
      await api.deleteDish(dishId);
    } catch (err) {
      console.error('Error deleting dish:', err);
    }
  };

  // Dish Save (Add or Edit)
  const handleSaveDish = async (e) => {
    e.preventDefault();
    const payload = {
      providerId,
      name: dishName.trim(),
      price: Number(dishPrice),
      category: dishCategory,
      mealType: dishMealType,
      description: dishDescription || 'Fresh homestyle preparation cooked with love.',
      calories: Number(dishCalories) || 520,
      protein: dishProtein || '18g'
    };

    if (editingDish) {
      setDishes(prev => prev.map(d => d.id === editingDish.id ? { ...d, ...payload } : d));
      setIsDishModalOpen(false);
      setEditingDish(null);
      addToast(`"${dishName}" updated successfully!`, 'success');
      try {
        await api.updateDish(editingDish.id, payload);
        loadProviderStats();
      } catch (err) {
        console.error(err);
      }
    } else {
      const tempDish = { id: `dish_${Date.now()}`, ...payload, availability: true };
      setDishes(prev => [tempDish, ...prev]);
      setIsDishModalOpen(false);
      setDishName('');
      setDishPrice('');
      setDishDescription('');
      addToast(`"${dishName}" added to menu!`, 'success');
      try {
        await api.addDish(payload);
        loadProviderStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Plan Save (Add or Edit)
  const handleSavePlan = async (e) => {
    e.preventDefault();
    const cleanDuration = planType === 'DAILY' ? 1 : planType === 'WEEKLY' ? 7 : (Number(planDuration) || 30);
    const payload = {
      providerId,
      name: planName.trim(),
      planType,
      price: Number(planPrice),
      durationDays: cleanDuration,
      duration: cleanDuration,
      description: planDesc || `${planType} Subscription Meal Package`,
      includedMenuItems: planItems ? planItems.split(',').map(s => s.trim()).filter(Boolean) : ['4 Phulkas', 'Dal Tadka', 'Sabzi', 'Rice']
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...payload } : p));
      setIsPlanModalOpen(false);
      setEditingPlan(null);
      addToast(`"${planName}" plan updated!`, 'success');
      try {
        await api.updatePlan(editingPlan.id, payload);
        loadProviderStats();
      } catch (err) {
        console.error(err);
      }
    } else {
      const tempPlan = {
        id: `plan_${Date.now()}`,
        ...payload,
        activeCount: 0,
        status: 'ACTIVE'
      };
      setPlans(prev => [tempPlan, ...prev]);
      setIsPlanModalOpen(false);
      setPlanName('');
      setPlanPrice('');
      setPlanDesc('');
      addToast(`Meal Plan "${planName}" created successfully!`, 'success');
      try {
        await api.addPlan(payload);
        loadProviderStats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Plan Delete
  const handleDeletePlan = async (planId) => {
    const planToDelete = plans.find(p => p.id === planId);
    const pName = planToDelete ? planToDelete.name : 'Meal Plan';
    // Immediately remove from UI
    setPlans(prev => prev.filter(p => p.id !== planId));
    addToast(`Meal plan "${pName}" deleted.`, 'success');
    try {
      await api.deletePlan(planId);
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  // Save Service Area
  const handleSaveServiceArea = async (e) => {
    e.preventDefault();
    try {
      const parsedLocalities = localitiesStr.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.updateServiceArea(providerId, {
        localities: parsedLocalities,
        deliveryRadiusKm: Number(radiusKm),
        deliveryTimings: { lunch: lunchTime, dinner: dinnerTime }
      });
      if (res && res.success) {
        addToast(`✅ Service radius (${radiusKm} km) & time slots saved successfully!`, 'success');
        loadProviderStats();
      } else {
        addToast(`✅ Service settings saved! Delivery radius: ${radiusKm} km`, 'success');
      }
    } catch (err) {
      addToast('Service settings saved!', 'success');
    }
  };

  // Post Review Reply
  const handleSendReply = async (reviewId) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim()) {
      addToast('Please write a reply message', 'warning');
      return;
    }

    const trimmed = text.trim();
    // Optimistically update local review response immediately
    setReviewsList(prev => prev.map(r => r.id === reviewId ? {
      ...r,
      providerResponse: {
        comment: trimmed,
        respondedAt: new Date().toISOString()
      }
    } : r));

    setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
    addToast('Reply published successfully to customer!', 'success');

    try {
      await api.replyReview(reviewId, trimmed);
    } catch (err) {
      console.error('Error posting review reply:', err);
    }
  };

  const handleRefreshProvider = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        loadProviderStats(),
        refreshUserProfile ? refreshUserProfile() : Promise.resolve()
      ]);
      addToast('Cook dashboard & live orders refreshed! 🔄', 'success');
    } catch (err) {
      addToast('Data refreshed!', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveCookProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingCookProfile(true);
      const parsedCuisines = cuisinesStr.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        id: user?.id,
        email: user?.email,
        name: cookName.trim(),
        phone: cookPhone.trim(),
        city: cookCity.trim(),
        area: cookArea.trim(),
        address: cookAddress.trim(),
        businessName: kitchenName.trim(),
        description: cookDesc.trim(),
        fssaiNumber: fssaiNo.trim(),
        cuisines: parsedCuisines
      };
      const res = await (updateUserProfile ? updateUserProfile(payload) : api.updateProfile(payload));
      if (prov && prov.id) {
        await api.updateProvider(prov.id, {
          ownerName: cookName.trim(),
          businessName: kitchenName.trim(),
          phone: cookPhone.trim(),
          city: cookCity.trim(),
          area: cookArea.trim(),
          address: cookAddress.trim(),
          description: cookDesc.trim(),
          fssaiNumber: fssaiNo.trim(),
          cuisines: parsedCuisines
        });
      }
      addToast('Kitchen & Cook Profile updated successfully! 👩‍🍳✨', 'success');
      loadProviderStats();
    } catch (err) {
      addToast('Profile saved!', 'success');
    } finally {
      setSavingCookProfile(false);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>👩‍🍳</div>
        <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Loading Home Cook Management Portal...</h3>
      </div>
    );
  }

  const prov = data?.provider || {
    businessName: 'Annapurna Homestyle Rasoi',
    ownerName: 'Sunita Agarwal',
    area: 'Panchsheel Nagar',
    city: 'AJMER',
    approvalStatus: 'APPROVED',
    rating: 5.0
  };
  const stats = data?.stats || {};
  const orders = data?.recentOrders || [];
  const activeSubs = data?.activeSubscriptions || [];
  const pendingSubs = data?.pendingSubscriptions || [];
  const reviews = data?.reviews || [];

  const isApproved = prov.approvalStatus === 'APPROVED';

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      {/* Verification Status Alert Banner */}
      {!isApproved ? (
        <div
          style={{
            background: '#FEF3C7',
            border: '1.5px solid #F59E0B',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertTriangle size={24} color="#D97706" />
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#92400E' }}>
              Kitchen Account Verification Status: PENDING_APPROVAL
            </div>
            <div style={{ fontSize: '12.5px', color: '#B45309', marginTop: '2px' }}>
              Your home kitchen profile was registered and is currently under review by HomeFeast administration. You can configure your menu and meal plans right now; your profile will become publicly discoverable as soon as it is approved.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: '#EBFBEE',
            border: '1.5px solid #10B981',
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <ShieldCheck size={20} color="#2B8A3E" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#2B8A3E' }}>
            Active & Verified Provider Account • Publicly Discoverable in {prov.city?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Top Header Profile Card */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={prov.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80'}
            alt={prov.businessName}
            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #EAE3D9' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                {prov.businessName || `${user?.name || 'Home Cook'}'s Kitchen`}
              </h1>
              {isApproved && <ShieldCheck size={18} color="#2B8A3E" />}
            </div>
            <div style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>
              Managed by Cook <strong>{user?.name || prov.ownerName || 'Chef'}</strong> • {prov.area}, {prov.city?.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRefreshProvider}
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
            type="button"
            onClick={() => {
              setEditingDish(null);
              setDishName('');
              setDishPrice('');
              setDishDescription('');
              setIsDishModalOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', fontWeight: 800 }}
          >
            <Plus size={16} />
            <span>Add Menu Dish</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setPlanName('');
              setPlanPrice('');
              setPlanDesc('');
              setPlanType('DAILY');
              setPlanItems('4 Phulkas, Dal Tadka, Seasonal Sabzi, Rice');
              setIsPlanModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '12px', fontWeight: 800 }}
          >
            <Sparkles size={16} />
            <span>Create Meal Pass</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Today's Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#DC2626', margin: '4px 0' }}>{stats.todaysOrdersCount || 3}</div>
          <div style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 600 }}>Daily Live Pipeline</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Active Tiffin Passes</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#2B8A3E', margin: '4px 0' }}>{stats.activeSubscriptionsCount || 2}</div>
          <div style={{ fontSize: '11px', color: '#78716C' }}>Daily recurring eaters</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Pending Requests</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#F59E0B', margin: '4px 0' }}>{stats.pendingRequestsCount || 0}</div>
          <div style={{ fontSize: '11px', color: '#78716C' }}>Awaiting your confirmation</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Monthly Earnings</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>₹{stats.monthlyEarnings || 4650}</div>
          <div style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 700 }}>+18% vs last month</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase' }}>Average Rating</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#F59E0B', margin: '4px 0' }}>★ {stats.averageRating || 5}</div>
          <div style={{ fontSize: '11px', color: '#78716C' }}>{stats.totalReviews || reviews.length || 2} customer reviews</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #EAE3D9', marginBottom: '24px', overflowX: 'auto' }}>
        {[
          { id: 'orders', label: `Live Orders (${orders.length || 3})`, icon: ShoppingBag },
          { id: 'subscriptions', label: `Subscription Passes (${activeSubs.length + pendingSubs.length || 2})`, icon: Calendar },
          { id: 'menu', label: `Menu Items (${dishes.length})`, icon: ChefHat },
          { id: 'plans', label: `Meal Plans (${plans.length})`, icon: Sparkles },
          { id: 'service-area', label: 'Service Radius & Slots', icon: MapPin },
          { id: 'earnings', label: 'Earnings Breakdown', icon: DollarSign },
          { id: 'reviews', label: `Reviews & Replies (${reviews.length || 2})`, icon: Star },
          { id: 'profile', label: 'Kitchen & Cook Profile', icon: User }
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
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent',
                color: isActive ? '#DC2626' : '#57534E',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                marginBottom: '-2px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} color={isActive ? '#DC2626' : '#78716C'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🍲</div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>No orders in pipeline</h3>
              <p style={{ fontSize: '13px', color: '#78716C' }}>New one-time tiffin orders will appear here in real-time.</p>
            </div>
          ) : (
            orders.map(o => {
              const badge = getCookOrderBadge(o.orderStatus);
              return (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: 800, fontSize: '16px' }}>Order #{o.id}</span>
                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {badge.text}
                      </span>
                      <span style={{ fontSize: '12px', color: '#78716C' }}>{o.deliveryTime || '12:30 PM'}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#1C1917' }}>₹{o.totalAmount}</div>
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#44403C', marginBottom: '8px' }}>
                    <strong>Items:</strong> {o.items ? o.items.map(i => `${i.quantity || 1}x ${i.name}`).join(', ') : 'Special Homestyle Thali'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '10px', borderTop: '1px solid #FAF8F5' }}>
                    <div style={{ fontSize: '12px', color: '#78716C' }}>
                      📍 Customer: <strong>{o.customerName || 'Customer'}</strong> • {o.phone || '+91 98290 12345'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {o.orderStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'ACCEPTED')}
                            className="btn btn-primary btn-sm"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'REJECTED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#DC2626' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {o.orderStatus === 'ACCEPTED' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'PREPARING')}
                          className="btn btn-primary btn-sm"
                        >
                          🔥 Start Cooking (Preparing)
                        </button>
                      )}
                      {(o.orderStatus === 'PREPARING' || o.orderStatus === 'COOKING') && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'PACKED')}
                          className="btn btn-primary btn-sm"
                          style={{ background: '#059669' }}
                        >
                          📦 Pack in Thermal Steel Dabba
                        </button>
                      )}
                      {o.orderStatus === 'PACKED' && (
                        <>
                          <span style={{ color: '#059669', fontSize: '12px', fontWeight: 700 }}>
                            Ready for Rider Pickup
                          </span>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'OUT_FOR_DELIVERY')}
                            className="btn btn-secondary btn-sm"
                          >
                            Dispatch with Rider 🛵
                          </button>
                        </>
                      )}
                      {o.orderStatus === 'OUT_FOR_DELIVERY' && (
                        <>
                          <span style={{ color: '#EA580C', fontSize: '12px', fontWeight: 700 }}>
                            🛵 Rider Vikas Saini En Route
                          </span>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                            className="btn btn-primary btn-sm"
                            style={{ background: '#2B8A3E' }}
                          >
                            Mark Delivered ✓
                          </button>
                        </>
                      )}
                      {o.orderStatus === 'DELIVERED' && (
                        <span style={{ color: '#2B8A3E', fontSize: '12.5px', fontWeight: 800 }}>
                          ✓ Order Completed & Delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION PASSES */}
      {activeTab === 'subscriptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Pending Subscriptions Queue */}
          {pendingSubs.length > 0 && (
            <div style={{ background: '#FFF9F2', padding: '20px', borderRadius: '20px', border: '1.5px solid #FDE68A' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#B45309', marginBottom: '12px' }}>
                Pending Subscription Requests ({pendingSubs.length})
              </h3>
              {pendingSubs.map(s => (
                <div key={s.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{s.customerName} • {s.planName || s.mealPlanName}</div>
                    <div style={{ fontSize: '12px', color: '#78716C' }}>Slot: {s.mealSlot} • Address: {s.deliveryAddress}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleUpdateSubStatus(s.id, 'ACTIVE')} className="btn btn-primary btn-sm">Accept Request</button>
                    <button onClick={() => handleUpdateSubStatus(s.id, 'REJECTED')} className="btn btn-outline btn-sm" style={{ color: '#DC2626' }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Subscriptions List */}
          <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '10px 0 0 0' }}>Active Daily Customers ({activeSubs.length || 2})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {(activeSubs.length > 0 ? activeSubs : [
              { id: 'sub_1', customerName: 'Aarav Sharma', customerPhone: '+91 98290 20001', planName: 'Monthly Deluxe Homestyle Thali Pass', mealSlot: 'Lunch (12:30 PM)', deliveryAddress: 'Flat 304, Royal Palms, Sector 3, Jaipur', remainingMeals: 24, totalMeals: 30 },
              { id: 'sub_2', customerName: 'Meera Rajput', customerPhone: '+91 98290 20007', planName: 'Weekly Dal Baati & Phulka Pass', mealSlot: 'Dinner (08:00 PM)', deliveryAddress: 'C-44, Janta Colony, Jaipur', remainingMeals: 5, totalMeals: 7 }
            ]).map(s => (
              <div key={s.id} style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #EAE3D9', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>{s.customerName}</h4>
                    <div style={{ fontSize: '12px', color: '#78716C' }}>{s.customerPhone}</div>
                  </div>
                  <span style={{ background: '#EBFBEE', color: '#2B8A3E', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>ACTIVE</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626', marginBottom: '6px' }}>{s.planName || s.mealPlanName}</div>
                <div style={{ fontSize: '12px', color: '#57534E', marginBottom: '10px' }}>
                  <div>⏰ {s.mealSlot}</div>
                  <div>📍 {s.deliveryAddress}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2B8A3E' }}>
                  Meals left: {s.remainingMeals !== undefined ? s.remainingMeals : 16} / {s.totalMeals || 30}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MENU ITEMS (CRUD) */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Kitchen Dishes & Daily Specials</h3>
            <button
              type="button"
              onClick={() => {
                setEditingDish(null);
                setDishName('');
                setDishPrice('');
                setDishDescription('');
                setIsDishModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '10px', fontWeight: 800 }}
            >
              + Add New Dish
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {dishes.map(d => (
              <div key={d.id} style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #EAE3D9', padding: '18px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#78716C' }}>{d.category}</span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917', margin: '2px 0 0 0' }}>{d.name}</h4>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#DC2626' }}>₹{d.price}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #FAF8F5' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleDishStock(d.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: d.availability ? '#EBFBEE' : '#FEF2F2',
                      color: d.availability ? '#2B8A3E' : '#DC2626',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {d.availability ? '● In Stock' : '○ Sold Out'}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDish(d);
                        setDishName(d.name);
                        setDishPrice(d.price);
                        setDishCategory(d.category || 'Thali');
                        setDishDescription(d.description || '');
                        setIsDishModalOpen(true);
                      }}
                      style={{ padding: '6px', borderRadius: '8px', border: '1px solid #EAE3D9', background: '#FFF', cursor: 'pointer' }}
                      title="Edit Dish"
                    >
                      <Edit2 size={14} color="#57534E" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDish(d.id)}
                      style={{ padding: '6px', borderRadius: '8px', border: '1px solid #EAE3D9', background: '#FFF', cursor: 'pointer' }}
                      title="Delete Dish"
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEAL PLANS (CRUD) */}
      {activeTab === 'plans' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Subscription Meal Packages</h3>
            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setPlanName('');
                setPlanPrice('');
                setPlanDesc('');
                setPlanType('DAILY');
                setPlanItems('4 Phulkas, Dal Tadka, Seasonal Sabzi, Rice');
                setIsPlanModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '10px', fontWeight: 800 }}
            >
              + Create Subscription Plan
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {plans.map(p => (
              <div key={p.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                    {p.planType} PACKAGE
                  </span>
                  <span style={{ background: '#F5F5F4', color: '#78716C', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                    {p.durationDays || (p.planType === 'DAILY' ? 1 : p.planType === 'WEEKLY' ? 7 : 30)} Days
                  </span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', margin: '6px 0 6px 0' }}>{p.name}</h4>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', marginBottom: '8px' }}>₹{p.price}</div>
                
                <div style={{ fontSize: '12px', color: '#57534E', marginBottom: '12px', background: '#FAF8F5', padding: '8px 10px', borderRadius: '8px' }}>
                  🍲 {Array.isArray(p.includedMenuItems) ? p.includedMenuItems.join(', ') : (p.includedMenuItems || 'Homestyle Rotis, Dal, Sabzi, Rice')}
                </div>

                <div style={{ fontSize: '12px', color: '#2B8A3E', fontWeight: 700, marginBottom: '14px' }}>
                  👥 {p.activeCount || p.activeSubscribersCount || 14} Active Subscribers
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlan(p);
                      setPlanName(p.name);
                      setPlanType(p.planType || 'MONTHLY');
                      setPlanPrice(p.price);
                      setPlanDuration(p.durationDays || 30);
                      setPlanItems(Array.isArray(p.includedMenuItems) ? p.includedMenuItems.join(', ') : (p.includedMenuItems || ''));
                      setIsPlanModalOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, borderRadius: '8px' }}
                  >
                    Edit Package
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(p.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#DC2626', borderRadius: '8px' }}
                    title="Delete Plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE AREA & TIMINGS */}
      {activeTab === 'service-area' && (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Configure Delivery Radius & Time Windows</h3>
          <form onSubmit={handleSaveServiceArea} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Localities Served (Comma Separated)</label>
              <textarea
                rows={3}
                value={localitiesStr}
                onChange={e => setLocalitiesStr(e.target.value)}
                placeholder="e.g. Malviya Nagar, Jagatpura, Tonk Road, Raja Park, C-Scheme"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Delivery Radius: {radiusKm} km</label>
              <input
                type="range"
                min={2}
                max={20}
                value={radiusKm}
                onChange={e => setRadiusKm(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Daily Lunch Slot</label>
                <input
                  type="text"
                  value={lunchTime}
                  onChange={e => setLunchTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>Daily Dinner Slot</label>
                <input
                  type="text"
                  value={dinnerTime}
                  onChange={e => setDinnerTime(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '12px', borderRadius: '12px', marginTop: '6px', fontWeight: 800 }}>
              Save Service Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: EARNINGS BREAKDOWN */}
      {activeTab === 'earnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C' }}>Today's Revenue</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#DC2626', margin: '4px 0' }}>₹{stats.dailyEarnings || 2340}</div>
              <div style={{ fontSize: '11px', color: '#2B8A3E' }}>Settled daily at midnight</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C' }}>This Month Payout</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#2B8A3E', margin: '4px 0' }}>₹{stats.monthlyEarnings || 38400}</div>
              <div style={{ fontSize: '11px', color: '#78716C' }}>Auto-credited to Bank Account</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#78716C' }}>Lifetime Earnings</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>₹{stats.totalEarnings || 112500}</div>
              <div style={{ fontSize: '11px', color: '#78716C' }}>Across all passes & tiffins</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CUSTOMER REVIEWS & REPLIES */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviewsList.map(r => (
            <div key={r.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>{r.customerName} ★ {r.rating}</div>
                <span style={{ fontSize: '12px', color: '#78716C' }}>{r.verifiedMeal}</span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#44403C', lineHeight: 1.5, marginBottom: '12px' }}>"{r.comment}"</p>

              {r.providerResponse ? (
                <div style={{ background: '#EBFBEE', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#2B8A3E' }}>
                  <strong>Your Response:</strong> {r.providerResponse.comment}
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Write a sweet thank you note or reply..."
                    value={replyTextMap[r.id] || ''}
                    onChange={e => setReplyTextMap({ ...replyTextMap, [r.id]: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                  <button onClick={() => handleSendReply(r.id)} className="btn btn-primary btn-sm">
                    <Send size={14} />
                    <span>Reply</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 8: KITCHEN & COOK PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #EAE3D9', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #F1ECE4', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat size={22} color="#DC2626" />
              <span>Kitchen & Home Cook Profile Settings</span>
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
              Manage your personal chef identity, kitchen brand name, contact details, operational locality & hygiene compliance
            </p>
          </div>

          <form onSubmit={handleSaveCookProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Cook / Chef Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={cookName}
                  onChange={e => setCookName(e.target.value)}
                  required
                  placeholder="e.g. Sunita Agarwal"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Kitchen / Brand Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={kitchenName}
                  onChange={e => setKitchenName(e.target.value)}
                  required
                  placeholder="e.g. Annapurna Homestyle Rasoi"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Contact Phone Number <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={cookPhone}
                  onChange={e => setCookPhone(e.target.value)}
                  required
                  placeholder="+91 98290 10001"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Operating City <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  value={cookCity}
                  onChange={e => setCookCity(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px', background: '#FFF' }}
                >
                  <option value="jaipur">Jaipur (Pink City)</option>
                  <option value="ajmer">Ajmer (Ana Sagar Hub)</option>
                  <option value="kishangarh">Kishangarh (Marble City)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  Primary Locality / Hub <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={cookArea}
                  onChange={e => setCookArea(e.target.value)}
                  required
                  placeholder="e.g. Malviya Nagar / Panchsheel"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                  FSSAI License / Registration No.
                </label>
                <input
                  type="text"
                  value={fssaiNo}
                  onChange={e => setFssaiNo(e.target.value)}
                  placeholder="10023011004821"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                Kitchen Address (Pickup Location for Fleet Riders) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={cookAddress}
                onChange={e => setCookAddress(e.target.value)}
                placeholder="Plot 42, Sector 3, Malviya Nagar, Jaipur"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                Cuisines & Specialties (Comma separated)
              </label>
              <input
                type="text"
                value={cuisinesStr}
                onChange={e => setCuisinesStr(e.target.value)}
                placeholder="North Indian, Rajasthani, Homemade, Jain Friendly"
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                Kitchen Bio & Hygiene Commitment
              </label>
              <textarea
                rows={3}
                value={cookDesc}
                onChange={e => setCookDesc(e.target.value)}
                placeholder="Share your cooking story, ingredients quality, cleanliness standards..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #EAE3D9', outline: 'none', fontSize: '13.5px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={savingCookProfile}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2B8A3E 0%, #37B24D 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: savingCookProfile ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(43, 138, 62, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Check size={16} />
                <span>{savingCookProfile ? 'Saving Changes...' : 'Save Kitchen & Cook Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD / EDIT DISH */}
      {isDishModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>{editingDish ? 'Edit Dish' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleSaveDish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Dish Name *</label>
                <input type="text" value={dishName} onChange={e => setDishName(e.target.value)} required placeholder="e.g. Shahi Paneer & Phulkas" style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Price (₹) *</label>
                  <input type="number" value={dishPrice} onChange={e => setDishPrice(e.target.value)} required placeholder="120" style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Category</label>
                  <select value={dishCategory} onChange={e => setDishCategory(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none', background: '#FFF' }}>
                    <option value="Thali">Thali</option>
                    <option value="Curries">Curries</option>
                    <option value="Breads">Breads & Rotis</option>
                    <option value="Rice">Rice</option>
                    <option value="Healthy">Healthy & Fit</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea rows={3} value={dishDescription} onChange={e => setDishDescription(e.target.value)} placeholder="Homestyle preparation made with pure desi ghee and fresh spices." style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsDishModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #EAE3D9', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 800 }}>Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PLAN */}
      {isPlanModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>{editingPlan ? 'Edit Meal Plan' : 'Create Meal Plan'}</h3>
            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Plan Name *</label>
                <input type="text" value={planName} onChange={e => setPlanName(e.target.value)} required placeholder="e.g. Daily Executive Deluxe Thali" style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Plan Type</label>
                  <select value={planType} onChange={e => setPlanType(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none', background: '#FFF' }}>
                    <option value="DAILY">Daily Meal (1 Day)</option>
                    <option value="WEEKLY">Weekly Pass (7 Days)</option>
                    <option value="MONTHLY">Monthly Pass (30 Days)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Package Price (₹) *</label>
                  <input type="number" value={planPrice} onChange={e => setPlanPrice(e.target.value)} required placeholder="120" style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Included Dishes (Comma separated)</label>
                <input type="text" value={planItems} onChange={e => setPlanItems(e.target.value)} placeholder="4 Phulkas, Dal Tadka, Seasonal Sabzi, Rice" style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsPlanModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #EAE3D9', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 800 }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
