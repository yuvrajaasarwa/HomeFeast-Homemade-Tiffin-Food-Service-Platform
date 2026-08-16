import React, { useState } from 'react';
import { X, Star, Sparkles, ChefHat, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const ReviewModal = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, activeModalData, user } = useAuth();
  const { addToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [favoriteDish, setFavoriteDish] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isReviewModalOpen) return null;

  const providerName = activeModalData?.providerName || 'Home Cook';
  const providerId = activeModalData?.providerId || 'prov_1';
  const orderId = activeModalData?.orderId || activeModalData?.id || null;
  const verifiedMeal = activeModalData?.verifiedMeal || activeModalData?.planName || 'Homestyle Thali';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('Please write a few words about your meal experience.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitReview({
        providerId,
        orderId,
        rating,
        comment,
        verifiedMeal,
        favoriteDish: favoriteDish || 'Ghar Ki Shahi Thali',
        authorName: user?.name || 'Aarav Sharma',
        customerId: user?.id || 'usr_customer_1'
      });

      if (res.success) {
        addToast('Review submitted! Thank you for supporting local home cooks. ⭐', 'success');
        // Broadcast custom event so Customer Hub immediately reflects the new review in My Reviews tab
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('homefeast_review_submitted', { detail: res.data || res.review }));
        }
        setIsReviewModalOpen(false);
        setComment('');
        setFavoriteDish('');
      } else {
        addToast(res.message || 'Could not submit review.', 'error');
      }
    } catch (err) {
      addToast('Network error submitting review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsReviewModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EAB308 100%)', padding: '24px', color: '#FFFFFF', position: 'relative' }}>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ChefHat size={26} />
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: '12px' }}>
              Rate Home Cook
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Review {providerName}</h2>
          <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            Verified Order: {verifiedMeal} {orderId ? `(#${orderId})` : ''}
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Interactive Star Rating */}
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#57534E', marginBottom: '10px' }}>
              How was the taste & quality of the meal?
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star
                    size={32}
                    color={(hoverRating || rating) >= star ? '#EAB308' : '#EAE3D9'}
                    fill={(hoverRating || rating) >= star ? '#EAB308' : 'none'}
                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', marginTop: '8px' }}>
              {ratingLabels[hoverRating || rating]}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
              Your Review & Compliments <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tell other students and professionals what you loved about the spices, soft rotis, cleanliness, or hot steel dabba delivery..."
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {/* Favorite Dish Field */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
              Favorite Dish from this Meal (Optional)
            </label>
            <input
              type="text"
              value={favoriteDish}
              onChange={e => setFavoriteDish(e.target.value)}
              placeholder="e.g. Desi Ghee Phulkas, Dal Tadka, Paneer Bhurji"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit CTA */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF',
                color: '#57534E',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC2626 0%, #EAB308 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(232, 89, 12, 0.3)'
              }}
            >
              <Sparkles size={18} />
              <span>{submitting ? 'Submitting...' : 'Publish Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
