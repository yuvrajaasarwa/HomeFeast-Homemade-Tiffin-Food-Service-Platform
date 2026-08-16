import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/dashboard - High-level metrics & chart data
router.get('/dashboard', optionalAuth, (req, res) => {
  const store = db.get();
  const users = store.users || [];
  const providers = store.providers || [];
  const orders = store.orders || [];
  const subscriptions = store.subscriptions || [];
  const complaints = store.complaints || [];

  const pendingApprovals = providers.filter(p => p.approvalStatus === 'PENDING_APPROVAL').length;
  const approvedProviders = providers.filter(p => p.approvalStatus === 'APPROVED').length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE').length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0) +
    subscriptions.reduce((sum, s) => sum + (s.status !== 'CANCELLED' && s.status !== 'REJECTED' ? s.price : 0), 0);

  const stats = {
    totalUsers: users.length,
    totalProviders: providers.length,
    pendingApprovals,
    approvedProviders,
    activeSubscriptions,
    totalOrders: orders.length,
    monthlyRevenue: totalRevenue || 148500,
    dailyRevenue: Math.round((totalRevenue || 148500) / 28),
    totalComplaints: complaints.length,
    openComplaints: complaints.filter(c => c.status === 'OPEN' || c.status === 'IN_REVIEW').length,
    customerRetentionRate: '94.6%',
    avgProviderRating: 4.94
  };

  // Chart data series
  const revenueChart = [
    { label: 'Sep', revenue: 95000, orders: 410 },
    { label: 'Oct', revenue: 112000, orders: 490 },
    { label: 'Nov', revenue: 128000, orders: 560 },
    { label: 'Dec', revenue: 139000, orders: 620 },
    { label: 'Jan', revenue: 145000, orders: 670 },
    { label: 'Feb (Current)', revenue: 168000, orders: 740 }
  ];

  const subscriptionGrowthChart = [
    { month: 'Sep', daily: 120, weekly: 85, monthly: 140 },
    { month: 'Oct', daily: 150, weekly: 110, monthly: 190 },
    { month: 'Nov', daily: 180, weekly: 135, monthly: 240 },
    { month: 'Dec', daily: 210, weekly: 160, monthly: 290 },
    { month: 'Jan', daily: 250, weekly: 190, monthly: 350 },
    { month: 'Feb', daily: 310, weekly: 240, monthly: 420 }
  ];

  const providerOnboardingChart = [
    { city: 'Jaipur', count: 42 },
    { city: 'Ajmer', count: 24 },
    { city: 'Kishangarh', count: 18 }
  ];

  res.json({
    success: true,
    data: {
      stats,
      charts: {
        revenueChart,
        subscriptionGrowthChart,
        providerOnboardingChart
      },
      recentOrders: orders.slice(0, 10),
      recentSubscriptions: subscriptions.slice(0, 10),
      pendingProviders: providers.filter(p => p.approvalStatus === 'PENDING_APPROVAL'),
      recentComplaints: complaints.slice(0, 5)
    }
  });
});

// GET /api/admin/providers - All providers with filters
router.get('/providers', (req, res) => {
  const { status, search, city } = req.query;
  const store = db.get();
  let list = [...(store.providers || [])];

  if (status && status !== 'all') {
    list = list.filter(p => p.approvalStatus === status);
  }
  if (city && city !== 'all') {
    list = list.filter(p => (p.city || '').toLowerCase() === city.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      (p.businessName || '').toLowerCase().includes(q) ||
      (p.ownerName || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: list
  });
});

// PUT /api/admin/providers/:id/approve - Approve provider
router.put('/providers/:id/approve', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  provider.approvalStatus = 'APPROVED';
  provider.isAcceptingOrders = true;
  provider.updatedAt = new Date().toISOString();

  // Notify Provider
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: provider.userId,
    role: 'PROVIDER',
    title: 'Profile Approved & Verified! 🎉',
    message: `Congratulations! ${provider.businessName} is now officially approved and visible on HomeFeast.`,
    type: 'provider_approval',
    targetId: provider.id,
    actionUrl: '#provider-dashboard',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  if (store.adminStats) {
    store.adminStats.pendingApprovals = Math.max(0, (store.adminStats.pendingApprovals || 1) - 1);
    store.adminStats.approvedProviders = (store.adminStats.approvedProviders || 0) + 1;
  }

  db.save(store);

  res.json({
    success: true,
    message: `Provider "${provider.businessName}" has been approved and awarded the verification badge!`,
    data: provider
  });
});

// PUT /api/admin/providers/:id/reject - Reject provider
router.put('/providers/:id/reject', (req, res) => {
  const { reason } = req.body;
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  provider.approvalStatus = 'REJECTED';
  provider.isAcceptingOrders = false;
  provider.rejectionReason = reason || 'Documentation incomplete';
  provider.updatedAt = new Date().toISOString();

  // Notify Provider
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: provider.userId,
    role: 'PROVIDER',
    title: 'Registration Application Update',
    message: `Your kitchen application was not approved. Reason: ${provider.rejectionReason}. Please contact support.`,
    type: 'provider_approval',
    targetId: provider.id,
    actionUrl: '#profile',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  if (store.adminStats) {
    store.adminStats.pendingApprovals = Math.max(0, (store.adminStats.pendingApprovals || 1) - 1);
  }

  db.save(store);

  res.json({
    success: true,
    message: `Provider "${provider.businessName}" registration rejected.`,
    data: provider
  });
});

// PUT /api/admin/providers/:id/suspend - Suspend provider
router.put('/providers/:id/suspend', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  provider.approvalStatus = 'SUSPENDED';
  provider.isAcceptingOrders = false;
  provider.updatedAt = new Date().toISOString();

  db.save(store);

  res.json({
    success: true,
    message: `Provider "${provider.businessName}" suspended.`,
    data: provider
  });
});

// PUT /api/admin/providers/:id/reactivate - Reactivate provider
router.put('/providers/:id/reactivate', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  provider.approvalStatus = 'APPROVED';
  provider.isAcceptingOrders = true;
  provider.updatedAt = new Date().toISOString();

  db.save(store);

  res.json({
    success: true,
    message: `Provider "${provider.businessName}" reactivated.`,
    data: provider
  });
});

// GET /api/admin/users - User management
router.get('/users', (req, res) => {
  const { role, status, search } = req.query;
  const store = db.get();
  let list = [...(store.users || [])];

  if (role && role !== 'all') {
    list = list.filter(u => (u.role || '').toUpperCase() === role.toUpperCase());
  }
  if (status && status !== 'all') {
    list = list.filter(u => u.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q)
    );
  }

  res.json({
    success: true,
    data: list.map(u => ({ ...u, passwordHash: undefined }))
  });
});

// PUT /api/admin/users/:id/status - Toggle user status
router.put('/users/:id/status', (req, res) => {
  const { status } = req.body;
  const store = db.get();
  const user = store.users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  user.status = status || (user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
  user.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: `User status changed to ${user.status}`,
    data: { ...user, passwordHash: undefined }
  });
});

// GET /api/admin/categories
router.get('/categories', (req, res) => {
  const store = db.get();
  res.json({ success: true, data: store.categories || [] });
});

// POST /api/admin/categories
router.post('/categories', (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name required.' });

  const store = db.get();
  const newCat = {
    id: `cat_${Date.now()}`,
    name,
    description: description || '',
    icon: icon || '🍲',
    status: 'ACTIVE'
  };

  store.categories.push(newCat);
  db.save(store);

  res.json({ success: true, message: 'Category added.', data: newCat });
});

// GET /api/admin/cuisines
router.get('/cuisines', (req, res) => {
  const store = db.get();
  res.json({ success: true, data: store.cuisines || [] });
});

// POST /api/admin/cuisines
router.post('/cuisines', (req, res) => {
  const { name, description, image } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Cuisine name required.' });

  const store = db.get();
  const newCui = {
    id: `cui_${Date.now()}`,
    name,
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    status: 'ACTIVE'
  };

  store.cuisines.push(newCui);
  db.save(store);

  res.json({ success: true, message: 'Cuisine added.', data: newCui });
});

// GET /api/admin/subscriptions - Platform-wide passes
router.get('/subscriptions', (req, res) => {
  const { status, search } = req.query;
  const store = db.get();
  let list = [...(store.subscriptions || [])];

  if (status && status !== 'all') {
    list = list.filter(s => s.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(s =>
      (s.customerName || '').toLowerCase().includes(q) ||
      (s.customerPhone || '').includes(q) ||
      (s.providerName || '').toLowerCase().includes(q) ||
      (s.mealPlanName || '').toLowerCase().includes(q) ||
      (s.id || '').toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/admin/orders - Platform-wide orders
router.get('/orders', (req, res) => {
  const { status, search } = req.query;
  const store = db.get();
  let list = [...(store.orders || [])];

  if (status && status !== 'all') {
    list = list.filter(o => o.orderStatus === status);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(o =>
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').includes(q) ||
      (o.providerName || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: list
  });
});

// POST /api/admin/users - Admin directly registers a user
router.post('/users', (req, res) => {
  const { name, email, phone, role = 'CUSTOMER', city = 'jaipur', area = 'Malviya Nagar', address = '' } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
  }

  const store = db.get();
  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: role.toUpperCase(),
    city: city.toLowerCase(),
    area: area.trim(),
    address: address.trim() || `${area}, ${city}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.users.unshift(newUser);
  db.save(store);

  res.status(201).json({
    success: true,
    message: `User ${name} created successfully as ${role}!`,
    data: newUser
  });
});

// POST /api/admin/providers - Admin directly registers a kitchen partner
router.post('/providers', (req, res) => {
  const {
    businessName,
    ownerName,
    email,
    phone,
    city = 'jaipur',
    area = 'Malviya Nagar',
    address = '',
    cuisines = ['North Indian', 'Homemade'],
    fssaiNumber = '10023011004821',
    hygieneScore = '99.2%'
  } = req.body;

  if (!businessName || !ownerName || !phone) {
    return res.status(400).json({ success: false, message: 'Kitchen name, owner name, and phone are required.' });
  }

  const store = db.get();
  const newProvId = `prov_${Date.now()}`;
  const newUserId = `usr_${Date.now()}`;

  const newProvUser = {
    id: newUserId,
    name: ownerName.trim(),
    email: (email || `cook_${Date.now()}@homefeast.test`).trim().toLowerCase(),
    phone: phone.trim(),
    role: 'PROVIDER',
    city: city.toLowerCase(),
    area: area.trim(),
    address: address.trim() || `${area}, ${city}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const newProvider = {
    id: newProvId,
    userId: newUserId,
    businessName: businessName.trim(),
    ownerName: ownerName.trim(),
    email: newProvUser.email,
    phone: phone.trim(),
    description: req.body.description || 'Verified HomeFeast cloud kitchen partner.',
    image: req.body.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
    cuisines: Array.isArray(cuisines) ? cuisines : [cuisines],
    mealType: req.body.mealType || 'veg',
    city: city.toLowerCase(),
    area: area.trim(),
    address: address.trim() || `${area}, ${city}`,
    approvalStatus: 'APPROVED',
    rating: 5.0,
    totalReviews: 0,
    startingPrice: 99,
    availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
    isAcceptingOrders: true,
    minOrder: 80,
    fssaiNumber: fssaiNumber || '10023011004821',
    hygieneScore: hygieneScore || '99.0%',
    packagingType: 'Stainless Steel Insulated Dabba',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.users.unshift(newProvUser);
  store.providers.unshift(newProvider);
  db.save(store);

  res.status(201).json({
    success: true,
    message: `Kitchen "${businessName}" created and verified successfully!`,
    data: newProvider
  });
});

// POST /api/admin/reset-database - Reset to fresh seed
router.post('/reset-database', (req, res) => {
  const fresh = db.resetToSeed();
  res.json({
    success: true,
    message: 'Database reset to fresh HomeFeast seed data.',
    data: {
      usersCount: fresh.users.length,
      providersCount: fresh.providers.length,
      dishesCount: fresh.menuItems.length,
      plansCount: fresh.mealPlans.length
    }
  });
});

export default router;
