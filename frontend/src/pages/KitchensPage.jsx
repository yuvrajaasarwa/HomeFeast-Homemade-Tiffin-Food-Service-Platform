import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ChefHat,
  ArrowRight,
  Heart,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Interactive Quick Category Pill with dynamic Orange Outline & Hover
const QuickCategoryChip = ({ label, icon, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '8px 16px',
        borderRadius: '9999px',
        border: isActive
          ? '2px solid #DC2626'
          : isHovered
          ? '2px solid #DC2626'
          : '1.5px solid #EAE3D9',
        background: isActive
          ? 'linear-gradient(135deg, #FEF2F2 0%, #FEF9C3 100%)'
          : isHovered
          ? '#FEF2F2'
          : '#FFFFFF',
        color: isActive || isHovered ? '#DC2626' : '#44403C',
        fontSize: '12.5px',
        fontWeight: isActive ? 800 : isHovered ? 700 : 600,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: isActive
          ? '0 4px 14px rgba(220, 38, 38, 0.28)'
          : isHovered
          ? '0 4px 12px rgba(220, 38, 38, 0.2)'
          : '0 1px 3px rgba(0,0,0,0.03)',
        transform: isActive ? 'scale(1.04)' : isHovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        outline: 'none'
      }}
    >
      <span style={{ fontSize: '13.5px' }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Interactive Sidebar Option Button with Orange Outline on Hover & Click
const FilterOptionButton = ({ label, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: isActive
          ? '2px solid #DC2626'
          : isHovered
          ? '2px solid #DC2626'
          : '1.5px solid #EAE3D9',
        background: isActive
          ? '#FEF2F2'
          : isHovered
          ? '#FFF9F2'
          : '#FFFFFF',
        color: isActive || isHovered ? '#DC2626' : '#57534E',
        fontSize: '12px',
        fontWeight: isActive ? 800 : 700,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isActive || isHovered ? '0 2px 8px rgba(220, 38, 38, 0.15)' : 'none',
        outline: 'none',
        textAlign: 'center'
      }}
    >
      {label}
    </button>
  );
};

export const KitchensPage = ({ onSelectProvider, onBack, onExploreThali }) => {
  const { selectedCity, selectedLocality, openPlanCheckout } = useAuth();
  const { addToast } = useToast();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 18, totalPages: 1 });

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('all'); // 'all' | 'veg' | 'non_veg' | 'jain'
  const [cuisine, setCuisine] = useState('all');
  const [mealPlan, setMealPlan] = useState('all'); // 'all' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  const [priceBracket, setPriceBracket] = useState('all'); // 'all' | 'under50' | '50-100' | '100-150' | '150plus'
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Fetch providers whenever filters change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let effMin = minPrice;
        let effMax = maxPrice;

        if (priceBracket === 'under50') { effMin = ''; effMax = '50'; }
        else if (priceBracket === '50-100') { effMin = '50'; effMax = '100'; }
        else if (priceBracket === '100-150') { effMin = '100'; effMax = '150'; }
        else if (priceBracket === '150plus') { effMin = '150'; effMax = ''; }

        const res = await api.getProviders({
          search,
          city: selectedCity,
          locality: selectedLocality,
          mealType: mealType !== 'all' ? mealType : undefined,
          cuisine: cuisine !== 'all' ? cuisine : undefined,
          mealPlan: mealPlan !== 'all' ? mealPlan : undefined,
          minPrice: effMin,
          maxPrice: effMax,
          rating,
          acceptingOnly: acceptingOnly ? 'true' : undefined,
          sortBy,
          page,
          limit: 25
        });

        if (res.success) {
          setProviders(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [search, selectedCity, selectedLocality, mealType, cuisine, mealPlan, priceBracket, minPrice, maxPrice, rating, acceptingOnly, sortBy, page]);

  const resetFilters = () => {
    setSearch('');
    setMealType('all');
    setCuisine('all');
    setMealPlan('all');
    setPriceBracket('all');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setAcceptingOnly(false);
    setSortBy('rating');
    setPage(1);
    addToast('Filters reset', 'info');
  };

  const cuisinesList = [
    'North Indian',
    'Rajasthani',
    'Punjabi',
    'Jain',
    'Gujarati',
    'South Indian',
    'Maharashtrian',
    'Bengali',
    'Healthy',
    'Mughlai'
  ];

  const QUICK_CATEGORIES = [
    {
      id: 'all',
      label: 'All Diet',
      icon: '🍲',
      isActive: mealType === 'all' && mealPlan === 'all' && cuisine === 'all',
      action: () => {
        setMealType('all');
        setMealPlan('all');
        setCuisine('all');
        setPage(1);
      }
    },
    {
      id: 'veg',
      label: 'Pure Veg',
      icon: '🟢',
      isActive: mealType === 'veg',
      action: () => {
        setMealType(mealType === 'veg' ? 'all' : 'veg');
        setPage(1);
      }
    },
    {
      id: 'jain',
      label: 'Satvik Jain',
      icon: '🌱',
      isActive: mealType === 'jain',
      action: () => {
        setMealType(mealType === 'jain' ? 'all' : 'jain');
        setPage(1);
      }
    },
    {
      id: 'non_veg',
      label: 'Non-Veg',
      icon: '🍗',
      isActive: mealType === 'non_veg',
      action: () => {
        setMealType(mealType === 'non_veg' ? 'all' : 'non_veg');
        setPage(1);
      }
    },
    {
      id: 'healthy',
      label: 'Healthy Diet',
      icon: '🥗',
      isActive: cuisine === 'Healthy',
      action: () => {
        setCuisine(cuisine === 'Healthy' ? 'all' : 'Healthy');
        setPage(1);
      }
    },
    {
      id: 'daily',
      label: 'Daily Pass',
      icon: '⚡',
      isActive: mealPlan === 'DAILY',
      action: () => {
        setMealPlan(mealPlan === 'DAILY' ? 'all' : 'DAILY');
        setPage(1);
      }
    },
    {
      id: 'weekly',
      label: 'Weekly Pass',
      icon: '📅',
      isActive: mealPlan === 'WEEKLY',
      action: () => {
        setMealPlan(mealPlan === 'WEEKLY' ? 'all' : 'WEEKLY');
        setPage(1);
      }
    },
    {
      id: 'monthly',
      label: 'Monthly Pass',
      icon: '🌟',
      isActive: mealPlan === 'MONTHLY',
      action: () => {
        setMealPlan(mealPlan === 'MONTHLY' ? 'all' : 'MONTHLY');
        setPage(1);
      }
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 80px 16px' }}>
      {/* Header & Search Bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>
              <ChefHat size={15} />
              <span>VERIFIED HOME COOKS IN {selectedCity?.toUpperCase() || 'AJMER'}</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', margin: 0, letterSpacing: '-0.02em' }}>
              Discover Homemade Food Providers
            </h1>
            <p style={{ fontSize: '14px', color: '#78716C', marginTop: '4px' }}>
              Fresh, healthy and hygienic home-style meals prepared daily by verified local home cooks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', cursor: 'pointer' }}
            >
              <SlidersHorizontal size={16} />
              <span>Filters & Sort</span>
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', cursor: 'pointer' }}
              title="Reset all filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by home cook name, dish (Dal Tadka, Rajma, Phulkas), cuisine, or locality..."
            style={{
              width: '100%',
              padding: '14px 20px 14px 48px',
              borderRadius: '16px',
              border: '1.5px solid #EAE3D9',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              background: '#FFFFFF'
            }}
          />
          <Search size={20} color="#78716C" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#78716C' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Results Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: isFilterDrawerOpen ? '280px 1fr' : '1fr', gap: '28px' }}>
        {/* Filter Sidebar (Collapsible) */}
        {isFilterDrawerOpen && (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EAE3D9',
              padding: '20px',
              height: 'fit-content',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Refine Search</h3>
              <button onClick={resetFilters} style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>
                Clear All
              </button>
            </div>

            {/* Sort Options */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
              >
                <option value="rating">Top Rated (Highest Rating)</option>
                <option value="price_asc">Starting Price: Low to High</option>
                <option value="price_desc">Starting Price: High to Low</option>
                <option value="most_popular">Most Popular (Review Count)</option>
                <option value="newest">Recently Onboarded</option>
              </select>
            </div>

            {/* Meal Type Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Meal Diet Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Diets' },
                  { id: 'veg', label: 'Pure Veg' },
                  { id: 'jain', label: 'Satvik Jain' },
                  { id: 'non_veg', label: 'Non-Veg / Both' }
                ].map(mt => (
                  <FilterOptionButton
                    key={mt.id}
                    label={mt.label}
                    isActive={mealType === mt.id}
                    onClick={() => { setMealType(mt.id); setPage(1); }}
                  />
                ))}
              </div>
            </div>

            {/* Price Brackets */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Starting Price
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'all', label: 'Any Price' },
                  { id: 'under50', label: 'Under ₹50' },
                  { id: '50-100', label: '₹50 – ₹100' },
                  { id: '100-150', label: '₹100 – ₹150' },
                  { id: '150plus', label: '₹150+' }
                ].map(pb => (
                  <label key={pb.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#44403C', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="priceBracket"
                      checked={priceBracket === pb.id}
                      onChange={() => { setPriceBracket(pb.id); setPage(1); }}
                    />
                    <span>{pb.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Meal Plan Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Subscription Passes Offered
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'all', label: 'All Passes' },
                  { id: 'DAILY', label: 'Daily Pass' },
                  { id: 'WEEKLY', label: 'Weekly Pass' },
                  { id: 'MONTHLY', label: 'Monthly Pass' }
                ].map(mp => (
                  <FilterOptionButton
                    key={mp.id}
                    label={mp.label}
                    isActive={mealPlan === mp.id}
                    onClick={() => { setMealPlan(mp.id); setPage(1); }}
                  />
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Cuisine Style
              </label>
              <select
                value={cuisine}
                onChange={e => { setCuisine(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
              >
                <option value="all">All Cuisines</option>
                {cuisinesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase', marginBottom: '8px' }}>
                Minimum Rating
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { val: '', label: 'All' },
                  { val: '4', label: '4★ +' },
                  { val: '4.8', label: '4.8★ +' }
                ].map(r => (
                  <FilterOptionButton
                    key={r.val}
                    label={r.label}
                    isActive={rating === r.val}
                    onClick={() => { setRating(r.val); setPage(1); }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Provider Cards Results Container */}
        <div>
          {/* Quick Filter Chips (Horizontal Top) WITH DYNAMIC ORANGE OUTLINES & HOVER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#78716C', whiteSpace: 'nowrap' }}>
              Showing {providers.length} of {pagination.total} Home Cooks:
            </span>
            {QUICK_CATEGORIES.map(chip => (
              <QuickCategoryChip
                key={chip.id}
                label={chip.label}
                icon={chip.icon}
                isActive={chip.isActive}
                onClick={chip.action}
              />
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍲</div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>Finding delicious home cooks...</h3>
            </div>
          ) : providers.length === 0 ? (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '1px solid #EAE3D9' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917' }}>No Home Cooks match these filters</h3>
              <p style={{ fontSize: '14px', color: '#78716C', marginTop: '6px', maxWidth: '400px', margin: '6px auto 18px auto' }}>
                Try resetting your filters or selecting a different category.
              </p>
              <button type="button" onClick={resetFilters} className="btn btn-primary" style={{ cursor: 'pointer' }}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
              {providers.map(prov => (
                <div
                  key={prov.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #EAE3D9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 20px -2px rgba(28, 25, 23, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(220, 38, 38, 0.2)';
                    e.currentTarget.style.borderColor = '#DC2626';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(28, 25, 23, 0.06)';
                    e.currentTarget.style.borderColor = '#EAE3D9';
                  }}
                >
                  {/* Card Media Header */}
                  <div style={{ position: 'relative', height: '190px', background: '#F5F5F4' }}>
                    <img
                      src={prov.image}
                      alt={prov.businessName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }} />

                    {/* Meal Type Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span
                        style={{
                          background: prov.mealType === 'jain' ? '#EAB308' : prov.mealType === 'veg' ? '#2B8A3E' : '#C92A2A',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {prov.mealType === 'jain' ? 'SATVIK JAIN' : prov.mealType === 'veg' ? 'PURE VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    {/* Verified Badge */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          color: '#2B8A3E',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ShieldCheck size={13} /> Verified Cook
                      </span>
                    </div>

                    {/* Bottom Metadata: Rating & Price */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>
                        <Star size={13} fill="#EAB308" color="#EAB308" />
                        <span>{prov.rating || 4.9}</span>
                        <span style={{ opacity: 0.75, fontSize: '11px' }}>({prov.totalReviews || 120})</span>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px', fontWeight: 800 }}>
                        Starts ₹{prov.startingPrice || 85}
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', marginBottom: '3px' }}>
                      {prov.businessName}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: 700, marginBottom: '8px' }}>
                      By Cook {prov.ownerName} • {prov.cuisines?.join(', ')}
                    </div>

                    <p style={{ fontSize: '12.5px', color: '#57534E', lineHeight: 1.4, margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {prov.description}
                    </p>

                    <div style={{ borderTop: '1px solid #F5F5F4', paddingTop: '10px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#78716C' }}>
                        <MapPin size={13} color="#DC2626" />
                        <span>{prov.area} <span style={{ opacity: 0.65 }}>(radius {prov.serviceArea?.deliveryRadiusKm || 8} km)</span></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2B8A3E' }}>
                        <Clock size={13} />
                        <span>Lunch: {prov.deliveryTimings?.lunch || '12:15 PM'}</span>
                      </div>
                    </div>

                    {/* Meal Plan Tags */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {prov.availableMealPlans?.map(mp => (
                        <span key={mp} style={{ background: '#F5F5F4', color: '#57534E', fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                          {mp === 'DAILY' ? 'Daily Meal' : mp === 'WEEKLY' ? '7-Day Pass' : '30-Day Pass'}
                        </span>
                      ))}
                    </div>

                    {/* Action CTA Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px', marginTop: '14px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectProvider) onSelectProvider(prov.id);
                        }}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #EAE3D9',
                          background: '#FFFFFF',
                          color: '#1C1917',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#DC2626';
                          e.currentTarget.style.color = '#DC2626';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#EAE3D9';
                          e.currentTarget.style.color = '#1C1917';
                        }}
                      >
                        <ChefHat size={14} />
                        <span>View Menu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          openPlanCheckout({
                            id: `plan_quick_${prov.id}`,
                            name: `${prov.businessName} (Monthly Pass)`,
                            price: (prov.startingPrice || 85) * 22,
                            durationDays: 30,
                            planType: 'MONTHLY',
                            providerId: prov.id,
                            providerName: prov.businessName
                          });
                        }}
                        style={{
                          padding: '9px 12px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          boxShadow: '0 4px 12px rgba(232, 89, 12, 0.25)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Subscribe</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
