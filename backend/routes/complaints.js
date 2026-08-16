import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/complaints
router.get('/', optionalAuth, (req, res) => {
  const { customerId, providerId, status, priority } = req.query;
  const store = db.get();
  let list = [...(store.complaints || [])];

  if (req.user) {
    if (req.user.role === 'CUSTOMER') {
      list = list.filter(c => c.customerId === req.user.id);
    } else if (req.user.role === 'PROVIDER') {
      const prov = store.providers.find(p => p.userId === req.user.id);
      if (prov) {
        list = list.filter(c => c.providerId === prov.id);
      }
    }
  } else if (customerId) {
    list = list.filter(c => c.customerId === customerId);
  }

  if (providerId) {
    list = list.filter(c => c.providerId === providerId);
  }
  if (status && status !== 'all') {
    list = list.filter(c => c.status === status);
  }
  if (priority && priority !== 'all') {
    list = list.filter(c => c.priority === priority);
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/complaints/:id
router.get('/:id', (req, res) => {
  const store = db.get();
  const item = store.complaints.find(c => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }
  res.json({ success: true, data: item });
});

// POST /api/complaints - Customer raises complaint
router.post('/', optionalAuth, (req, res) => {
  const { providerId, orderId, subject, description, priority = 'MEDIUM', customerName, customerPhone } = req.body;

  if (!subject || !description) {
    return res.status(400).json({ success: false, message: 'Subject and description are required.' });
  }

  const store = db.get();
  const customer = req.user || (req.body.customerId ? { id: req.body.customerId, name: customerName || 'Aarav Sharma', phone: customerPhone || '+91 98290 12345' } : null) || store.users.find(u => u.role === 'CUSTOMER') || {
    id: req.body.customerId || 'usr_customer_1',
    name: customerName || 'Aarav Sharma',
    phone: customerPhone || '+91 98290 12345'
  };

  const provider = store.providers.find(p => p.id === (providerId || 'prov_1'));
  const newCmpId = `CMP-${Math.floor(100 + Math.random() * 900)}`;

  const newComplaint = {
    id: newCmpId,
    complaintNumber: newCmpId,
    customerId: customer.id || req.body.customerId || 'usr_customer_1',
    customerName: customerName || customer.name,
    customerPhone: customerPhone || customer.phone,
    providerId: provider?.id || 'prov_1',
    providerName: provider?.businessName || 'Annapurna Homestyle Rasoi',
    orderId: orderId || null,
    subject: subject.trim(),
    description: description.trim(),
    priority: ['LOW', 'MEDIUM', 'HIGH'].includes(priority) ? priority : 'MEDIUM',
    status: 'OPEN',
    resolutionNotes: 'Support team assigned. Resolution within 30 mins.',
    resolvedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.complaints.unshift(newComplaint);

  // Notify Admin
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: 'usr_admin',
    role: 'ADMIN',
    title: `New Support Complaint: ${newComplaint.id} ⚠️`,
    message: `${newComplaint.customerName} reported: "${subject.slice(0, 50)}..."`,
    type: 'complaint',
    targetId: newComplaint.id,
    actionUrl: '#admin-complaints',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  if (store.adminStats) {
    store.adminStats.totalComplaints = (store.adminStats.totalComplaints || 0) + 1;
    store.adminStats.openComplaints = (store.adminStats.openComplaints || 0) + 1;
  }

  db.save(store);

  res.status(201).json({
    success: true,
    message: 'Complaint submitted successfully. Our support desk will look into this promptly.',
    data: newComplaint
  });
});

// PUT /api/complaints/:id - Admin updates status / resolution
router.put('/:id', optionalAuth, (req, res) => {
  const { status, priority, resolutionNotes } = req.body;
  const store = db.get();
  const item = store.complaints.find(c => c.id === req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  if (status) {
    item.status = status;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      item.resolvedAt = new Date().toISOString();
      if (store.adminStats) {
        store.adminStats.openComplaints = Math.max(0, (store.adminStats.openComplaints || 1) - 1);
      }
    }
  }

  if (priority) item.priority = priority;
  if (resolutionNotes) item.resolutionNotes = resolutionNotes;
  item.updatedAt = new Date().toISOString();

  // Notify customer
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: item.customerId,
    role: 'CUSTOMER',
    title: `Complaint #${item.id} Status Updated: ${item.status}`,
    message: `Your issue "${item.subject}" has been marked as ${item.status}. ${resolutionNotes ? `Note: ${resolutionNotes}` : ''}`,
    type: 'complaint',
    targetId: item.id,
    actionUrl: '#complaints',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  db.save(store);

  res.json({
    success: true,
    message: `Complaint #${item.id} updated successfully!`,
    data: item
  });
});

export default router;
