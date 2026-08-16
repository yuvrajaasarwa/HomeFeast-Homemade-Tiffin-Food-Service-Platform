import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/subscriptions - Get subscriptions list
router.get('/', optionalAuth, (req, res) => {
  const { customerId, providerId, status } = req.query;
  const store = db.get();
  let list = [...(store.subscriptions || [])];

  if (req.user) {
    if (req.user.role === 'CUSTOMER') {
      list = list.filter(s => s.customerId === req.user.id);
    } else if (req.user.role === 'PROVIDER') {
      const prov = store.providers.find(p => p.userId === req.user.id);
      if (prov) {
        list = list.filter(s => s.providerId === prov.id);
      }
    }
  } else if (customerId) {
    list = list.filter(s => s.customerId === customerId);
  }

  if (providerId) {
    list = list.filter(s => s.providerId === providerId);
  }
  if (status && status !== 'all') {
    list = list.filter(s => s.status === status);
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/subscriptions/active - Current user active subscription
router.get('/active', optionalAuth, (req, res) => {
  const store = db.get();
  let sub = null;

  if (req.user) {
    sub = store.subscriptions.find(s => s.customerId === req.user.id && s.status === 'ACTIVE') ||
          store.subscriptions.find(s => s.customerId === req.user.id) ||
          null;
  } else {
    sub = store.subscriptions.find(s => s.status === 'ACTIVE') || store.subscriptions[0] || null;
  }

  res.json({
    success: true,
    data: sub
  });
});

// GET /api/subscriptions/:id
router.get('/:id', (req, res) => {
  const store = db.get();
  const sub = store.subscriptions.find(s => s.id === req.params.id);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }
  res.json({ success: true, data: sub });
});

// POST /api/subscriptions - Create / subscribe to a meal plan
router.post('/', optionalAuth, (req, res) => {
  const {
    planId,
    providerId,
    mealSlot,
    dietPreference,
    deliveryAddress,
    deliveryCity,
    deliveryLocality,
    customerName,
    customerPhone,
    startDate,
    notes,
    paymentMethod = 'UPI'
  } = req.body;

  const store = db.get();
  let plan = store.mealPlans.find(p => p.id === planId);

  if (!plan) {
    // If exact plan not found in store, create a dynamic fallback plan object
    const matchedProvider = store.providers.find(p => p.id === providerId);
    plan = {
      id: planId || `plan_${Date.now()}`,
      providerId: providerId || matchedProvider?.id || store.providers[0]?.id || 'prov_1',
      name: req.body.planName || (matchedProvider ? `${matchedProvider.businessName} Meal Pass` : 'Healthy Diet Meal Pass'),
      price: Number(req.body.price) || 1499,
      durationDays: Number(req.body.durationDays) || 30,
      planType: req.body.planType || 'MONTHLY',
      deliveryTiming: mealSlot || 'Lunch (12:15 PM - 01:45 PM)'
    };
  }

  const provider = store.providers.find(p => p.id === (providerId || plan.providerId));
  const customerUser = req.user || store.users.find(u => u.role === 'CUSTOMER') || {
    id: 'usr_customer_1',
    name: customerName || 'Aarav Sharma',
    phone: customerPhone || '+91 98290 12345',
    address: deliveryAddress || 'Flat 304, Royal Palms, Malviya Nagar, Jaipur'
  };

  const calcStartDate = startDate || new Date().toISOString().split('T')[0];
  const duration = Number(plan.durationDays || plan.duration || (plan.planType === 'DAILY' ? 1 : plan.planType === 'WEEKLY' ? 7 : 30));
  const calcEndDate = new Date(new Date(calcStartDate).getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const newSubId = `SUB-${Math.floor(100 + Math.random() * 900)}`;

  const newSub = {
    id: newSubId,
    subscriptionNumber: newSubId,
    customerId: customerUser.id,
    customerName: customerName || customerUser.name,
    customerPhone: customerPhone || customerUser.phone,
    providerId: provider?.id || plan.providerId,
    providerName: provider?.businessName || 'Annapurna Homestyle Rasoi',
    mealPlanId: plan.id,
    mealPlanName: plan.name,
    planType: plan.planType || 'MONTHLY',
    startDate: calcStartDate,
    endDate: calcEndDate,
    totalMeals: duration,
    consumedMeals: 0,
    remainingMeals: duration,
    price: Number(plan.price || 1499),
    paymentMethod: paymentMethod,
    paymentStatus: 'PAID',
    deliveryAddress: deliveryAddress || customerUser.address || 'Malviya Nagar, Jaipur',
    deliveryCity: deliveryCity || provider?.city || 'jaipur',
    deliveryLocality: deliveryLocality || provider?.area || 'Malviya Nagar',
    mealSlot: mealSlot || plan.deliveryTiming || 'Lunch (12:15 PM - 01:45 PM)',
    dietPreference: dietPreference || 'Vegetarian',
    notes: notes || '',
    pausedDates: [],
    status: 'ACTIVE', // Becomes active immediately
    autoRenew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.subscriptions.unshift(newSub);
  if (plan.activeSubscribersCount !== undefined) {
    plan.activeSubscribersCount = (plan.activeSubscribersCount || 0) + 1;
  }

  if (store.adminStats) {
    store.adminStats.activeSubscriptions = (store.adminStats.activeSubscriptions || 0) + 1;
    store.adminStats.dailyRevenue = (store.adminStats.dailyRevenue || 0) + (newSub.price || 0);
    store.adminStats.monthlyRevenue = (store.adminStats.monthlyRevenue || 0) + (newSub.price || 0);
  }

  // Notify Provider
  if (provider) {
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: provider.userId,
      role: 'PROVIDER',
      title: 'New Tiffin Pass Subscription! 🌟',
      message: `${newSub.customerName} subscribed to ${plan.name} (${duration} Meals).`,
      type: 'subscription',
      targetId: newSub.id,
      actionUrl: '#subscriptions',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  // Notify Customer
  store.notifications.unshift({
    id: `notif_${Date.now() + 1}`,
    userId: customerUser.id,
    role: 'CUSTOMER',
    title: 'Tiffin Pass Activated! 🍲',
    message: `Your ${plan.name} is ACTIVE! Starting ${calcStartDate}.`,
    type: 'subscription',
    targetId: newSub.id,
    actionUrl: '#my-pass',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  db.save(store);

  res.status(201).json({
    success: true,
    message: `Your ${plan.name} (${duration} ${duration === 1 ? 'Meal' : 'Meals'}) is now ACTIVE! 🍲`,
    data: newSub
  });
});

// POST /api/subscriptions/pause-date - Toggle pause for a specific delivery date
router.post('/pause-date', optionalAuth, (req, res) => {
  const { date, subscriptionId } = req.body;
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required (YYYY-MM-DD).' });
  }

  const store = db.get();
  let sub = null;

  if (subscriptionId) {
    sub = store.subscriptions.find(s => s.id === subscriptionId);
  }
  
  if (!sub && req.user) {
    sub = store.subscriptions.find(s => s.customerId === req.user.id && s.status === 'ACTIVE') ||
          store.subscriptions.find(s => s.customerId === req.user.id);
  }
  
  if (!sub) {
    sub = store.subscriptions.find(s => s.status === 'ACTIVE') || store.subscriptions[0];
  }

  if (!sub) {
    sub = {
      id: 'SUB-101',
      subscriptionNumber: 'SUB-101',
      customerId: req.user?.id || 'usr_customer_1',
      customerName: req.user?.name || 'Sunita Agarwal',
      providerId: 'prov_1',
      providerName: 'Satvik Rasoi (Jain & Ayurvedic)',
      mealPlanName: '14-Day Healthy Diet Pass',
      planType: 'MONTHLY',
      mealSlot: 'Lunch (12:15 PM - 01:45 PM)',
      remainingMeals: 30,
      totalMeals: 30,
      price: 1499,
      pausedDates: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    store.subscriptions.unshift(sub);
  }

  if (!Array.isArray(sub.pausedDates)) {
    sub.pausedDates = [];
  }

  const isPaused = sub.pausedDates.includes(date);
  if (isPaused) {
    // Unpause
    sub.pausedDates = sub.pausedDates.filter(d => d !== date);
  } else {
    if (sub.pausedDates.length >= 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 pause dates allowed per billing pass.' });
    }
    sub.pausedDates.push(date);
    sub.pausedDates.sort();
  }

  sub.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: sub.pausedDates.includes(date) ? `Meal delivery paused for ${date}. Credit preserved!` : `Meal resumed for ${date}!`,
    data: sub
  });
});

// PUT /api/subscriptions/:id/status - Update subscription status (ACTIVE, PAUSED, CANCELLED, REJECTED)
router.put('/:id/status', optionalAuth, (req, res) => {
  const { status, reason } = req.body;
  const store = db.get();
  const sub = store.subscriptions.find(s => s.id === req.params.id);

  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscription not found.' });
  }

  const validStatuses = ['PENDING', 'ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  sub.status = status;
  if (reason) sub.statusReason = reason;
  sub.updatedAt = new Date().toISOString();

  // Notify customer
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: sub.customerId,
    role: 'CUSTOMER',
    title: `Subscription Pass Update: ${status}`,
    message: `Your subscription pass #${sub.id} is now ${status}.`,
    type: 'subscription',
    targetId: sub.id,
    actionUrl: '#my-pass',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  db.save(store);

  res.json({
    success: true,
    message: `Subscription status updated to ${status}`,
    data: sub
  });
});

export default router;
