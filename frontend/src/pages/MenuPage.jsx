import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sun, Moon, Plus, Award, Utensils, Check, ChefHat, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

const DAYS = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
];

const DIET_FILTERS = [
  { key: 'all', label: 'All Dishes (100+)', icon: '✨' },
  { key: 'rajasthani', label: 'Rajasthani Royal Thalis', icon: '👑' },
  { key: 'veg', label: 'Pure Veg', icon: '🟢' },
  { key: 'non_veg', label: 'Non-Veg Special', icon: '🍗' },
  { key: 'fit_protein', label: 'High Protein Fit', icon: '💪' },
  { key: 'jain', label: '100% Jain Sattvic', icon: '🌱' },
  { key: 'street_fast', label: 'Pizza, Pasta & Chaat', icon: '🍕' }
];

// Interactive Diet Filter Chip with Orange Outline & Hover
const MenuDietChip = ({ filter, isActive, onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 16px',
        borderRadius: '9999px',
        border: isActive
          ? '2px solid #DC2626'
          : hover
          ? '2px solid #DC2626'
          : '1.5px solid #EAE3D9',
        background: isActive
          ? 'linear-gradient(135deg, #FEF2F2 0%, #FEF9C3 100%)'
          : hover
          ? '#FEF2F2'
          : '#FFFFFF',
        color: isActive || hover ? '#DC2626' : '#44403C',
        fontSize: '12.5px',
        fontWeight: isActive ? 800 : hover ? 700 : 600,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: isActive
          ? '0 4px 14px rgba(232, 89, 12, 0.28)'
          : hover
          ? '0 4px 12px rgba(232, 89, 12, 0.2)'
          : '0 1px 3px rgba(0,0,0,0.03)',
        transform: isActive ? 'scale(1.04)' : hover ? 'translateY(-2px)' : 'none',
        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        outline: 'none'
      }}
    >
      <span style={{ fontSize: '13.5px' }}>{filter.icon}</span>
      <span>{filter.label}</span>
    </button>
  );
};

export const MenuPage = ({ onBack, onOpenThaliBuilder }) => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedSlot, setSelectedSlot] = useState('lunch');
  const [activeDiet, setActiveDiet] = useState('all');
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addItem, items: cartItems } = useCart();
  const { selectedCity } = useAuth();

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const data = await api.getWeeklyMenu();
        if (data) {
          setWeeklyData(data);
        }
      } catch (err) {
        console.error('Error loading weekly menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const dayMenu = weeklyData ? weeklyData[selectedDay] : null;
  let mealList = dayMenu && dayMenu[selectedSlot] ? dayMenu[selectedSlot] : [];

  if (activeDiet === 'rajasthani') {
    mealList = mealList.filter(
      m =>
        m.isRajasthani ||
        m.cuisine === 'rajasthani' ||
        (m.name &&
          (m.name.includes('Rajasthani') ||
            m.name.includes('Baati') ||
            m.name.includes('Sangri') ||
            m.name.includes('Gatte') ||
            m.name.includes('Marwadi') ||
            m.name.includes('Churma') ||
            m.name.includes('Kachori')))
    );
  } else if (activeDiet === 'veg') {
    mealList = mealList.filter(m => m.diet === 'veg' || m.diet === 'jain');
  } else if (activeDiet === 'non_veg') {
    mealList = mealList.filter(m => m.diet === 'non_veg');
  } else if (activeDiet === 'jain') {
    mealList = mealList.filter(m => m.diet === 'jain');
  } else if (activeDiet === 'fit_protein') {
    mealList = mealList.filter(m => m.diet === 'fit_protein');
  } else if (activeDiet === 'street_fast') {
    mealList = mealList.filter(
      m => m.diet === 'street_fast' || m.cuisine === 'fast_food' || m.cuisine === 'street_food'
    );
  }

  const getItemCartQty = id => {
    const it = cartItems.find(x => x.id === id);
    return it ? it.qty : 0;
  };

  return (
    <div style={{ padding: '32px 0 100px', background: '#FAFAF9', minHeight: '90vh' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px' }}>
        {/* Top Breadcrumb / Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Explore</span>
          </button>

          <span
            style={{
              background: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📍 {(selectedCity || 'Ajmer').toUpperCase()} KITCHEN HUB
          </span>
        </div>

        {/* Page Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '8px'
            }}
          >
            <ChefHat size={14} />
            <span>CHEF'S 7-DAY MENU ROTATION</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', margin: '4px 0 8px', letterSpacing: '-0.02em' }}>
            Daily Homestyle Tiffin Menu
          </h1>
          <p style={{ fontSize: '14.5px', color: '#78716C', margin: 0 }}>
            Freshly prepared every morning and evening with cold-pressed oils, pure cow ghee, and zero preservatives.
          </p>
        </div>

        {/* Navigation Controls: Days & Slots */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #EAE3D9',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Day Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {DAYS.map(d => {
              const isDayActive = selectedDay === d.key;
              return (
                <button
                  type="button"
                  key={d.key}
                  onClick={() => setSelectedDay(d.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: isDayActive ? '2px solid #DC2626' : '1px solid #EAE3D9',
                    background: isDayActive ? '#DC2626' : '#FFFFFF',
                    color: isDayActive ? '#FFFFFF' : '#57534E',
                    fontSize: '13px',
                    fontWeight: isDayActive ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isDayActive ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* Slot Toggle */}
          <div style={{ display: 'flex', background: '#F5F5F4', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setSelectedSlot('lunch')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedSlot === 'lunch' ? '#FFFFFF' : 'transparent',
                color: selectedSlot === 'lunch' ? '#DC2626' : '#78716C',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: selectedSlot === 'lunch' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Sun size={15} color={selectedSlot === 'lunch' ? '#DC2626' : '#78716C'} />
              <span>Lunch (12:30 PM)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSlot('dinner')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedSlot === 'dinner' ? '#FFFFFF' : 'transparent',
                color: selectedSlot === 'dinner' ? '#DC2626' : '#78716C',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: selectedSlot === 'dinner' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Moon size={15} color={selectedSlot === 'dinner' ? '#DC2626' : '#78716C'} />
              <span>Dinner (7:30 PM)</span>
            </button>
          </div>
        </div>

        {/* Diet Filters (Interactive Orange Outlines) */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
          {DIET_FILTERS.map(f => (
            <MenuDietChip
              key={f.key}
              filter={f}
              isActive={activeDiet === f.key}
              onClick={() => setActiveDiet(f.key)}
            />
          ))}
        </div>

        {/* Meal Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🍲</div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917' }}>Loading fresh kitchen menu...</h3>
          </div>
        ) : mealList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #EAE3D9' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍽️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917' }}>
              No dishes found for this filter on {DAYS.find(d => d.key === selectedDay)?.label}.
            </h3>
            <p style={{ fontSize: '13.5px', color: '#78716C', margin: '6px 0 16px' }}>
              Try selecting another diet filter or day.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveDiet('all')}
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
            {mealList.map(meal => {
              const qtyInCart = getItemCartQty(meal.id);

              return (
                <div
                  key={meal.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1.5px solid #EAE3D9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 18px -2px rgba(28, 25, 23, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(232, 89, 12, 0.2)';
                    e.currentTarget.style.borderColor = '#E8590C';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 18px -2px rgba(28, 25, 23, 0.06)';
                    e.currentTarget.style.borderColor = '#EAE3D9';
                  }}
                >
                  {/* Media */}
                  <div style={{ position: 'relative', height: '185px', background: '#F5F5F4' }}>
                    <img
                      src={meal.image}
                      alt={meal.name}
                      loading="lazy"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)' }} />

                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span
                        style={{
                          background:
                            meal.diet === 'jain'
                              ? '#E8590C'
                              : meal.diet === 'non_veg'
                              ? '#C92A2A'
                              : meal.diet === 'fit_protein'
                              ? '#087F5B'
                              : meal.diet === 'street_fast'
                              ? '#D9480F'
                              : meal.diet === 'rajasthani'
                              ? '#E8590C'
                              : '#2B8A3E',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {meal.diet === 'jain'
                          ? 'SATVIK JAIN'
                          : meal.diet === 'non_veg'
                          ? 'NON-VEG'
                          : meal.diet === 'fit_protein'
                          ? 'HIGH PROTEIN'
                          : meal.diet === 'street_fast'
                          ? 'PIZZA / CHAAT'
                          : meal.diet === 'rajasthani'
                          ? 'RAJASTHANI ROYAL'
                          : 'PURE VEG'}
                      </span>
                    </div>

                    {meal.isChefSpecial && (
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        <span
                          style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            color: '#DC2626',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Award size={13} color="#DC2626" /> Chef's Special
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', margin: '0 0 4px' }}>
                      {meal.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#78716C', margin: '0 0 12px', lineHeight: 1.4 }}>
                      {meal.tagline}
                    </p>

                    {meal.items && meal.items.length > 0 && (
                      <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', border: '1px solid #FECACA' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: '6px' }}>
                          What's in this Dabba:
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#57534E', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {meal.items.map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: '#78716C', marginBottom: '12px', background: '#F5F5F4', padding: '6px 10px', borderRadius: '8px', flexWrap: 'wrap' }}>
                      <span>🔥 <strong>{meal.calories}</strong> kcal</span>
                      <span>•</span>
                      <span>🥩 <strong>{meal.protein}</strong></span>
                      <span>•</span>
                      <span>🌾 <strong>{meal.carbs}</strong></span>
                    </div>

                    {meal.chefNote && (
                      <div style={{ fontSize: '11.5px', color: '#78716C', fontStyle: 'italic', marginBottom: '14px' }}>
                        "{meal.chefNote}"
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '20px', fontWeight: 900, color: '#DC2626' }}>
                            ₹{meal.price}
                          </span>
                          {meal.originalPrice && (
                            <span style={{ fontSize: '12px', color: '#A8A29E', textDecoration: 'line-through' }}>
                              ₹{meal.originalPrice}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 700 }}>
                          Zero Delivery Fee
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '7px 12px', fontSize: '12px', cursor: 'pointer' }}
                          onClick={() => onOpenThaliBuilder(meal)}
                        >
                          Customize
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                          onClick={() => addItem(meal)}
                        >
                          <Plus size={14} />
                          <span>{qtyInCart > 0 ? `Add (${qtyInCart})` : 'Add to Dabba'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
