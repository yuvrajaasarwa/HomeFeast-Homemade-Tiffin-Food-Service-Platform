import React from 'react';
import { ShieldCheck, Droplets, Thermometer, Sparkles, Award, UtensilsCrossed, HeartHandshake } from 'lucide-react';

export const HygienePromise = () => {
  const safetyCards = [
    {
      icon: <ShieldCheck size={26} />,
      title: 'FSSAI Certified Kitchens',
      badge: 'Lic. 10022011000843',
      desc: '100% compliant with Central Food Safety standards. Daily automated temperature and ingredient quality checks.'
    },
    {
      icon: <Droplets size={26} />,
      title: 'Multi-Stage RO Cookware',
      badge: '100% Pure Water',
      desc: 'All lentils, rice, vegetables, and gravies are cooked exclusively using commercial-grade 7-stage purified RO water.'
    },
    {
      icon: <UtensilsCrossed size={26} />,
      title: 'Zero Plastic Steel Dabbas',
      badge: '304 Food Grade',
      desc: 'Hot meals are dispatched in insulated stainless steel tiffins that retain steam heat for 2.5+ hours without toxic microplastics.'
    },
    {
      icon: <HeartHandshake size={26} />,
      title: 'Fresh Bilona Desi Ghee',
      badge: 'No Palm Oil',
      desc: 'We cook our rotis and dal tadka in pure Gir cow ghee and cold-pressed mustard oil with zero added synthetic sodas.'
    }
  ];

  return (
    <section id="hygiene" className="hygiene-section">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Hygiene First Philosophy</span>
          <h2 className="section-title">The HomeFeast Clean Kitchen Promise</h2>
          <p className="section-subtitle">
            We cook food the exact same way our mothers do at home—clean, pure, transparent, and with deep respect for health.
          </p>
        </div>

        {/* Hygiene Metric Bar */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Kitchen Audit Score</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>99.4%</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rated A+ by Independent Labs</span>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Cooking Medium</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Desi Ghee & Mustard</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>0% Reheated Palm Oils</span>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Thermal Retention</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>65°C+</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Piping Hot at Doorstep</span>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>Daily Quality Inspection</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>6:00 AM Daily</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Farm Fresh Vegetable Batches</span>
          </div>
        </div>

        {/* Cards */}
        <div className="hygiene-grid">
          {safetyCards.map((card, idx) => (
            <div key={idx} className="hygiene-card">
              <div className="hygiene-icon-wrap">{card.icon}</div>
              <span className="badge badge-success" style={{ marginBottom: '10px' }}>
                {card.badge}
              </span>
              <h3 className="hygiene-card-title">{card.title}</h3>
              <p className="hygiene-card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
