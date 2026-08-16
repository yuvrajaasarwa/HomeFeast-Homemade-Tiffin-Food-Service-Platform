import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Flame, ArrowRight, Star, Clock, ChefHat, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const HeroSection = ({ onExploreMenu, onCustomThali }) => {
  const { addItem } = useCart();
  const { selectedCity, setIsLocationModalOpen } = useAuth();

  const formattedCityName = selectedCity
    ? selectedCity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Jaipur';

  const featuredQuickMeal = {
    id: 'sat-l-1',
    name: 'Royal Homestyle Deluxe Thali',
    diet: 'veg',
    price: 199,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    items: ['4 Desi Ghee Phulkas / Rotis', 'Shahi Dal Makhani / Panchmel Dal', 'Paneer Butter Masala / Seasonal Sabzi', 'Jeera Rice & Gulab Jamun', 'Salad & Roasted Papad']
  };

  return (
    <section className="hero-wrapper">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column */}
          <div>
            <div className="hero-badge-row">
              <span className="badge badge-primary">
                <Flame size={13} />
                Now Serving Jaipur, Ajmer & Kishangarh
              </span>
              <span className="badge badge-accent">
                <Sparkles size={13} />
                20-30 min Express Hot Dispatch
              </span>
            </div>

            <h1 className="hero-title">
              Ghar Jaisa Swad, <br />
              <span className="highlight">Har Din Fast</span> Delivery.
            </h1>

            <p className="hero-desc">
              Authentic homestyle regional thalis delivered piping hot in <strong>304 insulated stainless steel dabbas</strong> across <strong>{formattedCityName}</strong>, Ajmer & Kishangarh. Zero palm oil, 100% RO water, and pure motherly love.
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg" onClick={onExploreMenu}>
                <span>Order Today's Thali</span>
                <ArrowRight size={18} />
              </button>

              <button className="btn btn-secondary btn-lg" onClick={onCustomThali}>
                <span>🍱 Build Custom Dabba</span>
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setIsLocationModalOpen(true)}
                style={{ border: '1.5px dashed var(--primary)' }}
              >
                <MapPin size={16} color="var(--primary)" />
                <span>Switch City / Locality</span>
              </button>
            </div>

            {/* Trust Bar */}
            <div className="hero-trust-bar">
              <div className="trust-item">
                <div className="trust-item-icon">
                  <Star size={18} fill="currentColor" />
                </div>
                <div className="trust-item-text">
                  <span className="trust-item-val">4.95 ★</span>
                  <span className="trust-item-lbl">28,000+ Verified Dabbas</span>
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-item-icon">
                  <ChefHat size={18} />
                </div>
                <div className="trust-item-text">
                  <span className="trust-item-val">30+ Hubs</span>
                  <span className="trust-item-lbl">Jaipur • Ajmer • Kishangarh</span>
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-item-icon">
                  <Clock size={18} />
                </div>
                <div className="trust-item-text">
                  <span className="trust-item-val">20-30 Mins</span>
                  <span className="trust-item-lbl">Guaranteed Hot Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Showcase Card */}
          <div className="hero-card-preview">
            <div className="hero-main-card">
              <div className="hero-img-container">
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="Royal Homestyle Thali"
                />
                <div className="hero-live-badge">
                  <span>Cooking Live at {formattedCityName} Kitchen Hub</span>
                </div>
              </div>

              <div className="hero-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Dal Baati Churma & Gatte Thali</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>3 Baatis in Ghee + Panchmel Dal + Gatte Ki Sabzi + Churma + Chaas</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>₹199</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textDecoration: 'line-through' }}>₹239</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flexGrow: 1 }}
                    onClick={() => addItem(featuredQuickMeal)}
                  >
                    Quick Add to Dabba
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={onExploreMenu}
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Tag */}
            <div className="hero-float-tag">
              <span style={{ fontSize: '24px' }}>🍲</span>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-main)' }}>Hot Steel Dabba</strong>
                <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>Zero Plastic Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
