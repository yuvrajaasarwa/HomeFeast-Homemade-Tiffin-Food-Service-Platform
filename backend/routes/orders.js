import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const VALID_COUPONS = {
  FIRSTGHAR50: { discount: 50, minOrder: 140, description: 'Flat ₹50 OFF on your first homemade meal!' },
  BATCH20: { discount: 100, minOrder: 400, description: 'Flat 20% OFF on batch orders above ₹400' },
  RAJASTHAN50: { discount: 50, minOrder: 150, description: 'Flat ₹50 OFF on Rajasthani Special Thalis' },
  HEALTHY20: { discount: 30, minOrder: 150, description: '₹30 OFF on Healthy & Satvik meals' },
  ROYAL100: { discount: 100, minOrder: 400, description: 'Flat ₹100 OFF on Royal Mahabhoj orders' }
};

// GET /api/orders - Get orders (filtered by authenticated user role or query)
router.get('/', optionalAuth, (req, res) => {
  const { customerId, providerId, status } = req.query;
  const store = db.get();
  let list = [...(store.orders || [])];

  if (req.user) {
    if (req.user.role === 'CUSTOMER') {
      list = list.filter(o => o.customerId === req.user.id);
    } else if (req.user.role === 'PROVIDER') {
      const prov = store.providers.find(p => p.userId === req.user.id);
      if (prov) {
        list = list.filter(o => o.providerId === prov.id);
      }
    }
  } else if (customerId) {
    list = list.filter(o => o.customerId === customerId);
  }

  if (providerId) {
    list = list.filter(o => o.providerId === providerId);
  }
  if (status && status !== 'all') {
    list = list.filter(o => o.orderStatus === status);
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const store = db.get();
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders/validate-coupon
router.post('/validate-coupon', (req, res) => {
  const { couponCode, subtotal } = req.body;
  if (!couponCode) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
  }

  const code = couponCode.trim().toUpperCase();
  const coupon = VALID_COUPONS[code];

  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
  }

  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount of ₹${coupon.minOrder} required for coupon ${code}.`
    });
  }

  res.json({
    success: true,
    message: `Coupon "${code}" applied! (${coupon.description})`,
    discount: coupon.discount,
    code
  });
});

// POST /api/orders - Place a new meal order
// POST /api/orders - Place a new meal order
router.post('/', optionalAuth, (req, res) => {
  const {
    providerId,
    items,
    deliveryAddress,
    address,
    deliveryCity,
    city,
    deliveryLocality,
    locality,
    deliveryTime,
    mealSlot,
    deliveryDate,
    customerName,
    customerPhone,
    phone,
    notes,
    couponCode,
    paymentMethod = 'UPI'
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
  }

  const resolvedAddress = deliveryAddress || address || 'Ramganj & Subhash Nagar, Ajmer';
  const resolvedCity = deliveryCity || city || 'Ajmer';
  const resolvedLocality = deliveryLocality || locality || 'Ramganj';
  const resolvedPhone = customerPhone || phone || '+91 98290 12345';
  const resolvedCustomerName = customerName || 'Aarav Sharma';

  const store = db.get();
  const provider = store.providers.find(p => p.id === (providerId || items[0]?.providerId || 'prov_1'));

  // Server-side price calculation: verify each item price from database
  let calculatedSubtotal = 0;
  const verifiedItems = items.map(it => {
    const dish = store.menuItems.find(m => m.id === (it.menuItemId || it.id));
    const price = dish ? dish.price : (Number(it.price) || 99);
    const quantity = Math.max(1, Number(it.quantity || it.qty) || 1);
    calculatedSubtotal += price * quantity;
    return {
      menuItemId: dish ? dish.id : `dish_${Date.now()}`,
      name: dish ? dish.name : it.name,
      price,
      quantity,
      qty: quantity
    };
  });

  let discount = 0;
  if (couponCode && VALID_COUPONS[couponCode.trim().toUpperCase()]) {
    const coup = VALID_COUPONS[couponCode.trim().toUpperCase()];
    if (calculatedSubtotal >= coup.minOrder) {
      discount = coup.discount;
    }
  }

  const totalAmount = Math.max(0, calculatedSubtotal - discount);
  const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  const customerUser = req.user || store.users.find(u => u.role === 'CUSTOMER') || {
    id: 'usr_guest',
    name: resolvedCustomerName,
    phone: resolvedPhone
  };

  const newOrder = {
    id: newOrderId,
    orderNumber: newOrderId,
    customerId: customerUser.id,
    customerName: resolvedCustomerName,
    customerPhone: resolvedPhone,
    providerId: provider?.id || 'prov_1',
    providerName: provider?.businessName || 'Annapurna Homestyle Rasoi',
    items: verifiedItems,
    subtotal: calculatedSubtotal,
    discount,
    discountAmount: discount,
    couponCode: couponCode || null,
    deliveryFee: 0,
    packagingCost: 0,
    totalAmount,
    address: resolvedAddress,
    deliveryAddress: resolvedAddress,
    city: resolvedCity,
    deliveryCity: resolvedCity,
    locality: resolvedLocality,
    deliveryLocality: resolvedLocality,
    deliveryDate: deliveryDate || new Date().toISOString().split('T')[0],
    deliveryTime: deliveryTime || mealSlot || 'Lunch (12:30 PM)',
    paymentStatus: 'PAID',
    paymentMethod,
    orderStatus: 'PREPARING', // Direct initial active state
    statusStep: 2,
    notes: notes || '',
    rider: {
      name: 'Rahul Meena (Express Rider)',
      phone: '+91 98290 55555',
      vehicleNumber: 'RJ 14 ST 4821',
      rating: 4.9,
      currentLocation: 'Preparing in Kitchen Station #1'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.orders.unshift(newOrder);

  // Notify Provider
  if (provider) {
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: provider.userId,
      role: 'PROVIDER',
      title: 'New Meal Order Placed! 🔔',
      message: `${newOrder.customerName} placed order #${newOrder.id} for ₹${newOrder.totalAmount}.`,
      type: 'order',
      targetId: newOrder.id,
      actionUrl: '#orders',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  // Notify Customer
  store.notifications.unshift({
    id: `notif_${Date.now() + 1}`,
    userId: customerUser.id,
    role: 'CUSTOMER',
    title: 'Order Confirmed! 🍲',
    message: `Your order #${newOrder.id} is confirmed with ${newOrder.providerName}. Preparing fresh!`,
    type: 'order',
    targetId: newOrder.id,
    actionUrl: '#orders',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  if (store.adminStats) {
    store.adminStats.totalOrders = (store.adminStats.totalOrders || 0) + 1;
    store.adminStats.dailyRevenue = (store.adminStats.dailyRevenue || 0) + totalAmount;
    store.adminStats.monthlyRevenue = (store.adminStats.monthlyRevenue || 0) + totalAmount;
  }

  db.save(store);

  res.status(201).json({
    success: true,
    message: 'Tiffin order placed successfully! 🍲',
    data: newOrder
  });
});

// PUT /api/orders/:id/status - Update order status (ACCEPTED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
router.put('/:id/status', optionalAuth, (req, res) => {
  const { status, riderInfo } = req.body;
  const store = db.get();
  const order = store.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const validStatuses = [
    'PENDING',
    'CREATED',
    'ACCEPTED',
    'REJECTED',
    'COOKING',
    'PREPARING',
    'PACKED',
    'OUT_FOR_DELIVERY',
    'RIDER_OUT',
    'DELIVERED',
    'CANCELLED'
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  // Business rule: Cancelled orders cannot be marked as delivered
  if (order.orderStatus === 'CANCELLED' && status === 'DELIVERED') {
    return res.status(400).json({ success: false, message: 'Cancelled orders cannot be marked as delivered.' });
  }

  order.orderStatus = status;
  const stepMap = {
    PENDING: 0,
    CREATED: 0,
    ACCEPTED: 1,
    COOKING: 1,
    PREPARING: 1,
    PACKED: 2,
    OUT_FOR_DELIVERY: 3,
    RIDER_OUT: 3,
    DELIVERED: 4,
    REJECTED: 0,
    CANCELLED: 0
  };
  order.statusStep = stepMap[status] !== undefined ? stepMap[status] : 1;

  if (riderInfo) {
    order.rider = { ...(order.rider || {}), ...riderInfo };
  } else if (status === 'PACKED') {
    if (!order.rider) {
      order.rider = {
        name: 'Vikas Saini (Express Rider)',
        phone: '+91 98290 30001',
        vehicleNumber: 'RJ 14 EV 4022',
        rating: 4.95,
        currentLocation: 'Packed in 304 insulated steel dabba (70°C) • Ready for pickup'
      };
    }
  } else if (status === 'OUT_FOR_DELIVERY') {
    if (!order.rider) {
      order.rider = {
        name: 'Vikas Saini (Express Rider)',
        phone: '+91 98290 30001',
        vehicleNumber: 'RJ 14 EV 4022',
        rating: 4.95,
        currentLocation: '0.4 km away near locality entrance'
      };
    } else {
      order.rider.currentLocation = '0.4 km away near locality entrance';
    }
  } else if (status === 'DELIVERED' && order.rider) {
    order.rider.currentLocation = 'Delivered at Doorstep';
    order.deliveredAt = new Date().toISOString();
  }

  order.updatedAt = new Date().toISOString();

  // Notify customer of status change
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: order.customerId,
    role: 'CUSTOMER',
    title: `Order Status: ${status.replace(/_/g, ' ')} 🚴`,
    message: `Your order #${order.id} is now ${status.replace(/_/g, ' ')}.`,
    type: 'order',
    targetId: order.id,
    actionUrl: '#orders',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  db.save(store);

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: order
  });
});

// PATCH /api/orders/:id/advance-status - Simulation helper
router.patch('/:id/advance-status', (req, res) => {
  const store = db.get();
  const order = store.orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const steps = ['CREATED', 'COOKING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  let curIndex = steps.indexOf(order.orderStatus);
  if (curIndex === -1) {
    if (order.orderStatus === 'PENDING' || order.orderStatus === 'ACCEPTED') curIndex = 0;
    else if (order.orderStatus === 'PREPARING') curIndex = 1;
    else if (order.orderStatus === 'RIDER_OUT') curIndex = 3;
    else curIndex = 0;
  }

  if (curIndex < steps.length - 1) {
    curIndex++;
  } else {
    // Loop back to start if already delivered
    curIndex = 0;
  }

  order.orderStatus = steps[curIndex];
  order.statusStep = curIndex;

  if (!order.rider) {
    order.rider = {
      name: 'Rahul Meena (Express Rider)',
      phone: '+91 98290 55555',
      vehicleNumber: 'RJ 14 ST 4821',
      rating: 4.9,
      currentLocation: 'Preparing in Kitchen Station #1'
    };
  }

  if (order.orderStatus === 'CREATED') {
    order.rider.currentLocation = 'Kitchen station assigned & ingredients prepped';
  } else if (order.orderStatus === 'COOKING') {
    order.rider.currentLocation = 'Simmering in cold-pressed oil & pure cow ghee';
  } else if (order.orderStatus === 'PACKED') {
    order.rider.currentLocation = 'Packed in hot thermal steel dabba (70°C)';
  } else if (order.orderStatus === 'OUT_FOR_DELIVERY') {
    order.rider.currentLocation = '0.4 km away entering society gate';
  } else if (order.orderStatus === 'DELIVERED') {
    order.rider.currentLocation = 'Delivered at Doorstep - Enjoy your meal! 🍲';
  }

  order.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: `Order status advanced to ${order.orderStatus}`,
    data: order
  });
});

export default router;
