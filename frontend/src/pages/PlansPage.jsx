import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const PlansPage = ({ onBack, onNavigateToPass }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCity, openPlanCheckout } = useAuth();

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      const data = await api.getPlans();
      if (data) {
        setPlans(data);
      }
      setLoading(false);
    }
    loadPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (openPlanCheckout) {
      openPlanCheckout(plan);
    }
  };

  const handlePlanActivated = (newSubscription) => {
    setIsCheckoutOpen(false);
    if (onNavigateToPass) {
      onNavigateToPass();
    } else {
      window.location.hash = 'my-pass';
    }
  };

  return (
    <div style={{ padding: '32px 0 100px', background: '#FFFFFF', minHeight: '90vh' }}>
      <div className="container">
        {/* Breadcrumb Back */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Explore</span>
          </button>

          <span className="badge badge-primary">
            📍 Serving {(selectedCity || 'Jaipur').toUpperCase()}
          </span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
          <span className="section-tag">Flexible Meal Passes</span>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginTop: '6px' }}>
            HomeFeast Subscription Passes
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)' }}>
            Choose your meal duration. Enjoy home-cooked Rajasthani & North Indian food every day with <strong>Zero-Penalty Pause Guarantee</strong>.
          </p>
        </div>

        {/* Pause Guarantee Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, #FEF2F2 0%, #FEF9C3 100%)',
            border: '1.5px solid rgba(220, 38, 38, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 24px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Calendar size={28} color="var(--primary)" />
            <div>
              <strong style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>
                100% Flexible Pause & Resume Guarantee
              </strong>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Going out of station? Pause your tiffin on any dates in 1-tap. Your meal credits get automatically extended!
              </div>
            </div>
          </div>
          <span className="badge badge-primary">Zero Lock-In</span>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading subscription passes...</div>
        ) : (
          <div className="plans-grid">
            {plans.map(plan => (
              <div
                key={plan.id}
                className="plan-card"
              >
                {plan.popular && (
                  <span className="plan-badge-top">Most Popular</span>
                )}

                <div className="plan-header">
                  <span className="badge badge-accent" style={{ marginBottom: '8px' }}>
                    {plan.badge || (plan.planType ? `${plan.planType} PASS` : 'BEST VALUE')}
                  </span>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline || plan.description}</p>
                </div>

                <div className="plan-pricing-box">
                  <div className="plan-price-large">
                    ₹{plan.pricePerMeal || Math.round((plan.price || plan.totalPrice || 99) / (plan.durationDays || 1))}
                    <span style={{ fontSize: '14px', color: 'var(--text-subtle)', fontWeight: 500 }}> / meal</span>
                  </div>
                  <div className="plan-price-sub">
                    Total: ₹{plan.totalPrice || plan.price} ({plan.durationDays || plan.duration || 1} {(plan.durationDays || plan.duration || 1) === 1 ? 'Meal' : 'Meals'})
                  </div>
                  {plan.savings && <span className="plan-savings-pill">{plan.savings}</span>}
                </div>

                {/* Features */}
                <ul className="plan-features-list">
                  {(plan.features || plan.includedMenuItems || [
                    'Fresh Daily Delivery',
                    'Insulated Steel Dabba',
                    'Pause / Resume Anytime'
                  ]).map((feat, idx) => (
                    <li key={idx} className="plan-feature-item">
                      <Check size={16} className="plan-feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn btn-lg plan-cta-btn"
                  style={{ width: '100%' }}
                  onClick={() => handleSelectPlan(plan)}
                >
                  <span>Select {plan.name}</span>
                  <ArrowRight size={16} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11.5px', color: 'var(--text-subtle)' }}>
                  Ideal for: {plan.idealFor}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
