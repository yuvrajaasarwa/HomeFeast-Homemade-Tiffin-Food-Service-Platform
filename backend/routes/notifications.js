import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', optionalAuth, (req, res) => {
  const store = db.get();
  let list = store.notifications || [];

  if (req.user) {
    list = list.filter(n =>
      n.userId === req.user.id ||
      n.role === req.user.role ||
      n.userId === 'all' ||
      !n.userId ||
      (req.user.role === 'ADMIN')
    );
  }

  res.json({
    success: true,
    data: list.slice(0, 30),
    unreadCount: list.filter(n => !n.isRead).length
  });
});

// PATCH /api/notifications/:id/read - Mark one notification as read
router.patch('/:id/read', (req, res) => {
  const store = db.get();
  const notif = store.notifications.find(n => n.id === req.params.id);

  if (notif) {
    notif.isRead = true;
    db.save(store);
  }

  res.json({
    success: true,
    message: 'Notification marked as read.',
    data: notif
  });
});

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', optionalAuth, (req, res) => {
  const store = db.get();
  (store.notifications || []).forEach(n => {
    if (!req.user || n.userId === req.user.id || n.role === req.user.role || req.user.role === 'ADMIN') {
      n.isRead = true;
    }
  });

  db.save(store);

  res.json({
    success: true,
    message: 'All notifications marked as read.'
  });
});

export default router;

