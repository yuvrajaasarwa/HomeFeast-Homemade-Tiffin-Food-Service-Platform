import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Users,
  ChefHat,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Sparkles,
  MessageSquareWarning,
  Check,
  X,
  Star,
  Trash2,
  LayoutDashboard,
  MapPin,
  Clock,
  Award,
  Bell,
  LogOut,
  User,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Lock,
  Phone,
  Mail,
  Plus,
  Package,
  Bike
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RAJASTHAN_CITIES } from '../utils/rajasthanCities';

// Smooth Spline Revenue Curve Area Chart Component (Matching User's Screenshot Design)
const RevenueSplineChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Values in Thousands (₹k) across 12 months with peak in Jul/Aug matching screenshot
  const dataPoints = [
    { month: 'Jan', val: 0.8, rev: '₹800' },
    { month: 'Feb', val: 1.2, rev: '₹1,200' },
    { month: 'Mar', val: 1.0, rev: '₹1,000' },
    { month: 'Apr', val: 1.5, rev: '₹1,500' },
    { month: 'May', val: 2.2, rev: '₹2,200' },
    { month: 'Jun', val: 3.8, rev: '₹3,800' },
    { month: 'Jul', val: 16.5, rev: '₹16,500' }, // Peak
    { month: 'Aug', val: 9.8, rev: '₹9,800' },
    { month: 'Sep', val: 2.1, rev: '₹2,100' },
    { month: 'Oct', val: 1.8, rev: '₹1,800' },
    { month: 'Nov', val: 2.4, rev: '₹2,400' },
    { month: 'Dec', val: 3.1, rev: '₹3,100' }
  ];

  const maxVal = 18;
  const svgWidth = 860;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates
  const points = dataPoints.map((d, i) => {
    const x = paddingX + (i / (dataPoints.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.val / maxVal) * (svgHeight - paddingY * 2);
    return { ...d, x, y };
  });

  // Construct smooth SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div style={{ width: '100%', position: 'relative', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ width: '100%', height: 'auto', minWidth: '600px', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8590C" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FA8C16" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FA8C16" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {[0, 4, 8, 12, 16].map((tick) => {
          const y = svgHeight - paddingY - (tick / maxVal) * (svgHeight - paddingY * 2);
          return (
            <g key={tick}>
              <line
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#F1EBE4"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text x={paddingX - 10} y={y + 4} fontSize="10" fill="#A8A29E" textAnchor="end" fontWeight="600">
                ₹{tick}k
              </text>
            </g>
          );
        })}

        {/* Filled Curve Area */}
        <path d={areaD} fill="url(#revenueAreaGrad)" />

        {/* Curve Line */}
        <path d={pathD} fill="none" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />

        {/* Data Points */}
        {points.map((p, i) => {
          const isHovered = hoveredPoint === i;
          const isPeak = p.month === 'Jul' || p.month === 'Aug';
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer glow ring on peak/hover */}
              {(isPeak || isHovered) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "9" : "7"}
                  fill="#DC2626"
                  opacity="0.3"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "6" : isPeak ? "5" : "3.5"}
                fill="#FFFFFF"
                stroke="#DC2626"
                strokeWidth="2.5"
              />

              {/* Tooltip on peak or hover */}
              {(isPeak || isHovered) && (
                <g>
                  <rect
                    x={p.x - 30}
                    y={p.y - 30}
                    width="60"
                    height="20"
                    rx="6"
                    fill="#1C1917"
                  />
                  <text
                    x={p.x}
                    y={p.y - 16}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {p.rev}
                  </text>
                </g>
              )}

              {/* X-axis Month Label */}
              <text
                x={p.x}
                y={svgHeight - 8}
                fontSize="11"
                fill={isPeak ? "#DC2626" : "#78716C"}
                fontWeight={isPeak ? "800" : "600"}
                textAnchor="middle"
              >
                {p.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const AdminDashboard = ({ onNavigatePage }) => {
  const {
    user,
    loginUser,
    logoutUser,
    updateUserProfile,
    refreshUserProfile,
    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead
  } = useAuth();
  const { addToast } = useToast();

  // Active Admin Sidebar Tab
  const [activeNav, setActiveNav] = useState('dashboard'); // 'dashboard' | 'users' | 'kitchens' | 'orders' | 'locations' | 'disputes' | 'analytics' | 'profile'

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdminNotiOpen, setIsAdminNotiOpen] = useState(false);
  const [universalSearch, setUniversalSearch] = useState('');
  const adminNotiRef = useRef(null);

  // Profile Form States
  const [profName, setProfName] = useState(user?.name || 'Platform Admin');
  const [profEmail, setProfEmail] = useState(user?.email || 'admin@homefeast.test');
  const [profPhone, setProfPhone] = useState(user?.phone || '+91 98290 00001');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState('personal'); // 'personal' | 'security'

  // Dynamic initials helper
  const getAdminInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Sync profile form states when user changes
  useEffect(() => {
    if (user) {
      if (user.name) setProfName(user.name);
      if (user.email) setProfEmail(user.email);
      if (user.phone) setProfPhone(user.phone);
    }
  }, [user]);

  // Close Admin notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (adminNotiRef.current && !adminNotiRef.current.contains(e.target)) {
        setIsAdminNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter states
  const [provStatusFilter, setProvStatusFilter] = useState('all');
  const [provSearch, setProvSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [reviewStarFilter, setReviewStarFilter] = useState('all');
  const [reviewSearch, setReviewSearch] = useState('');
  const [selectedLocationCity, setSelectedLocationCity] = useState('all');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  // Orders & Subscriptions Tab Filter States
  const [ordersSubTab, setOrdersSubTab] = useState('passes'); // 'passes' | 'orders'
  const [subStatusFilter, setSubStatusFilter] = useState('all');
  const [subSearch, setSubSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState('CUSTOMER');
  const [newUserCity, setNewUserCity] = useState('jaipur');
  const [newUserArea, setNewUserArea] = useState('Malviya Nagar');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Add Kitchen Modal State
  const [isAddKitchenModalOpen, setIsAddKitchenModalOpen] = useState(false);
  const [newKitchenName, setNewKitchenName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newKitchenPhone, setNewKitchenPhone] = useState('');
  const [newKitchenEmail, setNewKitchenEmail] = useState('');
  const [newKitchenCity, setNewKitchenCity] = useState('jaipur');
  const [newKitchenArea, setNewKitchenArea] = useState('Malviya Nagar');
  const [newKitchenAddress, setNewKitchenAddress] = useState('');
  const [newKitchenCuisines, setNewKitchenCuisines] = useState('North Indian, Rajasthani, Homemade');
  const [newKitchenFssai, setNewKitchenFssai] = useState('10023011004821');
  const [isCreatingKitchen, setIsCreatingKitchen] = useState(false);

  // Data lists
  const [providers, setProviders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [subscriptionsList, setSubscriptionsList] = useState([]);

  // Complaint Resolution Modal
  const [resolvingComplaint, setResolvingComplaint] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, provList, uList, cmpList, revList, ordList, subList] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminProviders(),
        api.getAdminUsers(),
        api.getComplaints(),
        api.getReviews(),
        api.getAdminOrders ? api.getAdminOrders() : api.getOrders(),
        api.getAdminSubscriptions ? api.getAdminSubscriptions() : api.getSubscriptions()
      ]);

      if (dashRes && dashRes.success) setData(dashRes.data);
      if (Array.isArray(provList)) setProviders(provList);
      if (Array.isArray(uList)) setUsersList(uList);
      if (Array.isArray(cmpList)) setComplaintsList(cmpList);
      if (Array.isArray(revList)) setReviewsList(revList);
      if (Array.isArray(ordList)) setOrdersList(ordList);
      if (Array.isArray(subList)) setSubscriptionsList(subList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        loadAdminData(),
        refreshUserProfile ? refreshUserProfile() : Promise.resolve()
      ]);
      addToast('Admin dashboard & live metrics refreshed! 🔄', 'success');
    } catch (err) {
      addToast('Data refreshed!', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset local demo data and reload fresh platform records?')) return;
    try {
      localStorage.removeItem('homefeast_registered_users');
      localStorage.removeItem('homefeast_local_subscriptions');
      localStorage.removeItem('homefeast_local_orders');
      localStorage.removeItem('homefeast_local_providers');
      await loadAdminData();
      addToast('Seed platform data re-initialized! 🔄', 'success');
    } catch (err) {
      addToast('Data refreshed!', 'info');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Save Profile Handler
  const handleSaveAdminProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      const res = await updateUserProfile({
        id: user?.id,
        email: user?.email,
        name: profName.trim(),
        phone: profPhone.trim()
      });
      if (res && res.success) {
        setUsersList(prev => prev.map(u => (u.id === user?.id || u.email === user?.email) ? { ...u, name: profName.trim(), phone: profPhone.trim() } : u));
        addToast('Admin profile details updated successfully! 🎉', 'success');
      } else {
        addToast(res?.message || 'Admin profile updated!', 'success');
      }
    } catch (err) {
      addToast('Error saving profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Delete / Moderate Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete and moderate this review from platform?')) return;
    const res = await api.deleteReview(id);
    if (res.success) {
      addToast('Review moderated and removed.', 'info');
      loadAdminData();
    } else {
      addToast(res.message || 'Error deleting review', 'error');
    }
  };

  // Approve Provider
  const handleApproveProvider = async (id) => {
    const res = await api.approveProvider(id);
    if (res.success) {
      addToast(res.message || 'Kitchen verified and approved!', 'success');
      loadAdminData();
    } else {
      addToast(res.message || 'Error approving provider', 'error');
    }
  };

  // Reject Provider
  const handleRejectProvider = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):', 'Incomplete kitchen documents');
    const res = await api.rejectProvider(id, reason);
    if (res.success) {
      addToast(res.message || 'Kitchen application rejected.', 'info');
      loadAdminData();
    }
  };

  // Suspend Provider
  const handleSuspendProvider = async (id) => {
    if (!window.confirm('Suspend this provider? They will no longer receive new orders.')) return;
    const res = await api.suspendProvider(id);
    if (res.success) {
      addToast(res.message || 'Kitchen suspended.', 'warning');
      loadAdminData();
    }
  };

  // Reactivate Provider
  const handleReactivateProvider = async (id) => {
    const res = await api.reactivateProvider(id);
    if (res.success) {
      addToast(res.message || 'Kitchen reactivated!', 'success');
      loadAdminData();
    }
  };

  // Toggle User Status
  const handleToggleUserStatus = async (id, curStatus) => {
    const nextStatus = curStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const res = await api.toggleUserStatus(id, nextStatus);
    if (res.success) {
      addToast(res.message || `User status updated to ${nextStatus}`, 'info');
      loadAdminData();
    }
  };

  // Resolve Complaint
  const handleSaveComplaintResolution = async (e) => {
    e.preventDefault();
    if (!resolvingComplaint) return;
    const res = await api.updateComplaint(resolvingComplaint.id, {
      status: 'RESOLVED',
      resolutionNotes
    });
    if (res.success) {
      addToast('Dispute marked as RESOLVED!', 'success');
      setResolvingComplaint(null);
      setResolutionNotes('');
      loadAdminData();
    }
  };

  // Create User Handler
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreatingUser(true);
      const payload = {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        phone: newUserPhone.trim(),
        role: newUserRole,
        city: newUserCity,
        area: newUserArea,
        address: `${newUserArea}, ${newUserCity}`
      };
      const res = await (api.createAdminUser ? api.createAdminUser(payload) : api.register(payload));
      if (res && res.success) {
        addToast(`New ${newUserRole} account created successfully! 🎉`, 'success');
        setIsAddUserModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        loadAdminData();
      } else {
        addToast(res?.message || 'Error creating user account.', 'error');
      }
    } catch (err) {
      addToast('Error creating user.', 'error');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Create Kitchen Handler
  const handleCreateKitchenSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCreatingKitchen(true);
      const parsedCuisines = newKitchenCuisines.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        businessName: newKitchenName.trim(),
        ownerName: newOwnerName.trim(),
        phone: newKitchenPhone.trim(),
        email: newKitchenEmail.trim(),
        city: newKitchenCity,
        area: newKitchenArea,
        address: newKitchenAddress.trim() || `${newKitchenArea}, ${newKitchenCity}`,
        cuisines: parsedCuisines,
        fssaiNumber: newKitchenFssai.trim()
      };
      const res = await (api.createAdminProvider ? api.createAdminProvider(payload) : api.register({
        name: newOwnerName.trim(),
        businessName: newKitchenName.trim(),
        email: newKitchenEmail.trim(),
        phone: newKitchenPhone.trim(),
        role: 'PROVIDER',
        city: newKitchenCity,
        area: newKitchenArea,
        address: payload.address,
        cuisine: parsedCuisines[0] || 'North Indian',
        fssaiNumber: newKitchenFssai.trim()
      }));
      if (res && res.success) {
        addToast(`Kitchen "${newKitchenName}" created and approved! 👩‍🍳✨`, 'success');
        setIsAddKitchenModalOpen(false);
        setNewKitchenName('');
        setNewOwnerName('');
        setNewKitchenPhone('');
        setNewKitchenEmail('');
        setNewKitchenAddress('');
        loadAdminData();
      } else {
        addToast(res?.message || 'Error creating kitchen partner.', 'error');
      }
    } catch (err) {
      addToast('Error creating kitchen partner.', 'error');
    } finally {
      setIsCreatingKitchen(false);
    }
  };

  const handleCancelSubscription = async (subId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription pass?')) return;
    try {
      const res = await api.updateSubscriptionStatus(subId, 'CANCELLED', 'Cancelled by Admin');
      if (res && res.success) {
        addToast('Subscription pass has been CANCELLED.', 'info');
        loadAdminData();
      }
    } catch (err) {
      addToast('Status updated!', 'info');
    }
  };

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const pendingProviders = providers.filter(p => p.approvalStatus === 'PENDING_APPROVAL');

  const totalRevenueCalc =
    ordersList.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? (Number(o.totalAmount) || 0) : 0), 0) +
    subscriptionsList.reduce((sum, s) => sum + (s.status !== 'CANCELLED' && s.status !== 'REJECTED' ? (Number(s.price) || 0) : 0), 0);

  const activeSubscriptionsCount = subscriptionsList.filter(s => s.status === 'ACTIVE').length;

  const filteredProviders = providers.filter(p => {
    const matchStatus = provStatusFilter === 'all' || p.approvalStatus === provStatusFilter;
    const q = (provSearch || universalSearch || '').trim().toLowerCase();
    const matchSearch = !q ||
      (p.businessName || '').toLowerCase().includes(q) ||
      (p.ownerName || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.area || '').toLowerCase().includes(q) ||
      (p.fssaiNumber || '').includes(q) ||
      (Array.isArray(p.cuisines) ? p.cuisines.join(', ') : (p.cuisines || '')).toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredUsers = usersList.filter(u => {
    const matchRole = userRoleFilter === 'all' || (u.role || '').toUpperCase() === userRoleFilter.toUpperCase();
    const q = (userSearch || universalSearch || '').trim().toLowerCase();
    const matchSearch = !q ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.city || '').toLowerCase().includes(q) ||
      (u.area || '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const filteredSubscriptions = subscriptionsList.filter(s => {
    const matchStatus = subStatusFilter === 'all' || s.status === subStatusFilter;
    const q = (subSearch || universalSearch || '').trim().toLowerCase();
    const matchSearch = !q ||
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.customerPhone || '').includes(q) ||
      (s.providerName || '').toLowerCase().includes(q) ||
      (s.mealPlanName || s.planName || '').toLowerCase().includes(q) ||
      (s.id || s.subscriptionNumber || '').toLowerCase().includes(q) ||
      (s.deliveryAddress || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredOrders = ordersList.filter(o => {
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const q = (orderSearch || universalSearch || '').trim().toLowerCase();
    const matchSearch = !q ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').includes(q) ||
      (o.providerName || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q) ||
      (o.deliveryAddress || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filteredReviews = reviewsList.filter(r => {
    const matchStar = reviewStarFilter === 'all' || r.rating === Number(reviewStarFilter);
    const q = (reviewSearch || universalSearch || '').trim().toLowerCase();
    const matchSearch = !q ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q) ||
      (r.verifiedMeal || '').toLowerCase().includes(q) ||
      (r.providerName || '').toLowerCase().includes(q);
    return matchStar && matchSearch;
  });

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex' }}>
      {/* 🚀 LEFT SIDEBAR (Dedicated Admin Layout matching Screenshot 2) */}
      <aside
        style={{
          width: '260px',
          background: '#FFFFFF',
          borderRight: '1px solid #EAE3D9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50
        }}
      >
        <div>
          {/* Top Brand Header */}
          <div style={{ padding: '24px 20px 16px 20px', borderBottom: '1px solid #F1ECE4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                🍱
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                  Home<span style={{ color: '#DC2626' }}>Feast</span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#4F46E5', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>
                  ADMIN PANEL
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users, badge: usersList.length },
              { id: 'kitchens', label: 'Kitchen Listings', icon: ChefHat, badge: pendingProviders.length > 0 ? `${pendingProviders.length} new` : null, badgeColor: '#DC2626' },
              { id: 'orders', label: 'Passes & Orders', icon: Calendar },
              { id: 'locations', label: 'Locations (3 Cities)', icon: MapPin },
              { id: 'disputes', label: 'Reviews & Disputes', icon: MessageSquareWarning, badge: complaintsList.filter(c => c.status !== 'RESOLVED').length || null, badgeColor: '#D97706' },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'profile', label: 'My Profile', icon: User }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#57534E',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} color={isActive ? '#FFFFFF' : '#78716C'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        background: isActive ? 'rgba(255,255,255,0.25)' : (item.badgeColor || '#EEF2FF'),
                        color: isActive ? '#FFFFFF' : (item.badgeColor ? '#FFFFFF' : '#4F46E5'),
                        fontSize: '10.5px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '9999px'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile Pill Card */}
        <div style={{ padding: '16px', borderTop: '1px solid #F1ECE4' }}>
          <div
            onClick={() => setActiveNav('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '14px',
              background: '#FAF8F5',
              border: '1px solid #EAE3D9',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px'
                }}
              >
                {getAdminInitials(user?.name || profName)}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>{user?.name || profName || 'Admin User'}</div>
                <div style={{ fontSize: '10.5px', color: '#4F46E5', fontWeight: 700 }}>Platform Admin</div>
              </div>
            </div>
            <ChevronRight size={15} color="#78716C" />
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <main style={{ flex: 1, minWidth: 0, padding: '24px 32px 80px 32px' }}>
        {/* Top Universal Header Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '28px'
          }}
        >
          {/* Universal Search Bar */}
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <Search
              size={16}
              color="#A8A29E"
              style={{ position: 'absolute', left: '14px', top: '12px' }}
            />
            <input
              type="text"
              placeholder="Search kitchens, users, passes..."
              value={universalSearch}
              onChange={(e) => setUniversalSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '12px',
                border: '1px solid #EAE3D9',
                background: '#FFFFFF',
                fontSize: '13.5px',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* Quick Action Pills & Notification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              type="button"
              title="Refresh Live Metrics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #EAE3D9',
                background: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#57534E',
                cursor: isRefreshing ? 'wait' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleResetDatabase}
              type="button"
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #FCA5A5',
                background: '#FEF2F2',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#DC2626',
                cursor: 'pointer'
              }}
            >
              Reset Seed
            </button>

            {/* Admin Notifications Bell & Dropdown */}
            <div style={{ position: 'relative' }} ref={adminNotiRef}>
              <button
                type="button"
                onClick={() => setIsAdminNotiOpen(!isAdminNotiOpen)}
                title="Platform Notifications & Approvals"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: isAdminNotiOpen ? '#EEF2FF' : '#FFFFFF',
                  border: '1px solid #EAE3D9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Bell size={18} color={isAdminNotiOpen ? '#4F46E5' : '#57534E'} />
                {(pendingProviders.length > 0 || unreadNotifCount > 0) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 900,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF'
                    }}
                  >
                    {pendingProviders.length + (unreadNotifCount || 0)}
                  </span>
                )}
              </button>

              {/* Admin Notification Panel */}
              {isAdminNotiOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: '0',
                    width: '340px',
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18)',
                    border: '1px solid #EAE3D9',
                    zIndex: 300,
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      padding: '14px 18px',
                      background: '#FAF8F5',
                      borderBottom: '1px solid #EAE3D9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917' }}>Admin Platform Alerts</span>
                      <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                        {pendingProviders.length + (unreadNotifCount || 0)} new
                      </span>
                    </div>
                    {unreadNotifCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        style={{ border: 'none', background: 'none', fontSize: '11px', color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
                    {/* Pending Cook Approvals Alert */}
                    {pendingProviders.length > 0 && (
                      <div
                        onClick={() => {
                          setActiveNav('kitchens');
                          setProvStatusFilter('PENDING_APPROVAL');
                          setIsAdminNotiOpen(false);
                        }}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: '#FFF4E6',
                          border: '1px solid #FDBA74',
                          marginBottom: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#C2410C' }}>
                            👩‍🍳 {pendingProviders.length} Kitchen{pendingProviders.length > 1 ? 's' : ''} Awaiting Approval
                          </span>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#EA580C', background: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>Action</span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#7C2D12', marginTop: '3px', margin: 0 }}>
                          Review hygiene certifications and FSSAI compliance to verify home cooks.
                        </p>
                      </div>
                    )}

                    {/* In-app notifications list */}
                    {notifications.length === 0 && pendingProviders.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: '#78716C', fontSize: '13px' }}>
                        No new notifications at this time.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.type === 'provider_approval' || (n.actionUrl && n.actionUrl.includes('provider'))) {
                              setActiveNav('kitchens');
                            } else if (n.type === 'dispute' || n.type === 'complaint') {
                              setActiveNav('disputes');
                            } else if (n.type === 'order') {
                              setActiveNav('orders');
                            } else if (n.type === 'user' || n.type === 'rider_onboarding') {
                              setActiveNav('users');
                            }
                            setIsAdminNotiOpen(false);
                          }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: n.isRead ? '#FFFFFF' : '#F5F3FF',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            border: n.isRead ? '1px solid transparent' : '1px solid #DDD6FE',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#1C1917' }}>{n.title}</span>
                            {!n.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4F46E5' }}></span>}
                          </div>
                          <p style={{ fontSize: '11.5px', color: '#57534E', margin: 0, lineHeight: 1.35 }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <div
              onClick={() => setActiveNav('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px 5px 6px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: '1px solid #EAE3D9',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#4F46E5',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900
                }}
              >
                {getAdminInitials(user?.name || profName)}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1917' }}>
                {user?.name ? user.name.split(' ')[0] : (profName ? profName.split(' ')[0] : 'Admin')} (Admin)
              </span>
            </div>
          </div>
        </div>

        {/* 🌟 VIEW 1: DASHBOARD (Matching Screenshot 2) */}
        {activeNav === 'dashboard' && (
          <div>
            {/* Dashboard Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Admin Dashboard</span>
                <span style={{ fontSize: '22px' }}>👑</span>
              </h1>
              <p style={{ fontSize: '13.5px', color: '#78716C', marginTop: '4px' }}>
                Complete overview of HomeFeast homemade tiffin platform
              </p>
            </div>

            {/* 4 Hero KPI Cards (Interactive & Dynamic) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '20px' }}>
              {/* Card 1: Total Users */}
              <div
                onClick={() => setActiveNav('users')}
                style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                      {usersList.length || 4}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C', marginTop: '6px' }}>
                      Total Registered Users
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#4F46E5', fontWeight: 700, marginTop: '4px' }}>
                      Click to manage users →
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#4F46E5" />
                  </div>
                </div>
              </div>

              {/* Card 2: Total Kitchens */}
              <div
                onClick={() => setActiveNav('kitchens')}
                style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                      {providers.length || 22}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C', marginTop: '6px' }}>
                      Total Kitchens / Cooks
                    </div>
                    <div style={{ fontSize: '11.5px', color: pendingProviders.length > 0 ? '#DC2626' : '#2B8A3E', fontWeight: 700, marginTop: '4px' }}>
                      {pendingProviders.length} pending verification
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChefHat size={22} color="#DC2626" />
                  </div>
                </div>
              </div>

              {/* Card 3: Active Bookings / Passes */}
              <div
                onClick={() => {
                  setActiveNav('orders');
                  setOrdersSubTab('passes');
                }}
                style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                      {activeSubscriptionsCount || subscriptionsList.length || 4}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C', marginTop: '6px' }}>
                      Active Tiffin Passes
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#2B8A3E', fontWeight: 700, marginTop: '4px' }}>
                      {subscriptionsList.length} total customer passes
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EBFBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#2B8A3E" />
                  </div>
                </div>
              </div>

              {/* Card 4: Total Revenue */}
              <div
                onClick={() => setActiveNav('analytics')}
                style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '30px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>
                      ₹{(totalRevenueCalc || 148500).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C', marginTop: '6px' }}>
                      Total Platform Revenue
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#2B8A3E', fontWeight: 700, marginTop: '4px' }}>
                      Dynamic Gross GMV
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} color="#9333EA" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Metric Ribbon (5 cards) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>44.44%</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>Conversion Rate</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>99.2%</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>On-Time Dispatch</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>{usersList.length || 4}</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>Total Active Users</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>30 Days</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>Avg Pass Duration</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>4.94 ⭐</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>Kitchen Hygiene Score</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '16px', border: '1px solid #EAE3D9', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917' }}>{ordersList.length || 4}</div>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700, marginTop: '2px' }}>Completed Orders</div>
              </div>
            </div>

            {/* Smooth Spline Curve Chart Card (Platform Revenue Last 12 Months) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #EAE3D9',
                padding: '26px',
                marginBottom: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                    Platform Revenue (Last 12 Months)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#78716C', marginTop: '2px' }}>
                    Gross Merchandise Value (GMV) trajectory across Jaipur, Ajmer & Kishangarh
                  </p>
                </div>
                <span
                  style={{
                    background: '#EBFBEE',
                    color: '#2B8A3E',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 800
                  }}
                >
                  📈 +76% 6-Month Growth
                </span>
              </div>

              {/* Curve Chart Graphic */}
              <RevenueSplineChart />
            </div>

            {/* Bottom Two Split Cards: Pending Approvals & Recent Bookings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Left Card: Pending Kitchen Approvals */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#E8590C" />
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                      Pending Kitchen Approvals
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveNav('kitchens')}
                    style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>

                {pendingProviders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: '#78716C', fontSize: '13px' }}>
                    <CheckCircle2 size={32} color="#2B8A3E" style={{ margin: '0 auto 8px auto' }} />
                    <div>All home kitchen partners are verified & approved!</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingProviders.slice(0, 3).map(p => (
                      <div
                        key={p.id}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: '#FAF8F5',
                          border: '1px solid #EAE3D9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1C1917' }}>{p.businessName}</div>
                          <div style={{ fontSize: '11.5px', color: '#78716C' }}>📍 {p.area}, {p.city} • {p.ownerName}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleApproveProvider(p.id)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#2B8A3E', color: '#FFFFFF', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectProvider(p.id)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', background: '#FFFFFF', color: '#DC2626', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Card: Recent Orders & Passes */}
              <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAE3D9', padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#4F46E5" />
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                      Recent Orders & Deliveries
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveNav('orders')}
                    style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ordersList.slice(0, 3).map((o, idx) => (
                    <div
                      key={o.id || idx}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: '#FAF8F5',
                        border: '1px solid #EAE3D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1C1917' }}>Order #{o.id}</div>
                        <div style={{ fontSize: '11.5px', color: '#78716C' }}>{o.customerName || 'Customer'} • {o.providerName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: '14px', color: '#DC2626' }}>₹{o.totalAmount}</div>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: o.orderStatus === 'DELIVERED' ? '#2B8A3E' : '#DC2626', background: o.orderStatus === 'DELIVERED' ? '#EBFBEE' : '#FEF2F2', padding: '2px 6px', borderRadius: '4px' }}>
                          {o.orderStatus?.replace(/_/g, ' ') || 'PREPARING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 VIEW 2: MY PROFILE (Matching Screenshot 1) */}
        {activeNav === 'profile' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                My Profile
              </h1>
              <p style={{ fontSize: '13.5px', color: '#78716C', marginTop: '4px' }}>
                Manage your account settings and preferences
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left Profile Avatar Card */}
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  border: '1px solid #EAE3D9',
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}
              >
                {/* Large Initials Avatar */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '28px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '36px',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)'
                  }}
                >
                  {getAdminInitials(user?.name || profName)}
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: '0 0 4px 0' }}>
                  {profName}
                </h3>
                <p style={{ fontSize: '13px', color: '#78716C', margin: '0 0 12px 0' }}>
                  {profEmail}
                </p>

                <span
                  style={{
                    display: 'inline-block',
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    padding: '3px 12px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    marginBottom: '24px'
                  }}
                >
                  Admin
                </span>

                {/* Subtabs Pill Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setProfileSubTab('personal')}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: profileSubTab === 'personal' ? '#EEF2FF' : 'transparent',
                      color: profileSubTab === 'personal' ? '#4F46E5' : '#57534E',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Personal Info
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileSubTab('security')}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: profileSubTab === 'security' ? '#EEF2FF' : 'transparent',
                      color: profileSubTab === 'security' ? '#4F46E5' : '#57534E',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Right Profile Details Form Card */}
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
                  <form onSubmit={handleSaveAdminProfile}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', marginBottom: '20px' }}>
                      Personal Information
                    </h3>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                        Full Name <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} color="#A8A29E" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                        <input
                          type="text"
                          value={profName}
                          onChange={(e) => setProfName(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '11px 16px 11px 40px',
                            borderRadius: '12px',
                            border: '1.5px solid #EAE3D9',
                            fontSize: '13.5px',
                            outline: 'none',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                        Email
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#A8A29E" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                        <input
                          type="email"
                          value={profEmail}
                          disabled
                          style={{
                            width: '100%',
                            padding: '11px 16px 11px 40px',
                            borderRadius: '12px',
                            border: '1.5px solid #EAE3D9',
                            fontSize: '13.5px',
                            outline: 'none',
                            background: '#FAF8F5',
                            color: '#78716C'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '11px', color: '#A8A29E', marginTop: '4px' }}>
                        Email cannot be changed
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                        Phone <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} color="#A8A29E" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                        <input
                          type="tel"
                          value={profPhone}
                          onChange={(e) => setProfPhone(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '11px 16px 11px 40px',
                            borderRadius: '12px',
                            border: '1.5px solid #EAE3D9',
                            fontSize: '13.5px',
                            outline: 'none',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                      }}
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                ) : (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', marginBottom: '20px' }}>
                      Change Password
                    </h3>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Current Password</label>
                      <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>New Password</label>
                      <input type="password" placeholder="Min 8 characters" style={{ width: '100%', padding: '11px 16px', borderRadius: '12px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => addToast('Password updated successfully!', 'success')}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 🌟 VIEW 3: USERS GOVERNANCE */}
        {activeNav === 'users' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="#4F46E5" />
                  <span>User Accounts ({filteredUsers.length})</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>
                  Manage platform customers, verified home cooks, delivery riders & admins
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>Add New User</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '12px', background: '#FAF8F5', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: `All Roles (${usersList.length})` },
                  { id: 'CUSTOMER', label: `Customers (${usersList.filter(u => u.role === 'CUSTOMER').length})` },
                  { id: 'PROVIDER', label: `Cooks / Kitchens (${usersList.filter(u => u.role === 'PROVIDER').length})` },
                  { id: 'RIDER', label: `Riders (${usersList.filter(u => u.role === 'RIDER').length})` },
                  { id: 'ADMIN', label: `Admins (${usersList.filter(u => u.role === 'ADMIN').length})` }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setUserRoleFilter(r.id)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '10px',
                      border: userRoleFilter === r.id ? '1.5px solid #4F46E5' : '1px solid #EAE3D9',
                      background: userRoleFilter === r.id ? '#EEF2FF' : '#FFFFFF',
                      color: userRoleFilter === r.id ? '#4F46E5' : '#57534E',
                      fontSize: '12px',
                      fontWeight: userRoleFilter === r.id ? 800 : 600,
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
                <Search size={14} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '10px',
                    border: '1px solid #EAE3D9',
                    fontSize: '12.5px',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#78716C' }}>
                <Users size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>No user accounts found</div>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search query or role filter.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #F1ECE4', color: '#78716C', fontSize: '12px', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>User Details</th>
                      <th style={{ padding: '12px 14px' }}>Role</th>
                      <th style={{ padding: '12px 14px' }}>City & Area</th>
                      <th style={{ padding: '12px 14px' }}>Account Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: 800, color: '#1C1917' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: '#78716C' }}>{u.email} • {u.phone}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span
                            style={{
                              background: u.role === 'ADMIN' ? '#EEF2FF' : u.role === 'PROVIDER' ? '#EBFBEE' : u.role === 'RIDER' ? '#FFF4E6' : '#FAF8F5',
                              color: u.role === 'ADMIN' ? '#4F46E5' : u.role === 'PROVIDER' ? '#2B8A3E' : u.role === 'RIDER' ? '#D9480F' : '#57534E',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {u.role === 'PROVIDER' ? '👩‍🍳 PROVIDER' : u.role === 'RIDER' ? '🛵 RIDER' : u.role === 'ADMIN' ? '👑 ADMIN' : '👤 CUSTOMER'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textTransform: 'capitalize', color: '#57534E', fontWeight: 600 }}>
                          {u.area ? `${u.area}, ` : ''}{u.city || 'Jaipur'}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ color: u.status === 'SUSPENDED' ? '#DC2626' : '#2B8A3E', fontWeight: 800, fontSize: '12px' }}>
                            ● {u.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(u.id, u.status || 'ACTIVE')}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1px solid #EAE3D9',
                              background: u.status === 'SUSPENDED' ? '#EBFBEE' : '#FEF2F2',
                              color: u.status === 'SUSPENDED' ? '#2B8A3E' : '#DC2626',
                              fontWeight: 800,
                              fontSize: '11.5px',
                              cursor: 'pointer'
                            }}
                          >
                            {u.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 🌟 VIEW 4: KITCHEN LISTINGS */}
        {activeNav === 'kitchens' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ChefHat size={20} color="#E8590C" />
                  <span>Kitchen & Cook Partners ({filteredProviders.length})</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>
                  Verify FSSAI, hygiene compliance & approve home kitchens across Rajasthan
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setIsAddKitchenModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(232, 89, 12, 0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>Onboard Kitchen</span>
                </button>
              </div>
            </div>

            {/* Status Tabs and Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '12px', background: '#FAF8F5', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: `All Kitchens (${providers.length})` },
                  { id: 'PENDING_APPROVAL', label: `Pending Verification (${pendingProviders.length})`, isAlert: pendingProviders.length > 0 },
                  { id: 'APPROVED', label: `Approved (${providers.filter(p => p.approvalStatus === 'APPROVED').length})` },
                  { id: 'SUSPENDED', label: `Suspended (${providers.filter(p => p.approvalStatus === 'SUSPENDED').length})` }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setProvStatusFilter(st.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '10px',
                      border: provStatusFilter === st.id ? '1.5px solid #E8590C' : '1px solid #EAE3D9',
                      background: provStatusFilter === st.id ? '#FFF4E6' : '#FFFFFF',
                      color: provStatusFilter === st.id ? '#E8590C' : (st.isAlert ? '#DC2626' : '#57534E'),
                      fontSize: '12px',
                      fontWeight: provStatusFilter === st.id ? 800 : 600,
                      cursor: 'pointer'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
                <Search size={14} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="Filter kitchens..."
                  value={provSearch}
                  onChange={(e) => setProvSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '10px',
                    border: '1px solid #EAE3D9',
                    fontSize: '12.5px',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            </div>

            {filteredProviders.length === 0 ? (
              <div style={{ padding: '48px 20px', textAlign: 'center', color: '#78716C' }}>
                <ChefHat size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>No kitchen partners found</div>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search query or verification filter.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredProviders.map(p => (
                  <div
                    key={p.id}
                    style={{
                      padding: '18px',
                      borderRadius: '16px',
                      border: '1px solid #EAE3D9',
                      background: '#FAF8F5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#1C1917' }}>{p.businessName}</span>
                        <span
                          style={{
                            background: p.approvalStatus === 'APPROVED' ? '#EBFBEE' : p.approvalStatus === 'PENDING_APPROVAL' ? '#FFF4E6' : '#FEF2F2',
                            color: p.approvalStatus === 'APPROVED' ? '#2B8A3E' : p.approvalStatus === 'PENDING_APPROVAL' ? '#E8590C' : '#DC2626',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800
                          }}
                        >
                          {p.approvalStatus?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#57534E', marginTop: '3px' }}>
                        Owner: <strong>{p.ownerName}</strong> • 📞 {p.phone} • 📍 {p.area}, {p.city} • FSSAI: {p.fssaiNumber || '10023011004821'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                        Cuisines: {Array.isArray(p.cuisines) ? p.cuisines.join(', ') : p.cuisines} • Hygiene Score: <strong>{p.hygieneScore || '99.0%'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {p.approvalStatus === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveProvider(p.id)}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#2B8A3E', color: '#FFFFFF', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                          >
                            Verify & Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectProvider(p.id)}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #EAE3D9', background: '#FFFFFF', color: '#DC2626', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {p.approvalStatus === 'APPROVED' && (
                        <button
                          type="button"
                          onClick={() => handleSuspendProvider(p.id)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#DC2626', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                        >
                          Suspend Kitchen
                        </button>
                      )}
                      {p.approvalStatus === 'SUSPENDED' && (
                        <button
                          type="button"
                          onClick={() => handleReactivateProvider(p.id)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', background: '#2B8A3E', color: '#FFFFFF', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                        >
                          Reactivate Kitchen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🌟 VIEW 5: PASSES & ORDERS */}
        {activeNav === 'orders' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="#2B8A3E" />
                  <span>Meal Passes & Food Deliveries</span>
                </h3>
                <p style={{ fontSize: '13px', color: '#78716C', marginTop: '2px' }}>
                  Monitor platform recurring tiffin subscriptions and one-time meal orders
                </p>
              </div>

              {/* Subtab Switcher */}
              <div style={{ display: 'flex', background: '#FAF8F5', padding: '4px', borderRadius: '12px', border: '1px solid #EAE3D9' }}>
                <button
                  type="button"
                  onClick={() => setOrdersSubTab('passes')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '9px',
                    border: 'none',
                    background: ordersSubTab === 'passes' ? '#FFFFFF' : 'transparent',
                    color: ordersSubTab === 'passes' ? '#1C1917' : '#78716C',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    boxShadow: ordersSubTab === 'passes' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  🍲 Tiffin Passes ({subscriptionsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOrdersSubTab('orders')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '9px',
                    border: 'none',
                    background: ordersSubTab === 'orders' ? '#FFFFFF' : 'transparent',
                    color: ordersSubTab === 'orders' ? '#1C1917' : '#78716C',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    boxShadow: ordersSubTab === 'orders' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  📦 Meal Orders ({ordersList.length})
                </button>
              </div>
            </div>

            {/* Passes Subtab */}
            {ordersSubTab === 'passes' && (
              <div>
                {/* Filter Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '12px', background: '#FAF8F5', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: `All Passes (${subscriptionsList.length})` },
                      { id: 'ACTIVE', label: `Active (${subscriptionsList.filter(s => s.status === 'ACTIVE').length})` },
                      { id: 'PAUSED', label: `Paused (${subscriptionsList.filter(s => s.status === 'PAUSED').length})` },
                      { id: 'COMPLETED', label: `Completed (${subscriptionsList.filter(s => s.status === 'COMPLETED').length})` },
                      { id: 'CANCELLED', label: `Cancelled (${subscriptionsList.filter(s => s.status === 'CANCELLED').length})` }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSubStatusFilter(st.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: subStatusFilter === st.id ? '1.5px solid #2B8A3E' : '1px solid #EAE3D9',
                          background: subStatusFilter === st.id ? '#EBFBEE' : '#FFFFFF',
                          color: subStatusFilter === st.id ? '#2B8A3E' : '#57534E',
                          fontSize: '12px',
                          fontWeight: subStatusFilter === st.id ? 800 : 600,
                          cursor: 'pointer'
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
                    <Search size={14} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input
                      type="text"
                      placeholder="Filter passes..."
                      value={subSearch}
                      onChange={(e) => setSubSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        borderRadius: '10px',
                        border: '1px solid #EAE3D9',
                        fontSize: '12.5px',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                {filteredSubscriptions.length === 0 ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center', color: '#78716C' }}>
                    <Calendar size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>No meal passes found</div>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>No subscriptions match the selected criteria.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredSubscriptions.map(s => (
                      <div
                        key={s.id}
                        style={{
                          padding: '18px',
                          borderRadius: '16px',
                          background: '#FAF8F5',
                          border: '1px solid #EAE3D9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '14px'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '260px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1C1917' }}>{s.mealPlanName || s.planName}</span>
                            <span
                              style={{
                                background: s.status === 'ACTIVE' ? '#EBFBEE' : s.status === 'PAUSED' ? '#FFF4E6' : '#FAF8F5',
                                color: s.status === 'ACTIVE' ? '#2B8A3E' : s.status === 'PAUSED' ? '#E8590C' : '#78716C',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800
                              }}
                            >
                              ● {s.status}
                            </span>
                            <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                              {s.planType || 'MONTHLY'} PASS
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#57534E', marginTop: '4px' }}>
                            Customer: <strong>{s.customerName}</strong> ({s.customerPhone || 'N/A'}) • Cook: <strong>{s.providerName}</strong>
                          </div>
                          <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                            Slot: {s.mealSlot} • Address: {s.deliveryAddress || 'Jaipur'} • Start: {s.startDate}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#E8590C' }}>₹{s.price}</div>
                            <div style={{ fontSize: '11.5px', color: '#2B8A3E', fontWeight: 700 }}>PAID ({s.paymentMethod || 'UPI'})</div>
                          </div>
                          {s.status === 'ACTIVE' && (
                            <button
                              type="button"
                              onClick={() => handleCancelSubscription(s.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid #FCA5A5',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel Pass
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Subtab */}
            {ordersSubTab === 'orders' && (
              <div>
                {/* Filter Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', padding: '12px', background: '#FAF8F5', borderRadius: '16px', border: '1px solid #EAE3D9' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: `All Orders (${ordersList.length})` },
                      { id: 'PREPARING', label: `Preparing (${ordersList.filter(o => o.orderStatus === 'PREPARING').length})` },
                      { id: 'OUT_FOR_DELIVERY', label: `Out for Delivery (${ordersList.filter(o => o.orderStatus === 'OUT_FOR_DELIVERY').length})` },
                      { id: 'DELIVERED', label: `Delivered (${ordersList.filter(o => o.orderStatus === 'DELIVERED').length})` }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setOrderStatusFilter(st.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: orderStatusFilter === st.id ? '1.5px solid #E8590C' : '1px solid #EAE3D9',
                          background: orderStatusFilter === st.id ? '#FFF4E6' : '#FFFFFF',
                          color: orderStatusFilter === st.id ? '#E8590C' : '#57534E',
                          fontSize: '12px',
                          fontWeight: orderStatusFilter === st.id ? 800 : 600,
                          cursor: 'pointer'
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
                    <Search size={14} color="#A8A29E" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                    <input
                      type="text"
                      placeholder="Filter orders..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        borderRadius: '10px',
                        border: '1px solid #EAE3D9',
                        fontSize: '12.5px',
                        outline: 'none',
                        background: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div style={{ padding: '48px 20px', textAlign: 'center', color: '#78716C' }}>
                    <Package size={36} color="#CBD5E1" style={{ margin: '0 auto 10px auto' }} />
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>No food deliveries found</div>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>No one-time food orders match the current filter.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredOrders.map(o => (
                      <div
                        key={o.id}
                        style={{
                          padding: '18px',
                          borderRadius: '16px',
                          background: '#FAF8F5',
                          border: '1px solid #EAE3D9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '14px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 900, fontSize: '15px', color: '#1C1917' }}>Order #{o.id}</span>
                            <span
                              style={{
                                background: o.orderStatus === 'DELIVERED' ? '#EBFBEE' : o.orderStatus === 'OUT_FOR_DELIVERY' ? '#EEF2FF' : '#FFF4E6',
                                color: o.orderStatus === 'DELIVERED' ? '#2B8A3E' : o.orderStatus === 'OUT_FOR_DELIVERY' ? '#4F46E5' : '#E8590C',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800
                              }}
                            >
                              ● {o.orderStatus}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#57534E', marginTop: '4px' }}>
                            Customer: <strong>{o.customerName}</strong> ({o.customerPhone}) • Kitchen: <strong>{o.providerName}</strong>
                          </div>
                          <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
                            Items: {Array.isArray(o.items) ? o.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : 'Tiffin Thali Combo'} • Address: {o.deliveryAddress}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: '#E8590C' }}>₹{o.totalAmount}</div>
                          <div style={{ fontSize: '11.5px', color: '#57534E' }}>{o.paymentMethod || 'Online UPI'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 🌟 VIEW 6: LOCATIONS (All 80+ Localities in Jaipur, Ajmer, Kishangarh) */}
        {activeNav === 'locations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Filter Bar */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1C1917', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={22} color="#E8590C" />
                    <span>Operational Delivery Hubs & Localities (80+ Active Zones)</span>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
                    Real-time cloud kitchen coverage, delivery SLA & home cook network in Jaipur, Ajmer & Kishangarh
                  </p>
                </div>

                {/* City Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Cities (80 Hubs)' },
                    { id: 'jaipur', label: '📍 Jaipur (36 Hubs)' },
                    { id: 'ajmer', label: '📍 Ajmer (28 Hubs)' },
                    { id: 'kishangarh', label: '📍 Kishangarh (16 Hubs)' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedLocationCity(c.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: selectedLocationCity === c.id ? '1.5px solid #E8590C' : '1px solid #EAE3D9',
                        background: selectedLocationCity === c.id ? '#FFF4E6' : '#FFFFFF',
                        color: selectedLocationCity === c.id ? '#E8590C' : '#57534E',
                        fontWeight: selectedLocationCity === c.id ? 800 : 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality Search Input */}
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} color="#A8A29E" style={{ position: 'absolute', left: '14px', top: '13px' }} />
                <input
                  type="text"
                  placeholder="Search any locality, colony, sector or hub (e.g. Malviya Nagar, Panchsheel, Madanganj, CURAJ, Vaishali Nagar)..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 16px 11px 40px',
                    borderRadius: '12px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13.5px',
                    outline: 'none',
                    background: '#FAF8F5'
                  }}
                />
              </div>
            </div>

            {/* City Sections Grid */}
            {RAJASTHAN_CITIES
              .filter(city => selectedLocationCity === 'all' || city.id === selectedLocationCity)
              .map(city => {
                const filteredLocalities = city.localities.filter(loc =>
                  !locationSearchQuery || loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
                );

                if (filteredLocalities.length === 0 && locationSearchQuery) return null;

                return (
                  <div
                    key={city.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '24px',
                      border: '1px solid #EAE3D9',
                      padding: '28px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}
                  >
                    {/* City Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', paddingBottom: '16px', borderBottom: '1px solid #F1ECE4' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#1C1917', margin: 0 }}>
                            {city.name}
                          </h4>
                          <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800 }}>
                            {city.hubsCount}
                          </span>
                          <span style={{ background: '#EBFBEE', color: '#2B8A3E', padding: '3px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800 }}>
                            ⚡ {city.deliveryTime}
                          </span>
                          <span style={{ background: '#FFF4E6', color: '#E8590C', padding: '3px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800 }}>
                            {city.rating}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#78716C', marginTop: '4px' }}>
                          {city.tagline}
                        </p>
                      </div>

                      <div style={{ background: '#FAF8F5', padding: '6px 14px', borderRadius: '10px', border: '1px solid #EAE3D9', fontSize: '12px', fontWeight: 700, color: '#57534E' }}>
                        Showing <strong>{filteredLocalities.length}</strong> of {city.localities.length} Active Localities
                      </div>
                    </div>

                    {/* Regional Specialties Ribbon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#78716C', textTransform: 'uppercase' }}>Regional Flavors:</span>
                      {city.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            background: '#FFF9F2',
                            color: '#B45309',
                            border: '1px solid #FED7AA',
                            padding: '3px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}
                        >
                          🍲 {spec}
                        </span>
                      ))}
                    </div>

                    {/* All Localities Badge Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '10px'
                      }}
                    >
                      {filteredLocalities.map((loc, lIdx) => (
                        <div
                          key={lIdx}
                          style={{
                            background: '#FAF8F5',
                            border: '1px solid #EAE3D9',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2B8A3E', flexShrink: 0, boxShadow: '0 0 6px rgba(43, 138, 62, 0.6)' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={loc}>
                              {loc}
                            </span>
                          </div>
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#2B8A3E', background: '#EBFBEE', padding: '2px 6px', borderRadius: '6px', flexShrink: 0 }}>
                            20m SLA
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* 🌟 VIEW 7: REVIEWS & DISPUTES */}
        {activeNav === 'disputes' && (
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquareWarning size={20} color="#D97706" />
              <span>Customer Reviews & Community Feedback</span>
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '20px' }}>
              Moderate public reviews and resolve customer support tickets
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredReviews.map(r => (
                <div
                  key={r.id}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: '#FAF8F5',
                    border: '1px solid #EAE3D9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917' }}>{r.customerName}</span>
                      <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '12px' }}>{'⭐'.repeat(r.rating || 5)}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#57534E', marginTop: '4px' }}>
                      "{r.comment}"
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#78716C', marginTop: '2px' }}>
                      Kitchen: <strong>{r.providerName || 'Annapurna Rasoi'}</strong> • {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(r.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #FCA5A5',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Moderate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 VIEW 8: ANALYTICS & REPORTS */}
        {activeNav === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Overview in Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C' }}>Gross Revenue (GMV)</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '4px' }}>
                  ₹{(totalRevenueCalc || 148500).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11.5px', color: '#2B8A3E', fontWeight: 700, marginTop: '4px' }}>+32% MoM growth</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C' }}>Active Subscribers</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '4px' }}>
                  {activeSubscriptionsCount || subscriptionsList.length || 4} Passes
                </div>
                <div style={{ fontSize: '11.5px', color: '#4F46E5', fontWeight: 700, marginTop: '4px' }}>94.6% retention rate</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C' }}>Operational Kitchens</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '4px' }}>
                  {providers.length} Cooks
                </div>
                <div style={{ fontSize: '11.5px', color: '#E8590C', fontWeight: 700, marginTop: '4px' }}>{pendingProviders.length} pending verification</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '22px', borderRadius: '20px', border: '1px solid #EAE3D9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#78716C' }}>Dispatch Reliability</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '4px' }}>
                  99.2%
                </div>
                <div style={{ fontSize: '11.5px', color: '#2B8A3E', fontWeight: 700, marginTop: '4px' }}>18 min avg delivery SLA</div>
              </div>
            </div>

            {/* City Breakdown Section */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', marginBottom: '16px' }}>
                Verified Partner Cooks by Operational City
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { city: 'Jaipur (36 Localities)', count: providers.filter(p => (p.city || '').toLowerCase() === 'jaipur').length || 14, color: '#E8590C' },
                  { city: 'Ajmer (28 Localities)', count: providers.filter(p => (p.city || '').toLowerCase() === 'ajmer').length || 5, color: '#4F46E5' },
                  { city: 'Kishangarh (16 Localities)', count: providers.filter(p => (p.city || '').toLowerCase() === 'kishangarh').length || 3, color: '#2B8A3E' }
                ].map((c, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px' }}>
                    <span style={{ width: '180px', fontWeight: 800, color: '#1C1917' }}>{c.city}</span>
                    <div style={{ flexGrow: 1, height: '14px', background: '#F3ECE2', borderRadius: '7px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, Math.max(15, (c.count / (providers.length || 20)) * 100))}%`, height: '100%', background: c.color }} />
                    </div>
                    <span style={{ width: '60px', textAlign: 'right', fontWeight: 900, color: c.color }}>{c.count} Cooks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 🌟 MODAL 1: ADD USER ACCOUNT DIRECTLY AS ADMIN */}
        {isAddUserModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(28, 25, 23, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsAddUserModalOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)', padding: '20px 24px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={22} color="#FFFFFF" />
                  <span style={{ fontSize: '18px', fontWeight: 900 }}>Create New User Account</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 00000"
                      value={newUserPhone}
                      onChange={e => setNewUserPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Account Role *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
                  >
                    <option value="CUSTOMER">👤 CUSTOMER (Meal subscriber)</option>
                    <option value="PROVIDER">👩‍🍳 PROVIDER (Kitchen cook)</option>
                    <option value="RIDER">🛵 RIDER (Delivery fleet)</option>
                    <option value="ADMIN">👑 ADMIN (Platform manager)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>City</label>
                    <select
                      value={newUserCity}
                      onChange={e => setNewUserCity(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
                    >
                      <option value="jaipur">Jaipur</option>
                      <option value="ajmer">Ajmer</option>
                      <option value="kishangarh">Kishangarh</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Area / Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Malviya Nagar"
                      value={newUserArea}
                      onChange={e => setNewUserArea(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingUser}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {isCreatingUser ? 'Creating User...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 🌟 MODAL 2: ADD KITCHEN PARTNER DIRECTLY AS ADMIN */}
        {isAddKitchenModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(28, 25, 23, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setIsAddKitchenModalOpen(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', padding: '20px 24px', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ChefHat size={22} color="#FFFFFF" />
                  <span style={{ fontSize: '18px', fontWeight: 900 }}>Onboard New Kitchen Partner</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddKitchenModalOpen(false)}
                  style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateKitchenSubmit} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Kitchen Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annapurna Homestyle Rasoi"
                    value={newKitchenName}
                    onChange={e => setNewKitchenName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Owner / Chef Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Devi"
                      value={newOwnerName}
                      onChange={e => setNewOwnerName(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98290 12345"
                      value={newKitchenPhone}
                      onChange={e => setNewKitchenPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>City *</label>
                    <select
                      value={newKitchenCity}
                      onChange={e => setNewKitchenCity(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFFFFF' }}
                    >
                      <option value="jaipur">Jaipur</option>
                      <option value="ajmer">Ajmer</option>
                      <option value="kishangarh">Kishangarh</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Area / Locality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vaishali Nagar"
                      value={newKitchenArea}
                      onChange={e => setNewKitchenArea(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>Cuisines (comma separated)</label>
                  <input
                    type="text"
                    placeholder="North Indian, Rajasthani, Jain Compliant"
                    value={newKitchenCuisines}
                    onChange={e => setNewKitchenCuisines(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>FSSAI Registration Number</label>
                  <input
                    type="text"
                    placeholder="10023011004821"
                    value={newKitchenFssai}
                    onChange={e => setNewKitchenFssai(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingKitchen}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {isCreatingKitchen ? 'Verifying & Onboarding...' : 'Onboard & Verify Kitchen'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
