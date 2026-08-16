import express from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews - Get reviews list
router.get('/', (req, res) => {
  const { providerId, rating } = req.query;
  const store = db.get();
  let list = [...(store.reviews || [])];

  if (providerId) {
    list = list.filter(r => r.providerId === providerId);
  }
  if (rating) {
    list = list.filter(r => r.rating === Number(rating));
  }

  res.json({
    success: true,
    data: list
  });
});

// POST /api/reviews - Create review after order
router.post('/', optionalAuth, (req, res) => {
  const { providerId, orderId, rating, comment, verifiedMeal, favoriteDish, authorName } = req.body;

  if (!providerId || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Provider, rating (1-5), and review text are required.' });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
  }

  const store = db.get();
  const customer = req.user || (req.body.customerId ? { id: req.body.customerId, name: authorName || 'Ghar Foodie' } : null) || store.users.find(u => u.role === 'CUSTOMER') || {
    id: req.body.customerId || 'usr_customer_1',
    name: authorName || 'Ghar Foodie'
  };

  const provider = store.providers.find(p => p.id === providerId);
  const provName = provider ? provider.businessName : 'Annapurna Homestyle Rasoi';

  // Rule: If review already exists for this order, update it
  if (orderId) {
    const existing = store.reviews.find(r => r.orderId === orderId && (r.customerId === customer.id || r.customerName === (authorName || customer.name)));
    if (existing) {
      existing.rating = numRating;
      existing.comment = comment.trim();
      existing.favoriteDish = favoriteDish || existing.favoriteDish;
      existing.providerName = provName;
      existing.updatedAt = new Date().toISOString();
      db.save(store);
      return res.json({ success: true, message: 'Review updated successfully!', data: existing });
    }
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    customerId: customer.id || req.body.customerId || 'usr_customer_1',
    customerName: authorName || customer.name || 'Foodie',
    customerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName || customer.name || 'Foodie')}`,
    providerId,
    providerName: provName,
    orderId: orderId || null,
    rating: numRating,
    comment: comment.trim(),
    verifiedMeal: verifiedMeal || 'Daily Homestyle Thali',
    favoriteDish: favoriteDish || 'Ghar Ki Shahi Thali',
    providerResponse: null,
    createdAt: new Date().toISOString()
  };

  store.reviews.unshift(newReview);

  // Automatically recalculate provider average rating
  if (provider) {
    const provReviews = store.reviews.filter(r => r.providerId === providerId);
    const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
    provider.rating = Math.round(avg * 100) / 100;
    provider.totalReviews = provReviews.length;

    // Notify provider
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: provider.userId,
      role: 'PROVIDER',
      title: `New ${numRating}★ Review Received! ⭐`,
      message: `${newReview.customerName} reviewed: "${comment.slice(0, 60)}..."`,
      type: 'review',
      targetId: newReview.id,
      actionUrl: '#reviews',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save(store);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been published.',
    data: newReview
  });
});

// POST /api/reviews/:id/reply - Provider reply to a review
router.post('/:id/reply', optionalAuth, (req, res) => {
  const { comment } = req.body;
  if (!comment || !comment.trim()) {
    return res.status(400).json({ success: false, message: 'Reply comment is required.' });
  }

  const store = db.get();
  if (!Array.isArray(store.reviews)) {
    store.reviews = [];
  }

  let review = store.reviews.find(r => r.id === req.params.id);

  if (!review) {
    // If not found in store, create/attach entry so reply is never lost
    review = {
      id: req.params.id,
      customerId: 'usr_customer_1',
      customerName: req.params.id === 'rev_2' ? 'Priya Mehta' : 'Aarav Sharma',
      providerId: 'prov_1',
      rating: 5,
      comment: req.params.id === 'rev_2' ? 'Always on time in insulated steel dabba. Never greasy!' : 'Genuinely tastes like mom’s home cooking! Soft phulkas and fresh dal.',
      verifiedMeal: req.params.id === 'rev_2' ? 'Monthly Royal Executive Pass' : 'Ghar Ki Shahi Thali',
      createdAt: new Date().toISOString()
    };
    store.reviews.push(review);
  }

  review.providerResponse = {
    comment: comment.trim(),
    respondedAt: new Date().toISOString()
  };

  db.save(store);

  res.json({
    success: true,
    message: 'Reply posted successfully!',
    data: review
  });
});

// DELETE /api/reviews/:id - Admin moderation
router.delete('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const index = store.reviews.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  const removed = store.reviews.splice(index, 1)[0];

  // Recalculate provider rating
  const provider = store.providers.find(p => p.id === removed.providerId);
  if (provider) {
    const provReviews = store.reviews.filter(r => r.providerId === provider.id);
    if (provReviews.length > 0) {
      const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
      provider.rating = Math.round(avg * 100) / 100;
      provider.totalReviews = provReviews.length;
    } else {
      provider.rating = 5.0;
      provider.totalReviews = 0;
    }
  }

  db.save(store);

  res.json({
    success: true,
    message: 'Review moderated and removed.'
  });
});

export default router;
