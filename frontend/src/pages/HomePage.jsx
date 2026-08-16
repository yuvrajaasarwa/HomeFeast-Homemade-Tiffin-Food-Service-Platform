import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ChefHat,
  ShieldCheck,
  Star,
  ArrowRight,
  Heart,
  CheckCircle2,
  Calendar,
  Layers,
  Utensils,
  Award,
  PackageCheck,
  Users,
  Flame
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const HomePage = ({ onNavigate, onSelectProvider }) => {
  const {
    selectedCity,
    selectedLocality,
    setIsLocationModalOpen,
    setIsAuthModalOpen,
    setAuthModalTab,
    openPlanCheckout
  } = useAuth();
  const { addToast } = useToast();

  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const formattedCityName = selectedCity
    ? selectedCity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Jaipur';

  useEffect(() => {
    async function loadData() {
      try {
        const provRes = await api.getProviders({ city: selectedCity, limit: 6, sortBy: 'rating' });
        if (provRes.success) {
          setFeaturedProviders(provRes.data || []);
        }
        const plansRes = await api.getPlans({ limit: 3 });
        if (plansRes) {
          setFeaturedPlans(plansRes.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    }
    loadData();
  }, [selectedCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('kitchens');
  };

  const cuisines = [
    { name: 'North Indian', icon: '🍲', tag: 'Dal Tadka, Shahi Paneer, Phulkas' },
    { name: 'Rajasthani', icon: '🥘', tag: 'Dal Baati Churma, Gatte Ki Sabzi' },
    { name: 'Punjabi', icon: '🫓', tag: 'Rajma Chawal, Pindi Chole, Parathas' },
    { name: 'Satvik Jain', icon: '🍃', tag: 'No Onion, No Garlic Ayurvedic' },
    { name: 'Gujarati', icon: '🥣', tag: 'Khatti Meethi Dal, Theplas, Khichdi' },
    { name: 'South Indian', icon: '🥥', tag: 'Steamed Idlis, Podi Dosas, Sambar' },
    { name: 'Maharashtrian', icon: '🌾', tag: 'Pithla Bhakri, Varan Bhaat, Poha' },
    { name: 'Bengali', icon: '🍚', tag: 'Luchi, Chholar Dal, Aloo Posto' }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #FFF9F2 0%, #FAF8F5 100%)',
          borderBottom: '1px solid #EAE3D9',
          padding: '60px 16px 70px 16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            {/* Trust Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFFFFF',
                border: '1.5px solid #EAE3D9',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#DC2626',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                marginBottom: '16px'
              }}
            >
              <Sparkles size={16} color="#DC2626" />
              <span>100% Home Cooked • Zero Commercial Additives</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 900,
                color: '#1C1917',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '16px'
              }}
            >
              Homemade Food. <br />
              <span style={{ color: '#DC2626' }}>Made With Care.</span>
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: '#57534E',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '520px'
              }}
            >
              Discover fresh, hygienic and affordable homemade meals from trusted local cooks in {formattedCityName}. Subscribe to daily, weekly, or monthly healthy tiffins.
            </p>

            {/* Main Action CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
              <button
                onClick={() => onNavigate('kitchens')}
                className="btn btn-primary btn-lg"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: 800,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 6px 20px rgba(232, 89, 12, 0.35)'
                }}
              >
                <span>Find Homemade Food</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  setAuthModalTab('register');
                  setIsAuthModalOpen(true);
                }}
                className="btn btn-secondary btn-lg"
                style={{
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ChefHat size={18} color="#2B8A3E" />
                <span>Become a Home Cook</span>
              </button>
            </div>

            {/* Key Micro-Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#78716C', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#2B8A3E" />
                <span>FSSAI Verified Cooks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#2B8A3E" />
                <span>Stainless Steel Dabbas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#2B8A3E" />
                <span>Pause Dates Anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '28px',
                padding: '16px',
                border: '1px solid #EAE3D9',
                boxShadow: '0 20px 50px -10px rgba(232, 89, 12, 0.18)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', height: '340px', borderRadius: '20px', overflow: 'hidden' }}>
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Homestyle Thali"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.8) 0%, transparent 50%)' }} />

                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: '#FFFFFF' }}>
                  <span style={{ background: '#DC2626', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                    Today's Homestyle Special
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 2px 0' }}>Ghar Ki Shahi Thali & Fresh Phulkas</h3>
                  <p style={{ fontSize: '12px', opacity: 0.9 }}>Pure Desi Ghee • 4 Soft Phulkas • Dal Tadka • Paneer Gravy</p>
                </div>
              </div>

              {/* Floating Review Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-10px',
                  background: '#FFFFFF',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  border: '1px solid #EAE3D9',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ fontSize: '22px' }}>⭐</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '15px', color: '#1C1917' }}>4.96 / 5.0</div>
                  <div style={{ fontSize: '11px', color: '#78716C' }}>1,200+ Happy Tiffin Eaters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR REGIONAL CUISINES */}
      <section style={{ maxWidth: '1240px', margin: '60px auto 0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            AUTHENTIC FLAVORS
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>
            Popular Homemade Cuisines
          </h2>
          <p style={{ fontSize: '14px', color: '#78716C' }}>
            Explore traditional regional recipes prepared by authentic native home cooks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {cuisines.map(c => (
            <div
              key={c.name}
              onClick={() => onNavigate('kitchens')}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #EAE3D9',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#DC2626';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = '#EAE3D9';
              }}
            >
              <div style={{ fontSize: '32px', width: '50px', height: '50px', background: '#FFF9F2', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', margin: 0 }}>{c.name}</h3>
                <p style={{ fontSize: '11.5px', color: '#78716C', marginTop: '2px', lineHeight: 1.3 }}>{c.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED VERIFIED HOME COOKS */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              TRUSTED LOCAL TALENT
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>
              Featured Verified Home Cooks in {formattedCityName}
            </h2>
            <p style={{ fontSize: '14px', color: '#78716C' }}>
              Hand-picked home cooks with 4.9+ ratings and verified kitchen hygiene standards.
            </p>
          </div>

          <button
            onClick={() => onNavigate('kitchens')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px' }}
          >
            <span>View All Home Cooks</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {featuredProviders.map(prov => (
            <div
              key={prov.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                border: '1px solid #EAE3D9',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ position: 'relative', height: '180px', background: '#F3ECE2' }}>
                <img
                  src={prov.image}
                  alt={prov.businessName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: prov.mealType === 'veg' ? '#2B8A3E' : prov.mealType === 'jain' ? '#CA8A04' : '#DC2626',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  {prov.mealType === 'veg' ? 'Pure Veg' : prov.mealType === 'jain' ? 'Pure Jain' : 'Mixed'}
                </span>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: '#1C1917',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                  <span>{prov.rating}</span>
                  <span style={{ color: '#78716C', fontWeight: 500 }}>({prov.totalReviews})</span>
                </div>
              </div>

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', margin: '0 0 4px 0' }}>
                  {prov.businessName}
                </h3>
                <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700, marginBottom: '6px' }}>
                  Cook {prov.ownerName} • {prov.area}
                </div>
                <p style={{ fontSize: '12.5px', color: '#57534E', lineHeight: 1.5, flexGrow: 1, marginBottom: '14px' }}>
                  {prov.description?.slice(0, 95)}...
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FAF8F5', paddingTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#78716C' }}>Starts at</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#1C1917' }}>₹{prov.startingPrice} <span style={{ fontSize: '11px', fontWeight: 500 }}>/ meal</span></div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectProvider) onSelectProvider(prov.id);
                      else onNavigate('kitchens');
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px' }}
                  >
                    View Menu & Passes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW HOMEFEAST WORKS */}
      <section style={{ maxWidth: '1240px', margin: '80px auto 0 auto', padding: '0 16px' }}>
        <div style={{ background: '#FAF8F5', borderRadius: '28px', border: '1px solid #EAE3D9', padding: '48px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              DIGITIZED TIFFIN MANAGEMENT
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', margin: '4px 0' }}>
              How HomeFeast Works
            </h2>
            <p style={{ fontSize: '14px', color: '#78716C' }}>
              Say goodbye to messy WhatsApp orders and daily phone call hassles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Discover Local Cooks',
                desc: 'Select your city & locality to browse verified home cooks, transparent menus, hygiene audits, and customer ratings.',
                icon: Search
              },
              {
                step: '02',
                title: 'Choose Meal or Pass',
                desc: 'Order a single hot meal or subscribe to flexible Daily, Weekly (7-day), or Monthly (30-day) tiffin passes.',
                icon: Calendar
              },
              {
                step: '03',
                title: 'Daily Hot Doorstep Delivery',
                desc: 'Freshly prepared food is sealed hot in insulated food-grade 304 stainless steel dabbas and delivered right on time.',
                icon: PackageCheck
              }
            ].map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #EAE3D9',
                    padding: '24px',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#FECACA', position: 'absolute', top: '16px', right: '16px' }}>
                    {item.step}
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COOK ONBOARDING CTA BANNER */}
      <section style={{ maxWidth: '1240px', margin: '70px auto 0 auto', padding: '0 16px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)',
            borderRadius: '28px',
            padding: '48px 36px',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ background: '#2B8A3E', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
              Empowering Homemakers
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 900, marginTop: '8px', lineHeight: 1.2 }}>
              Are you passionate about cooking? <br />
              <span style={{ color: '#F59E0B' }}>Join HomeFeast as a Partner Cook</span>
            </h2>
            <p style={{ fontSize: '14px', opacity: 0.85, margin: '12px 0 24px 0', lineHeight: 1.6 }}>
              Turn your culinary magic into a respected digital business. Reach students, working professionals, and families in your locality. We manage orders, schedules, and digital payments for you.
            </p>

            <button
              onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)'
              }}
            >
              <ChefHat size={18} />
              <span>Register Your Home Kitchen</span>
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B', marginBottom: '14px' }}>Cook Partner Benefits</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#2B8A3E" />
                <span>Zero listing fees • Keep 100% control of your menu</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#2B8A3E" />
                <span>Predictable daily meal counts via subscription passes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#2B8A3E" />
                <span>Admin hygiene verification & FSSAI assistance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#2B8A3E" />
                <span>Weekly direct bank payouts with real-time earnings</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
