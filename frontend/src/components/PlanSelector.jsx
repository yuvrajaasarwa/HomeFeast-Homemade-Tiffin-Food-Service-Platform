import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Shield, Calendar, ArrowRight } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const PlanSelector = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, openPlanCheckout } = useAuth();
  const { addToast } = useToast();

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

  return (
    <section id="subscription-plans" className="plans-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Flexible Meal Passes</span>
          <h2 className="section-title">Save Big with HomeFast Pass</h2>
          <p className="section-subtitle">
            Say goodbye to daily ordering stress. Enjoy hassle-free daily ghar-ka-khana with our <strong>100% Flexible Pause & Resume</strong> guarantee.
          </p>
        </div>

        {/* Guarantee Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, #FEF2F2 0%, #FEF9C3 100%)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 24px',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} color="var(--primary)" />
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Going out of town? Never lose a single meal!</strong>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Pause your tiffin delivery on any dates with 1-click in the app. Your days get automatically extended.
              </div>
            </div>
          </div>
          <span className="badge badge-primary">Zero Penalty Pause</span>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading subscription plans...</div>
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
                    {plan.badge}
                  </span>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>

                <div className="plan-pricing-box">
                  <div className="plan-price-large">
                    ₹{plan.pricePerMeal}
                    <span style={{ fontSize: '14px', color: 'var(--text-subtle)', fontWeight: 500 }}> / meal</span>
                  </div>
                  <div className="plan-price-sub">
                    Total: ₹{plan.totalPrice} for {plan.durationDays} {plan.durationDays === 1 ? 'Meal' : 'Days'}
                  </div>
                  <span className="plan-savings-pill">{plan.savings}</span>
                </div>

                {/* Features */}
                <ul className="plan-features-list">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="plan-feature-item">
                      <Check size={16} className="plan-feature-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn btn-lg plan-cta-btn"
                  style={{ width: '100%' }}
                  onClick={() => (onSelectPlan ? onSelectPlan(plan) : openPlanCheckout(plan))}
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
    </section>
  );
};
