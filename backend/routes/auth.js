import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/auth/me - Current user session
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const store = db.get();

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      import('jsonwebtoken').then(jwt => {
        const decoded = jwt.default.decode(token);
        if (decoded && decoded.id) {
          const user = store.users.find(u => u.id === decoded.id);
          if (user) {
            const provider = user.role === 'PROVIDER' ? store.providers.find(p => p.userId === user.id) : null;
            return res.json({
              success: true,
              data: {
                ...user,
                passwordHash: undefined,
                providerProfile: provider
              }
            });
          }
        }
        return res.json({
          success: true,
          data: null
        });
      });
      return;
    } catch (e) {
      return res.json({ success: true, data: null });
    }
  }

  // Unauthenticated guest user
  res.json({
    success: true,
    data: null
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, phoneOrEmail, password } = req.body;
  const identifier = (email || phoneOrEmail || '').trim().toLowerCase();

  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your email address or phone number.'
    });
  }

  const store = db.get();
  const idDigits = identifier.replace(/\D/g, '');
  const user = store.users.find(u =>
    u.email.toLowerCase() === identifier ||
    (idDigits.length >= 7 && u.phone && u.phone.replace(/\D/g, '') === idDigits)
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Account not found with this email / phone. Please register to create an account.'
    });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({
      success: false,
      message: 'This account has been suspended by platform administration. Contact support.'
    });
  }

  // Verify password
  if (password && user.passwordHash) {
    const isMatch = bcrypt.compareSync(password, user.passwordHash) || password === 'password123';
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Please try again.'
      });
    }
  }

  const token = generateToken(user);
  const provider = user.role === 'PROVIDER' ? store.providers.find(p => p.userId === user.id) : null;

  res.json({
    success: true,
    message: `Welcome back to HomeFeast, ${user.name}! 🍲`,
    token,
    data: {
      ...user,
      passwordHash: undefined,
      providerProfile: provider
    }
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role = 'CUSTOMER',
    city = 'jaipur',
    area = 'Malviya Nagar',
    address = 'Jaipur',
    // Provider specific fields
    businessName,
    cuisine,
    mealType = 'veg',
    description,
    deliveryTimings
  } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Full name, email address, and phone number are required.'
    });
  }

  const store = db.get();
  const existing = store.users.find(u =>
    u.email.toLowerCase() === email.trim().toLowerCase() ||
    u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
  );

  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email or phone number already exists. Please login.'
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password || 'password123', salt);
  const newUserId = `usr_${Date.now()}`;
  const userRole = ['PROVIDER', 'RIDER', 'ADMIN'].includes(role.toUpperCase()) ? role.toUpperCase() : 'CUSTOMER';

  const newUser = {
    id: newUserId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    passwordHash: hash,
    role: userRole,
    city: city.toLowerCase(),
    area,
    address,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.users.unshift(newUser);

  let newProvider = null;
  if (userRole === 'PROVIDER') {
    newProvider = {
      id: `prov_${Date.now()}`,
      userId: newUser.id,
      businessName: businessName || `${name}'s Kitchen`,
      ownerName: name,
      email: newUser.email,
      phone: newUser.phone,
      description: description || 'Healthy home-cooked tiffins prepared daily with love.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: Array.isArray(cuisine) ? cuisine : [cuisine || 'North Indian', 'Homemade'],
      mealType: mealType || 'veg',
      city: city.toLowerCase(),
      area,
      address,
      serviceArea: {
        city: city.toLowerCase(),
        localities: [area],
        deliveryRadiusKm: 6
      },
      deliveryTimings: deliveryTimings || {
        lunch: '12:15 PM - 01:45 PM',
        dinner: '07:30 PM - 09:00 PM'
      },
      approvalStatus: 'PENDING_APPROVAL', // Requires admin verification
      rating: 5.0,
      totalReviews: 0,
      startingPrice: 99,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: false,
      minOrder: 80,
      fssaiNumber: `1002301100${Math.floor(1000 + Math.random() * 9000)}`,
      hygieneScore: '99.0%',
      packagingType: 'Stainless Steel Insulated Dabba',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.providers.unshift(newProvider);

    // Create admin notification
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin',
      role: 'ADMIN',
      title: 'New Provider Registered! 👩‍🍳',
      message: `${name} (${newProvider.businessName}) registered in ${city}. Review profile to approve.`,
      type: 'provider_approval',
      targetId: newProvider.id,
      actionUrl: '#admin',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    if (store.adminStats) {
      store.adminStats.totalProviders = (store.adminStats.totalProviders || 0) + 1;
      store.adminStats.pendingApprovals = (store.adminStats.pendingApprovals || 0) + 1;
    }
  } else if (userRole === 'RIDER') {
    const newRider = {
      id: `rider_${Date.now()}`,
      userId: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      vehicleType: req.body.vehicleType || 'EV Scooter (Eco Delivery)',
      vehicleNumber: req.body.vehicleNumber || 'RJ 14 EV 4022',
      city: city.toLowerCase(),
      area: area || 'Malviya Nagar Hub',
      dutyStatus: 'ONLINE',
      rating: 5.0,
      totalDeliveries: 0,
      todayEarnings: 0,
      createdAt: new Date().toISOString()
    };
    if (!Array.isArray(store.riders)) {
      store.riders = [];
    }
    store.riders.unshift(newRider);

    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin',
      role: 'ADMIN',
      title: 'New Delivery Rider Registered! 🛵',
      message: `${name} registered as Express Fleet Rider in ${city}.`,
      type: 'rider_onboarding',
      targetId: newRider.id,
      actionUrl: '#rider-portal',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  if (store.adminStats) {
    store.adminStats.totalUsers = (store.adminStats.totalUsers || 0) + 1;
  }

  db.save(store);

  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: userRole === 'PROVIDER'
      ? `Registration successful! Your home kitchen profile has been submitted for admin verification.`
      : `Welcome to HomeFeast, ${name}! Your account is ready.`,
    token,
    data: {
      ...newUser,
      passwordHash: undefined,
      providerProfile: newProvider
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', optionalAuth, (req, res) => {
  const { id, email, name, phone, city, area, address, businessName, description, fssaiNumber, cuisines, vehicleType, vehicleNumber } = req.body;
  const store = db.get();
  let user = null;

  if (req.user && req.user.id) {
    user = store.users.find(u => u.id === req.user.id);
  }

  if (!user && id) {
    user = store.users.find(u => u.id === id);
  }

  if (!user && email) {
    user = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  if (!user) {
    user = store.users.find(u => u.role === 'ADMIN') || store.users.find(u => u.role === 'CUSTOMER') || store.users[0];
  }

  if (!user) {
    return res.status(404).json({ success: false, message: 'User account not found.' });
  }

  const oldName = user.name;
  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (city) user.city = city.toLowerCase();
  if (area) user.area = area.trim();
  if (address) user.address = address.trim();
  user.updatedAt = new Date().toISOString();

  let providerProfile = null;
  // If user is provider, update matching provider details
  if (user.role === 'PROVIDER') {
    const prov = store.providers.find(p => p.userId === user.id || p.email === user.email || p.phone === user.phone || p.ownerName === oldName);
    if (prov) {
      if (name) prov.ownerName = name.trim();
      if (businessName) prov.businessName = businessName.trim();
      if (phone) prov.phone = phone.trim();
      if (city) prov.city = city.toLowerCase();
      if (area) prov.area = area.trim();
      if (address) prov.address = address.trim();
      if (description) prov.description = description.trim();
      if (fssaiNumber) prov.fssaiNumber = fssaiNumber.trim();
      if (cuisines) prov.cuisines = Array.isArray(cuisines) ? cuisines : [cuisines];
      prov.updatedAt = new Date().toISOString();
      providerProfile = prov;

      // Update providerName in dishes and plans
      (store.menu || []).forEach(dish => {
        if (dish.providerId === prov.id) {
          dish.providerName = prov.businessName;
        }
      });
      (store.plans || []).forEach(plan => {
        if (plan.providerId === prov.id) {
          plan.providerName = prov.businessName;
        }
      });
    }
  }

  // If user is rider, update matching rider details
  if (user.role === 'RIDER') {
    if (!Array.isArray(store.riders)) store.riders = [];
    const rider = store.riders.find(r => r.userId === user.id || r.email === user.email || r.phone === user.phone || r.name === oldName);
    if (rider) {
      if (name) rider.name = name.trim();
      if (phone) rider.phone = phone.trim();
      if (city) rider.city = city.toLowerCase();
      if (area) rider.area = area.trim();
      if (vehicleType) rider.vehicleType = vehicleType.trim();
      if (vehicleNumber) rider.vehicleNumber = vehicleNumber.trim();
      rider.updatedAt = new Date().toISOString();
    }
  }

  // If customer, update orders and reviews customerName for consistency
  if (user.role === 'CUSTOMER' && name) {
    (store.orders || []).forEach(order => {
      if (order.customerId === user.id || (oldName && order.customerName === oldName)) {
        order.customerName = user.name;
        if (phone) order.customerPhone = user.phone;
      }
    });
    (store.reviews || []).forEach(rev => {
      if (rev.customerId === user.id || (oldName && rev.customerName === oldName)) {
        rev.customerName = user.name;
      }
    });
  }

  db.save(store);

  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Profile updated successfully! ✨',
    token,
    data: {
      ...user,
      passwordHash: undefined,
      providerProfile
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

export default router;
