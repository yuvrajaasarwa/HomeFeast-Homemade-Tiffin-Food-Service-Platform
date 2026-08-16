import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote, MessageSquarePlus } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadReviews() {
      const data = await api.getReviews();
      if (data) {
        setReviews(data);
      }
    }
    loadReviews();
  }, []);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newAuthor || !newReviewText) {
      addToast('Please enter your name and review!', 'error');
      return;
    }

    const payload = {
      author: newAuthor,
      role: newRole || 'Food Connoisseur',
      rating: newRating,
      review: newReviewText,
      verifiedMeal: 'Daily Homestyle Thali',
      favoriteDish: 'Dal Makhani & Butter Phulkas'
    };

    try {
      const res = await fetch('/api/admin/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
        setNewAuthor('');
        setNewRole('');
        setNewReviewText('');
        setShowReviewForm(false);
        addToast('Thank you! Your review has been published ✨', 'success');
      }
    } catch (err) {
      addToast('Error submitting review', 'error');
    }
  };

  return (
    <section className="reviews-section" style={{ padding: '80px 0', background: '#FFFFFF' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Loved by 45,000+ Customers</span>
          <h2 className="section-title">What Ghar-Ka-Khana Lovers Say</h2>
          <p className="section-subtitle">
            From busy software engineers to doctors and students—hear how HomeFast brings the warmth of home back to their dining table.
          </p>
        </div>

        {/* Rating Overview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            background: 'var(--bg-surface-soft)',
            padding: '24px 32px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '40px',
            border: '1px solid var(--border-light)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>4.92</div>
            <div>
              <div style={{ display: 'flex', gap: '3px', color: '#F59E0B', marginBottom: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Based on 3,840+ verified tiffin subscriptions
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            <MessageSquarePlus size={16} />
            <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Optional Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleAddReview}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              marginBottom: '36px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Share Your Experience</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Profession / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Product Designer"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Rating (1-5 Stars)</label>
                <select
                  value={newRating}
                  onChange={e => setNewRating(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Great)</option>
                  <option value={3}>⭐⭐⭐ (3 - Good)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Your Review</label>
              <textarea
                rows={3}
                placeholder="Tell us what you loved about the food, delivery, or pause dates..."
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm">
              Submit Customer Review
            </button>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="card-clean"
              style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{rev.author}</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>{rev.role}</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', color: '#F59E0B' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                  <CheckCircle size={11} />
                  {rev.verifiedMeal || 'Verified Subscriber'}
                </span>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px', flexGrow: 1 }}>
                "{rev.review}"
              </p>

              {rev.favoriteDish && (
                <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  🍲 Favorite Dish: <strong>{rev.favoriteDish}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
