import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/plans - Get all meal plans with optional filters
router.get('/', (req, res) => {
  const { providerId, planType, status = 'ACTIVE' } = req.query;
  const store = db.get();
  let list = [...(store.mealPlans || [])];

  if (providerId) {
    list = list.filter(p => p.providerId === providerId);
  }
  if (planType && planType !== 'all') {
    list = list.filter(p => p.planType.toUpperCase() === planType.toUpperCase());
  }
  if (status && status !== 'all') {
    list = list.filter(p => p.status === status);
  }

  // Attach provider details for easy card rendering
  const enrichedList = list.map(plan => {
    const provider = store.providers.find(p => p.id === plan.providerId);
    return {
      ...plan,
      providerName: provider?.businessName || 'Home Cook',
      providerCity: provider?.city || 'Jaipur',
      providerImage: provider?.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      providerRating: provider?.rating || 4.9
    };
  });

  res.json({
    success: true,
    data: enrichedList
  });
});

// GET /api/plans/:id
router.get('/:id', (req, res) => {
  const store = db.get();
  const plan = store.mealPlans.find(p => p.id === req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Meal plan not found.' });
  }

  const provider = store.providers.find(p => p.id === plan.providerId);
  res.json({
    success: true,
    data: {
      ...plan,
      provider
    }
  });
});

// POST /api/plans - Create meal plan
router.post('/', optionalAuth, (req, res) => {
  const {
    providerId,
    name,
    description,
    planType = 'MONTHLY',
    durationDays,
    price,
    mealsPerDay = 1,
    deliveryTiming,
    maxSubscribers = 30,
    includedMenuItems
  } = req.body;

  if (!name || price === undefined || price === null) {
    return res.status(400).json({ success: false, message: 'Plan name and price are required.' });
  }

  const store = db.get();
  let targetProvId = providerId || 'prov_1';

  if (req.user && req.user.role === 'PROVIDER') {
    const prov = store.providers.find(p => p.userId === req.user.id);
    if (prov) targetProvId = prov.id;
  }

  const cleanPlanType = (planType || 'MONTHLY').toUpperCase();
  const defaultDuration = cleanPlanType === 'DAILY' ? 1 : cleanPlanType === 'WEEKLY' ? 7 : 30;

  const newPlan = {
    id: `plan_${Date.now()}`,
    providerId: targetProvId,
    name: name.trim(),
    description: description || 'Healthy daily homestyle tiffin meal plan.',
    planType: cleanPlanType,
    duration: Number(durationDays) || defaultDuration,
    durationDays: Number(durationDays) || defaultDuration,
    price: Number(price),
    mealsPerDay: Number(mealsPerDay) || 1,
    deliveryTiming: deliveryTiming || 'Lunch (12:15 PM - 01:45 PM)',
    maxSubscribers: Number(maxSubscribers) || 30,
    activeSubscribersCount: 0,
    includedMenuItems: Array.isArray(includedMenuItems) ? includedMenuItems : (includedMenuItems || '').split(',').map(s => s.trim()).filter(Boolean),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.mealPlans.unshift(newPlan);

  // Update provider available meal plans array if needed
  const prov = store.providers.find(p => p.id === newPlan.providerId);
  if (prov && !prov.availableMealPlans.includes(cleanPlanType)) {
    prov.availableMealPlans.push(cleanPlanType);
  }

  db.save(store);

  res.status(201).json({
    success: true,
    message: `Meal plan "${name}" created successfully!`,
    data: newPlan
  });
});

// PUT /api/plans/:id
router.put('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const plan = store.mealPlans.find(p => p.id === req.params.id);

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Meal plan not found.' });
  }

  const {
    name,
    description,
    planType,
    durationDays,
    price,
    mealsPerDay,
    deliveryTiming,
    maxSubscribers,
    includedMenuItems,
    status
  } = req.body;

  if (name) plan.name = name.trim();
  if (description) plan.description = description;
  if (planType) plan.planType = planType.toUpperCase();
  if (durationDays !== undefined) {
    plan.duration = Number(durationDays);
    plan.durationDays = Number(durationDays);
  }
  if (price !== undefined) plan.price = Number(price);
  if (mealsPerDay !== undefined) plan.mealsPerDay = Number(mealsPerDay);
  if (deliveryTiming) plan.deliveryTiming = deliveryTiming;
  if (maxSubscribers !== undefined) plan.maxSubscribers = Number(maxSubscribers);
  if (includedMenuItems) plan.includedMenuItems = Array.isArray(includedMenuItems) ? includedMenuItems : includedMenuItems.split(',').map(s => s.trim());
  if (status) plan.status = status;
  plan.updatedAt = new Date().toISOString();

  db.save(store);

  res.json({
    success: true,
    message: `Meal plan "${plan.name}" updated successfully!`,
    data: plan
  });
});

// PATCH /api/plans/:id/toggle-status
router.patch('/:id/toggle-status', optionalAuth, (req, res) => {
  const store = db.get();
  const plan = store.mealPlans.find(p => p.id === req.params.id);

  if (!plan) {
    return res.status(404).json({ success: false, message: 'Meal plan not found.' });
  }

  plan.status = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  plan.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: `Plan status changed to ${plan.status}`,
    data: plan
  });
});

// DELETE /api/plans/:id
router.delete('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const index = store.mealPlans.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Meal plan not found.' });
  }

  const plan = store.mealPlans[index];
  store.mealPlans.splice(index, 1);
  db.save(store);

  res.json({
    success: true,
    message: `Meal plan "${plan.name}" deleted.`
  });
});

export default router;
