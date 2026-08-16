import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Check, Flame, Leaf, Utensils, Award, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
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
  { key: 'all', label: 'All Dishes', icon: '✨' },
  { key: 'veg', label: 'Pure Veg', icon: '🟢' },
  { key: 'non_veg', label: 'Non-Veg Special', icon: '🔴' },
  { key: 'fit_protein', label: 'High Protein Fit', icon: '💪' },
  { key: 'jain', label: 'Jain (No Onion-Garlic)', icon: '🟡' }
];

export const WeeklyMenu = ({ onOpenThaliBuilder }) => {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedSlot, setSelectedSlot] = useState('lunch');
  const [activeDiet, setActiveDiet] = useState('all');
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addItem, items: cartItems } = useCart();

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const data = await api.getWeeklyMenu();
      if (data) {
        setWeeklyData(data);
      }
      setLoading(false);
    }
    loadMenu();
  }, []);

  // Determine current items
  const dayMenu = weeklyData ? weeklyData[selectedDay] : null;
  let mealList = dayMenu && dayMenu[selectedSlot] ? dayMenu[selectedSlot] : [];

  if (activeDiet !== 'all') {
    mealList = mealList.filter(m => m.diet === activeDiet);
  }

  const getItemCartQty = (id) => {
    const it = cartItems.find(x => x.id === id);
    return it ? it.qty : 0;
  };

  return (
    <section id="weekly-menu" className="weekly-menu-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Chef's Weekly Rotation</span>
          <h2 className="section-title">Fresh Daily Homestyle Menu</h2>
          <p className="section-subtitle">
            Every day is a new culinary adventure. Hand-picked vegetables, slow-cooked gravies, and hot phulkas freshly rolled upon your order.
          </p>
        </div>

        {/* Menu Navigation Controls */}
        <div className="menu-controls">
          {/* Day of Week Tabs */}
          <div className="day-tabs">
            {DAYS.map(d => (
              <button
                key={d.key}
                className={`day-tab-btn ${selectedDay === d.key ? 'active' : ''}`}
                onClick={() => setSelectedDay(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Slot Toggle */}
          <div className="slot-toggle">
            <button
              className={`slot-btn ${selectedSlot === 'lunch' ? 'active' : ''}`}
              onClick={() => setSelectedSlot('lunch')}
            >
              <Sun size={14} color={selectedSlot === 'lunch' ? '#F59E0B' : 'currentColor'} />
              <span>Lunch (12:30 PM)</span>
            </button>
            <button
              className={`slot-btn ${selectedSlot === 'dinner' ? 'active' : ''}`}
              onClick={() => setSelectedSlot('dinner')}
            >
              <Moon size={14} color={selectedSlot === 'dinner' ? '#818CF8' : 'currentColor'} />
              <span>Dinner (7:30 PM)</span>
            </button>
          </div>
        </div>

        {/* Diet Filters */}
        <div className="diet-filters">
          {DIET_FILTERS.map(f => (
            <button
              key={f.key}
              className={`diet-filter-chip ${activeDiet === f.key ? 'active' : ''}`}
              onClick={() => setActiveDiet(f.key)}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Meal Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🍲</div>
            <p>Loading fresh kitchen menu...</p>
          </div>
        ) : mealList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface-soft)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
              No dishes found for this specific filter on {DAYS.find(d => d.key === selectedDay)?.label}.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
              onClick={() => setActiveDiet('all')}
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="meal-grid">
            {mealList.map(meal => {
              const qtyInCart = getItemCartQty(meal.id);

              return (
                <div key={meal.id} className="meal-card">
                  {/* Media */}
                  <div className="meal-card-media">
                    <img src={meal.image} alt={meal.name} loading="lazy" />
                    
                    <div className="meal-card-tags">
                      <span className={`diet-tag-icon ${meal.diet}`} title={meal.diet} />
                      {meal.isChefSpecial && (
                        <span className="badge badge-accent" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                          <Award size={12} color="var(--primary)" />
                          Chef's Special
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="meal-card-body">
                    <div className="meal-header">
                      <h3 className="meal-title">{meal.name}</h3>
                    </div>
                    <p className="meal-tagline">{meal.tagline}</p>

                    {/* Included Thali items */}
                    {meal.items && meal.items.length > 0 && (
                      <div className="meal-items-list">
                        <div className="meal-items-list-title">What's in this Dabba:</div>
                        <ul>
                          {meal.items.map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nutrition Bar */}
                    <div className="meal-nutrition-bar">
                      <span>🔥 <strong>{meal.calories}</strong> kcal</span>
                      <span>🥩 Protein: <strong>{meal.protein}</strong></span>
                      <span>🌾 Carbs: <strong>{meal.carbs}</strong></span>
                    </div>

                    {/* Chef Note */}
                    {meal.chefNote && (
                      <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)', fontStyle: 'italic', marginBottom: '14px' }}>
                        "{meal.chefNote}"
                      </div>
                    )}

                    {/* Footer / Price & CTA */}
                    <div className="meal-card-footer">
                      <div className="meal-price-box">
                        <div className="meal-price-row">
                          <span className="meal-current-price">₹{meal.price}</span>
                          {meal.originalPrice && (
                            <span className="meal-orig-price">₹{meal.originalPrice}</span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>Zero Delivery Fee</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Customize this thali in builder"
                          onClick={() => onOpenThaliBuilder(meal)}
                        >
                          Customize
                        </button>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => addItem(meal)}
                        >
                          <Plus size={14} />
                          <span>{qtyInCart > 0 ? `Add More (${qtyInCart})` : 'Add to Dabba'}</span>
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
    </section>
  );
};
