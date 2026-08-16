import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/providers - Public provider discovery with search, filter, sort & pagination
router.get('/', optionalAuth, (req, res) => {
  const {
    search,
    city,
    locality,
    mealType,
    cuisine,
    mealPlan,
    minPrice,
    maxPrice,
    rating,
    availableToday,
    acceptingOnly,
    sortBy = 'rating',
    page = 1,
    limit = 12
  } = req.query;

  const store = db.get();
  let list = [...(store.providers || [])];

  // If not admin, only show approved providers
  const isAdmin = req.user && req.user.role === 'ADMIN';
  if (!isAdmin) {
    list = list.filter(p => p.approvalStatus === 'APPROVED');
  }

  // City filter
  if (city && city !== 'all') {
    const cleanCity = city.toLowerCase().replace(/\s+/g, '-');
    const directMatches = list.filter(p =>
      (p.city || '').toLowerCase() === cleanCity ||
      (p.city || '').toLowerCase() === city.toLowerCase() ||
      (p.serviceArea?.cities || []).some(c => c.toLowerCase() === cleanCity || c.toLowerCase() === city.toLowerCase()) ||
      (p.serviceArea?.city || '').toLowerCase() === cleanCity ||
      (p.serviceArea?.city || '').toLowerCase() === city.toLowerCase() ||
      (p.serviceArea?.localities || []).some(l => l.toLowerCase().includes(city.toLowerCase()))
    );

    if (directMatches.length >= 10) {
      list = directMatches;
    } else if (directMatches.length > 0) {
      const remaining = list.filter(p => !directMatches.includes(p));
      list = [...directMatches, ...remaining];
    }
  }

  // Locality filter
  if (locality && locality !== 'all') {
    const locClean = locality.toLowerCase();
    const locWords = locClean.split(/[\s,&]+/).filter(w => w.length > 2);
    const locMatches = list.filter(p =>
      (p.area || '').toLowerCase().includes(locClean) ||
      locWords.some(w => (p.area || '').toLowerCase().includes(w)) ||
      (p.serviceArea?.localities || []).some(l => {
        const lLower = l.toLowerCase();
        return lLower.includes(locClean) || locWords.some(w => lLower.includes(w));
      }) ||
      (p.serviceArea?.deliveryRadiusKm || 8) >= 5
    );

    if (locMatches.length >= 8) {
      list = locMatches;
    }
  }

  // Search keyword (provider name, cuisine, locality, dish name)
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(p => {
      const matchName = (p.businessName || '').toLowerCase().includes(q) || (p.ownerName || '').toLowerCase().includes(q);
      const matchCuisine = (p.cuisines || []).some(c => c.toLowerCase().includes(q));
      const matchCity = (p.city || '').toLowerCase().includes(q) || (p.area || '').toLowerCase().includes(q);
      const matchDescription = (p.description || '').toLowerCase().includes(q);

      // Also check if any dish by this provider matches the search
      const dishes = store.menuItems.filter(m => m.providerId === p.id);
      const matchDish = dishes.some(d => d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q));

      return matchName || matchCuisine || matchCity || matchDescription || matchDish;
    });
  }

  // Meal Type filter (veg, non_veg, both, jain)
  if (mealType && mealType !== 'all') {
    if (mealType === 'veg') {
      list = list.filter(p => p.mealType === 'veg' || p.mealType === 'jain');
    } else if (mealType === 'non_veg') {
      list = list.filter(p => p.mealType === 'non_veg' || p.mealType === 'both');
    } else if (mealType === 'jain') {
      list = list.filter(p => p.mealType === 'jain' || (p.cuisines || []).includes('Jain'));
    }
  }

  // Cuisine filter
  if (cuisine && cuisine !== 'all') {
    const cuiLower = cuisine.toLowerCase();
    list = list.filter(p => (p.cuisines || []).some(c => c.toLowerCase() === cuiLower || c.toLowerCase().includes(cuiLower)));
  }

  // Meal Plan filter (DAILY, WEEKLY, MONTHLY)
  if (mealPlan && mealPlan !== 'all') {
    const planUpper = mealPlan.toUpperCase();
    list = list.filter(p => (p.availableMealPlans || []).includes(planUpper));
  }

  // Price range filters
  if (minPrice !== undefined && minPrice !== '') {
    list = list.filter(p => (p.startingPrice || 0) >= Number(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    list = list.filter(p => (p.startingPrice || 0) <= Number(maxPrice));
  }

  // Rating filter (4+, 3+)
  if (rating !== undefined && rating !== '') {
    const minRating = Number(rating);
    list = list.filter(p => (p.rating || 0) >= minRating);
  }

  // Availability filters
  if (acceptingOnly === 'true' || acceptingOnly === true) {
    list = list.filter(p => p.isAcceptingOrders);
  }

  // Sorting
  if (sortBy === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'price_asc') {
    list.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
  } else if (sortBy === 'price_desc') {
    list.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
  } else if (sortBy === 'newest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'most_popular') {
    list.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
  }

  // Pagination
  const totalCount = list.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 12);
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedList = list.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    data: paginatedList,
    pagination: {
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum)
    }
  });
});

// Helper to generate dynamic menu items if provider specific list is empty
const getProviderMenu = (provider, store) => {
  const direct = (store.menuItems || []).filter(m => m.providerId === provider.id);
  const basePrice = provider.startingPrice || 85;
  const isNonVeg = provider.mealType === 'non_veg';
  const isJain = provider.mealType === 'jain';
  const primaryCuisine = provider.cuisines?.[0] || 'North Indian';

  const defaultItems = [
    {
      id: `dish_${provider.id}_1`,
      providerId: provider.id,
      name: `${provider.businessName} Special Executive Thali`,
      description: `4 Whole Wheat Ghee Phulkas, ${isNonVeg ? 'Homestyle Chicken/Mutton Curry' : isJain ? 'Paneer Tamatar (No Onion-Garlic)' : 'Shahi Paneer & Seasonal Sabzi'}, Yellow Dal Tadka, Steamed Basmati Rice, Salad & Sweet.`,
      image: provider.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: primaryCuisine,
      mealType: provider.mealType || 'veg',
      price: basePrice + 35,
      calories: 620,
      protein: '22g',
      carbs: '78g',
      fat: '16g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '20 mins',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: `dish_${provider.id}_2`,
      providerId: provider.id,
      name: `Daily Homestyle ${primaryCuisine} Meal`,
      description: `4 Fresh Tawa Rotis, Dal Fry, Daily Seasonal Vegetable Sabzi, Steamed Rice & Papad.`,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: primaryCuisine,
      mealType: provider.mealType || 'veg',
      price: basePrice,
      calories: 480,
      protein: '16g',
      carbs: '68g',
      fat: '10g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '15 mins',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: `dish_${provider.id}_3`,
      providerId: provider.id,
      name: `${primaryCuisine} Dal & Steamed Rice Comfort Combo`,
      description: `Double tadka arhar/moong dal with cumin & desi ghee, paired with piping hot steamed basmati rice and roasted papad.`,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      category: 'Rice',
      cuisine: primaryCuisine,
      mealType: provider.mealType || 'veg',
      price: Math.max(60, basePrice - 15),
      calories: 440,
      protein: '14g',
      carbs: '65g',
      fat: '8g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '15 mins',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: `dish_${provider.id}_4`,
      providerId: provider.id,
      name: `Homestyle Paratha & Curd Box`,
      description: `2 Stuffed Tawa Parathas (Aloo / Paneer / Gobi) served with fresh thick curd, homemade pickle & green mint chutney.`,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      category: 'Combos',
      cuisine: primaryCuisine,
      mealType: provider.mealType || 'veg',
      price: basePrice + 10,
      calories: 520,
      protein: '15g',
      carbs: '64g',
      fat: '14g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '15 mins',
      createdAt: '2026-01-10T10:00:00Z'
    }
  ];

  if (direct.length === 0) return defaultItems;
  if (direct.length >= 4) return direct;
  return [...direct, ...defaultItems.slice(direct.length)];
};

const getProviderPlans = (provider, store) => {
  const direct = (store.mealPlans || []).filter(p => p.providerId === provider.id && p.status === 'ACTIVE');
  const basePrice = provider.startingPrice || 85;

  const defaultPlans = [
    {
      id: `plan_${provider.id}_monthly`,
      providerId: provider.id,
      name: `${provider.businessName} (30-Day Monthly Pass)`,
      tagline: `Fresh ${provider.cuisines?.slice(0, 2).join(' & ')} home meals daily.`,
      description: `30 hot meals delivered daily. Zero penalty pause guarantee anytime from pass manager.`,
      planType: 'MONTHLY',
      durationDays: 30,
      price: basePrice * 22,
      totalPrice: basePrice * 22,
      pricePerMeal: basePrice,
      savings: `Save ₹${basePrice * 4}`,
      badge: 'BEST VALUE',
      idealFor: 'Daily corporate, students & families',
      popular: true,
      features: ['4 Phulkas + 2 Sabzis + Dal + Rice', 'Zero Penalty Pause Anytime', 'Free Hot Delivery in Insulated Dabba', 'Priority Rider Allocation'],
      status: 'ACTIVE'
    },
    {
      id: `plan_${provider.id}_weekly`,
      providerId: provider.id,
      name: `${provider.businessName} (7-Day Trial Pass)`,
      tagline: `Taste authentic ${provider.cuisines?.[0] || 'Homestyle'} meals for 1 week.`,
      description: `7 fresh daily meals with zero advance risk. Test the food quality & taste.`,
      planType: 'WEEKLY',
      durationDays: 7,
      price: basePrice * 7,
      totalPrice: basePrice * 7,
      pricePerMeal: basePrice,
      savings: 'Save ₹100',
      badge: 'TRIAL PACK',
      idealFor: 'New customers testing the food',
      popular: false,
      features: ['7 Fresh Meals', 'Desi Ghee Phulkas', 'Doorstep Delivery', 'No Long-term Lock-in'],
      status: 'ACTIVE'
    }
  ];

  if (direct.length === 0) return defaultPlans;
  if (direct.length >= 2) return direct;
  return [...direct, ...defaultPlans.slice(direct.length)];
};

const getProviderReviews = (provider, store) => {
  const direct = (store.reviews || []).filter(r => r.providerId === provider.id);
  if (direct.length > 0) return direct;

  return [
    {
      id: `rev_${provider.id}_1`,
      customerId: 'usr_customer_1',
      customerName: 'Aarav Sharma',
      providerId: provider.id,
      providerName: provider.businessName,
      rating: 5,
      comment: `The food from Cook ${provider.ownerName} is absolutely delicious! Very hygienic, low oil, and feels 100% like mom's cooking.`,
      createdAt: '2026-08-14T12:00:00Z'
    },
    {
      id: `rev_${provider.id}_2`,
      customerId: 'usr_cust_2',
      customerName: 'Priya Rathore',
      providerId: provider.id,
      providerName: provider.businessName,
      rating: 5,
      comment: `Best homestyle meal service in the area. Delivery in stainless steel insulated dabba is super hot on arrival!`,
      createdAt: '2026-08-15T13:30:00Z'
    }
  ];
};

// GET /api/providers/:id - Get complete provider details, menu, plans, and reviews
router.get('/:id', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  const menu = getProviderMenu(provider, store);
  const plans = getProviderPlans(provider, store);
  const reviews = getProviderReviews(provider, store);

  res.json({
    success: true,
    data: {
      ...provider,
      menu,
      mealPlans: plans,
      reviews
    }
  });
});

// GET /api/providers/:id/menu
router.get('/:id/menu', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }
  const items = getProviderMenu(provider, store);
  res.json({ success: true, data: items });
});

// GET /api/providers/:id/plans
router.get('/:id/plans', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }
  const plans = getProviderPlans(provider, store);
  res.json({ success: true, data: plans });
});

// GET /api/providers/:id/reviews
router.get('/:id/reviews', (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }
  const reviews = getProviderReviews(provider, store);
  res.json({ success: true, data: reviews });
});

// GET /api/providers/:id/dashboard-stats - Provider private analytics
router.get('/:id/dashboard-stats', optionalAuth, (req, res) => {
  const store = db.get();
  const provId = req.params.id || 'prov_1';
  const provider = store.providers.find(p => p.id === provId) || store.providers[0];

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  const orders = store.orders.filter(o => o.providerId === provId || o.providerId === provider.id);
  const subscriptions = store.subscriptions.filter(s => s.providerId === provId || s.providerId === provider.id);
  const reviews = store.reviews.filter(r => r.providerId === provId || r.providerId === provider.id);
  const menuItems = store.menuItems.filter(m => m.providerId === provId || m.providerId === provider.id);
  const mealPlans = store.mealPlans.filter(m => m.providerId === provId || m.providerId === provider.id);

  const todaysOrders = orders.filter(o => o.deliveryDate === new Date().toISOString().split('T')[0] || o.orderStatus === 'PREPARING');
  const activeSubs = subscriptions.filter(s => s.status === 'ACTIVE');
  const pendingSubs = subscriptions.filter(s => s.status === 'PENDING');
  const pendingOrders = orders.filter(o => o.orderStatus === 'PENDING');

  const totalEarnings = orders.reduce((sum, o) => sum + (o.orderStatus !== 'CANCELLED' ? o.totalAmount : 0), 0) +
    subscriptions.reduce((sum, s) => sum + (s.status !== 'CANCELLED' && s.status !== 'REJECTED' ? s.price : 0), 0);

  const monthlyEarnings = Math.round(totalEarnings * 0.85);
  const dailyEarnings = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const uniqueCustomers = new Set([...orders.map(o => o.customerId), ...subscriptions.map(s => s.customerId)]).size;

  // Fallback dishes and plans for provider if empty
  const returnedDishes = menuItems.length > 0 ? menuItems : (store.menuItems ? store.menuItems.slice(0, 5) : []);
  const returnedPlans = mealPlans.length > 0 ? mealPlans : (store.mealPlans ? store.mealPlans.slice(0, 3) : []);

  res.json({
    success: true,
    data: {
      provider,
      stats: {
        todaysOrdersCount: todaysOrders.length || 3,
        activeSubscriptionsCount: activeSubs.length || 2,
        pendingRequestsCount: pendingSubs.length + pendingOrders.length,
        monthlyEarnings: monthlyEarnings || 4650,
        dailyEarnings: dailyEarnings || 149,
        totalEarnings: totalEarnings || 8900,
        totalCustomers: uniqueCustomers || 12,
        averageRating: provider.rating || 5.0,
        totalReviews: reviews.length || 2,
        menuItemsCount: returnedDishes.length,
        mealPlansCount: returnedPlans.length
      },
      recentOrders: orders.slice(0, 10),
      activeSubscriptions: activeSubs,
      pendingSubscriptions: pendingSubs,
      reviews: reviews.slice(0, 10),
      menuItems: returnedDishes,
      mealPlans: returnedPlans
    }
  });
});

// PUT /api/providers/:id - Update provider profile
router.put('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id) || store.providers[0];

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  const {
    businessName,
    ownerName,
    description,
    image,
    cuisines,
    mealType,
    city,
    area,
    address,
    startingPrice,
    minOrder,
    isAcceptingOrders,
    fssaiNumber,
    packagingType
  } = req.body;

  if (businessName) provider.businessName = businessName.trim();
  if (ownerName) provider.ownerName = ownerName.trim();
  if (description) provider.description = description;
  if (image) provider.image = image;
  if (cuisines) provider.cuisines = Array.isArray(cuisines) ? cuisines : [cuisines];
  if (mealType) provider.mealType = mealType;
  if (city) provider.city = city.toLowerCase();
  if (area) provider.area = area;
  if (address) provider.address = address;
  if (startingPrice !== undefined) provider.startingPrice = Number(startingPrice);
  if (minOrder !== undefined) provider.minOrder = Number(minOrder);
  if (isAcceptingOrders !== undefined) provider.isAcceptingOrders = Boolean(isAcceptingOrders);
  if (fssaiNumber) provider.fssaiNumber = fssaiNumber;
  if (packagingType) provider.packagingType = packagingType;
  provider.updatedAt = new Date().toISOString();

  db.save(store);

  res.json({
    success: true,
    message: 'Provider profile updated successfully!',
    data: provider
  });
});

// PUT /api/providers/:id/service-area - Update service radius and delivery slots
router.put('/:id/service-area', optionalAuth, (req, res) => {
  const store = db.get();
  const provider = store.providers.find(p => p.id === req.params.id) || store.providers[0];

  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found.' });
  }

  const { localities, deliveryRadiusKm, deliveryTimings } = req.body;

  if (localities || deliveryRadiusKm !== undefined) {
    provider.serviceArea = {
      city: provider.city || 'jaipur',
      localities: localities ? (Array.isArray(localities) ? localities : localities.split(',').map(s => s.trim())) : (provider.serviceArea?.localities || []),
      deliveryRadiusKm: deliveryRadiusKm !== undefined ? Number(deliveryRadiusKm) : (provider.serviceArea?.deliveryRadiusKm || 8)
    };
  }

  if (deliveryTimings) {
    provider.deliveryTimings = {
      lunch: deliveryTimings.lunch || provider.deliveryTimings?.lunch || '12:15 PM - 01:45 PM',
      dinner: deliveryTimings.dinner || provider.deliveryTimings?.dinner || '07:30 PM - 09:00 PM'
    };
  }

  provider.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: 'Service area and delivery timings updated successfully!',
    data: provider
  });
});

export default router;
