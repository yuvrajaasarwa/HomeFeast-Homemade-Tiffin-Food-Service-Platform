import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Heart,
  MessageSquare,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Phone,
  Flame,
  Info
} from 'lucide-react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProviderProfilePage = ({ providerId, onBack, onOpenThaliBuilder }) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'plans' | 'reviews' | 'about'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { addItem, items } = useCart();
  const { openPlanCheckout, openReviewModal, user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    async function loadProvider() {
      try {
        setLoading(true);
        const data = await api.getProvider(providerId || 'prov_1');
        if (data) {
          setProvider(data);
        }
      } catch (err) {
        console.error('Error loading provider profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProvider();
  }, [providerId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍲</div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917' }}>Loading Homestyle Kitchen Profile...</h3>
      </div>
    );
  }

  if (!provider) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '30px', textAlign: 'center', background: '#FFFFFF', borderRadius: '24px' }}>
        <h2>Home Cook Not Found</h2>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '16px' }}>Back to Discovery</button>
      </div>
    );
  }

  const menu = provider.menu || [];
  const plans = provider.mealPlans || [];
  const reviews = provider.reviews || [];

  const categories = ['all', ...new Set(menu.map(m => m.category).filter(Boolean))];
  const filteredMenu = selectedCategory === 'all' ? menu : menu.filter(m => m.category === selectedCategory);

  // Calculate rating breakdown
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '9999px',
          border: '1.5px solid #EAE3D9',
          background: '#FFFFFF',
          color: '#57534E',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to All Cooks</span>
      </button>

      {/* Provider Hero Banner */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EAE3D9',
          boxShadow: '0 8px 30px -4px rgba(28, 25, 23, 0.06)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        <div style={{ position: 'relative', height: '240px', background: '#1C1917' }}>
          <img
            src={provider.image}
            alt={provider.businessName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,25,23,0.95) 0%, rgba(28,25,23,0.3) 60%, transparent 100%)' }} />

          {/* Verification Badge */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#2B8A3E',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <ShieldCheck size={16} />
              <span>FSSAI Verified Home Cook</span>
            </span>
          </div>

          {/* Cook Bio Summary on Banner */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: '#DC2626', color: '#FFFFFF', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                {provider.mealType === 'veg' ? 'Pure Veg' : provider.mealType === 'jain' ? 'Pure Jain' : 'Veg & Non-Veg'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                ★ {provider.rating} ({provider.totalReviews} reviews)
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
              {provider.businessName}
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px', maxWidth: '700px' }}>
              By Home Cook {provider.ownerName} • {provider.cuisines?.join(' • ')}
            </p>
          </div>
        </div>

        {/* Quick Details Ribbon */}
        <div
          style={{
            padding: '18px 24px',
            background: '#FAF8F5',
            borderTop: '1px solid #EAE3D9',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} color="#E8590C" />
            <div>
              <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>Kitchen Location</div>
              <div style={{ fontWeight: 800, color: '#1C1917' }}>{provider.area}, {provider.city?.toUpperCase()}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="#E8590C" />
            <div>
              <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>Daily Lunch Slot</div>
              <div style={{ fontWeight: 800, color: '#1C1917' }}>{provider.deliveryTimings?.lunch || '12:15 PM - 01:45 PM'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={18} color="#2B8A3E" />
            <div>
              <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>Hygiene Standard</div>
              <div style={{ fontWeight: 800, color: '#2B8A3E' }}>{provider.hygieneScore || '99.4%'} Audit Score</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#EAB308" />
            <div>
              <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>Starting Price</div>
              <div style={{ fontWeight: 800, color: '#DC2626' }}>₹{provider.startingPrice} / meal</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #EAE3D9', marginBottom: '24px' }}>
        {[
          { id: 'menu', label: `Homestyle Menu (${menu.length})`, icon: ChefHat },
          { id: 'plans', label: `Tiffin Passes (${plans.length})`, icon: Calendar },
          { id: 'reviews', label: `Reviews & Ratings (${reviews.length})`, icon: Star },
          { id: 'about', label: 'Kitchen & Service Area', icon: Info }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #DC2626' : '3px solid transparent',
                color: isActive ? '#DC2626' : '#57534E',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#DC2626' : '#78716C'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: selectedCategory === cat ? '1.5px solid #DC2626' : '1.5px solid #EAE3D9',
                  background: selectedCategory === cat ? '#FEF2F2' : '#FFFFFF',
                  color: selectedCategory === cat ? '#DC2626' : '#57534E',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {cat === 'all' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredMenu.map(dish => {
              const cartItem = items.find(it => it.id === dish.id);
              const qtyInCart = cartItem?.qty || 0;

              return (
                <div
                  key={dish.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #EAE3D9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px -2px rgba(28, 25, 23, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ position: 'relative', height: '180px', background: '#F3ECE2' }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: dish.mealType === 'veg' ? '#2B8A3E' : dish.mealType === 'jain' ? '#D97706' : '#DC2626',
                        color: '#FFFFFF',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}
                    >
                      {dish.mealType === 'veg' ? 'Pure Veg' : dish.mealType === 'jain' ? 'Satvik Jain' : 'Non-Veg'}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(28, 25, 23, 0.85)',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      🔥 {dish.calories} kcal • {dish.protein} protein
                    </span>
                  </div>

                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', margin: 0 }}>
                        {dish.name}
                      </h3>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#DC2626' }}>
                        ₹{dish.price}
                      </div>
                    </div>

                    <p style={{ fontSize: '12.5px', color: '#57534E', lineHeight: 1.5, flexGrow: 1, marginBottom: '14px' }}>
                      {dish.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FAF8F5', paddingTop: '12px' }}>
                      <div style={{ fontSize: '11.5px', color: '#78716C', fontWeight: 600 }}>
                        ⏱️ {dish.preparationTime || '15-20 mins'}
                      </div>

                      {qtyInCart > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', borderRadius: '10px', padding: '4px 8px' }}>
                          <button
                            onClick={() => addItem(dish, -1, provider)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', background: '#DC2626', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#DC2626', minWidth: '16px', textAlign: 'center' }}>
                            {qtyInCart}
                          </span>
                          <button
                            onClick={() => addItem(dish, 1, provider)}
                            style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', background: '#DC2626', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(dish, 1, provider)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                          }}
                        >
                          <Plus size={15} />
                          <span>Add to Dabba</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div>
          <div style={{ marginBottom: '20px', background: '#FFF1F2', padding: '16px 20px', borderRadius: '16px', border: '1px solid #FECACA' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', marginBottom: '4px' }}>
              🌟 Flexible Daily, Weekly & Monthly Meal Subscriptions
            </h3>
            <p style={{ fontSize: '13px', color: '#57534E' }}>
              Subscribe directly to {provider.ownerName}’s kitchen. Get free hot delivery in insulated steel tiffins with full pause date flexibility.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {plans.map(plan => {
              const duration = plan.durationDays || (plan.planType === 'DAILY' ? 1 : plan.planType === 'WEEKLY' ? 7 : 30);
              const perMeal = Math.round(plan.price / duration);

              return (
                <div
                  key={plan.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: plan.planType === 'MONTHLY' ? '2px solid #DC2626' : '1px solid #EAE3D9',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 6px 24px -4px rgba(28, 25, 23, 0.07)',
                    position: 'relative'
                  }}
                >
                  {plan.planType === 'MONTHLY' && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                        color: '#FFFFFF',
                        padding: '4px 14px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Best Value Pass
                    </span>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {plan.planType} PASS
                      </span>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', marginTop: '2px' }}>
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <div style={{ margin: '12px 0 16px 0' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917' }}>
                      ₹{plan.price}
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#78716C' }}> / {duration} {duration === 1 ? 'Meal' : 'Meals'}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#2B8A3E', fontWeight: 700 }}>
                      Effective: ₹{perMeal} / meal
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.5, marginBottom: '16px' }}>
                    {plan.description}
                  </p>

                  <div style={{ borderTop: '1px solid #FAF8F5', paddingTop: '14px', marginBottom: '20px', flexGrow: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '8px' }}>Included in this pass:</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(plan.includedMenuItems || []).map((it, idx) => (
                        <li key={idx} style={{ fontSize: '12.5px', color: '#57534E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={15} color="#2B8A3E" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => openPlanCheckout({ ...plan, providerName: provider.businessName, providerId: provider.id })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <Heart size={16} />
                    <span>Subscribe Now</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #EAE3D9',
              padding: '24px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid #EAE3D9', paddingRight: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#1C1917', lineHeight: 1 }}>{provider.rating}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={20} color="#EAB308" fill={s <= Math.round(provider.rating) ? '#EAB308' : 'none'} />
                ))}
              </div>
              <div style={{ fontSize: '13px', color: '#78716C', fontWeight: 600 }}>
                Based on {provider.totalReviews} verified meals
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Customer Reviews</h4>
                <button
                  onClick={() => openReviewModal({ providerId: provider.id, providerName: provider.businessName })}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1.5px solid #DC2626',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ★ Write a Review
                </button>
              </div>

              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingCounts[stars] || 0;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : stars === 5 ? 85 : 15;
                return (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ width: '30px', fontWeight: 700 }}>{stars}★</span>
                    <div style={{ flexGrow: 1, height: '8px', background: '#F3ECE2', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#EAB308' }} />
                    </div>
                    <span style={{ width: '30px', textAlign: 'right', color: '#78716C' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(rev => (
              <div
                key={rev.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #EAE3D9',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={rev.customerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.customerName}`}
                      alt={rev.customerName}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF2F2' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917' }}>{rev.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} />
                        <span>Verified Meal: {rev.verifiedMeal || 'Homestyle Thali'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={15} color="#EAB308" fill={s <= rev.rating ? '#EAB308' : 'none'} />
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '13.5px', color: '#44403C', lineHeight: 1.6, margin: '10px 0' }}>
                  "{rev.comment}"
                </p>

                {rev.favoriteDish && (
                  <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700 }}>
                    ❤️ Favorite: {rev.favoriteDish}
                  </div>
                )}

                {/* Provider Reply */}
                {rev.providerResponse && (
                  <div style={{ marginTop: '12px', background: '#FAF8F5', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #2B8A3E' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#2B8A3E', marginBottom: '2px' }}>
                      👩‍🍳 Response from {provider.ownerName}:
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#57534E' }}>
                      {rev.providerResponse.comment}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ABOUT & SERVICE AREA */}
      {activeTab === 'about' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>About {provider.businessName}</h3>
            <p style={{ fontSize: '14px', color: '#57534E', lineHeight: 1.7, marginBottom: '20px' }}>
              {provider.description}
            </p>

            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>Packaging & Thermal Quality</h4>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '14px', fontSize: '13px', color: '#44403C' }}>
              🍲 {provider.packagingType || '100% Food-Grade 304 Stainless Steel Insulated Dabbas'}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EAE3D9', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>Localities Served</h3>
            <div style={{ fontSize: '13px', color: '#78716C', marginBottom: '12px' }}>
              Delivery radius: <strong>{provider.serviceArea?.deliveryRadiusKm || 8} km</strong> around {provider.area}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(provider.serviceArea?.localities || [provider.area]).map(loc => (
                <span
                  key={loc}
                  style={{
                    background: '#FFF4E6',
                    color: '#E8590C',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 700
                  }}
                >
                  📍 {loc}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid #EAE3D9', paddingTop: '16px' }}>
              <div style={{ fontSize: '12px', color: '#78716C' }}>FSSAI Registration License</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#1C1917' }}>#{provider.fssaiNumber || '10023011000941'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
