import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Clock,
  Star,
  ShieldCheck,
  ChefHat,
  Utensils,
  Compass,
  X,
  Building,
  Flame,
  Award,
} from 'lucide-react';
import { POPULAR_CITIES, ALL_CITIES, ALL_STATES } from '../utils/citiesData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const CitiesPage = ({ onExploreMenu, onExploreKitchens }) => {
  const { switchLocation, selectedCity, detectLiveLocation, isDetectingGps } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [activeCityModal, setActiveCityModal] = useState(null);

  // Gradient colors for cards (matching RentiGo)
  const gradients = [
    'from-indigo-600 to-blue-600',
    'from-purple-600 to-indigo-600',
    'from-orange-500 to-amber-600',
    'from-teal-600 to-emerald-600',
    'from-cyan-600 to-blue-500',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-700',
    'from-blue-600 to-indigo-700',
    'from-purple-500 to-rose-500',
    'from-lime-600 to-green-600',
    'from-sky-500 to-indigo-600',
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Filter 500+ Cities
  const filteredCities = useMemo(() => {
    let list = [...new Set(ALL_CITIES)].sort();

    if (selectedLetter) {
      list = list.filter((c) => c.charAt(0).toUpperCase() === selectedLetter);
    }

    if (searchQuery) {
      list = list.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return list;
  }, [searchQuery, selectedLetter]);

  const handleSelectAndActivateCity = (cityName, cityObj = null) => {
    const cleanId = (cityObj?.id || cityName).toLowerCase().replace(/\s+/g, '-');
    const locality = cityObj?.popularAreas?.[0] || `${cityName} Central Hub`;
    const fullAddr = `${locality}, ${cityName}, India`;

    switchLocation(cleanId, locality, fullAddr);
    addToast(`📍 Switched active delivery city to: ${cityName}`, 'success');
    setActiveCityModal(null);
    if (onExploreMenu) onExploreMenu();
  };

  const handleLiveGpsClick = async () => {
    const res = await detectLiveLocation();
    if (res.success) {
      addToast(`📍 Detected Live GPS: ${res.data.locality}, ${res.data.cityName}`, 'success');
      if (onExploreMenu) onExploreMenu();
    } else {
      addToast(res.error || 'Failed to detect GPS location.', 'error');
    }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* 🚀 PREMIUM HERO BANNER (RentiGo Style) */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '80px 0 100px 0',
        }}
      >
        {/* Animated Glow Blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '15%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(165, 180, 252, 0.35)',
              padding: '6px 18px',
              borderRadius: '9999px',
              color: '#A5B4FC',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} color="#67E8F9" />
            500+ Cities & Cloud Kitchens Across India
          </div>

          <h1
            style={{
              fontSize: 'clamp(28px, 4.5vw, 52px)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              maxWidth: '900px',
              margin: '0 auto 16px auto',
              letterSpacing: '-0.03em',
            }}
          >
            Homestyle Hot Tiffin Delivery In{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #67E8F9 0%, #818CF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              500+ Indian Cities
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: '#CBD5E1',
              maxWidth: '720px',
              margin: '0 auto 32px auto',
              lineHeight: 1.6,
            }}
          >
            Ghar jaisa pure swad, hygienic stainless steel dabbas, and instant 20-30 min dispatch from over 1,200 verified home kitchens and regional chefs.
          </p>

          {/* Search Box with Real-time GPS Trigger */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto 28px auto',
              display: 'flex',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '8px',
              borderRadius: '20px',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Search
                size={18}
                color="#94A3B8"
                style={{ position: 'absolute', left: '16px', top: '15px' }}
              />
              <input
                type="text"
                placeholder="Search your city (e.g. Jaipur, Ajmer, Kishangarh)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: '14px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 500,
                }}
              />
            </div>

            <button
              onClick={handleLiveGpsClick}
              disabled={isDetectingGps}
              style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0 22px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Compass size={16} />
              <span>{isDetectingGps ? 'Detecting...' : 'Auto Detect GPS'}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '13px',
              color: '#94A3B8',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={15} color="#67E8F9" /> <strong>500+</strong> Delivery Cities
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChefHat size={15} color="#818CF8" /> <strong>1,200+</strong> Homestyle Kitchens
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#34D399" /> <strong>20-30 Mins</strong> Avg Delivery
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={15} color="#FBBF24" /> <strong>4.94★</strong> Customer Love
            </span>
          </div>
        </div>

        {/* Wave separator */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', overflow: 'hidden' }}>
          <svg viewBox="0 0 1440 60" style={{ width: '100%', height: '100%', fill: '#F8FAFC' }}>
            <path d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,37.3L1440,43L1440,60L1360,60C1280,60,1120,60,960,60C800,60,640,60,480,60C320,60,160,60,80,60L0,60Z" />
          </svg>
        </div>
      </section>

      {/* 🌟 TOP POPULAR CITIES SHOWCASE */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <TrendingUp size={18} color="#4F46E5" />
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                    Top Popular Tiffin Hubs
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Explore active cloud kitchen hubs, local delicacies, and order directly.
                </p>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#4F46E5',
                  background: '#EEF2FF',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                }}
              >
                Instant 20-30 min Dispatch ⚡
              </span>
            </div>

            {/* Popular Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '14px',
              }}
            >
              {POPULAR_CITIES.map((city, idx) => {
                const gradient = gradients[idx % gradients.length];
                const isSelected = (selectedCity || '').toLowerCase() === (city?.id || '').toLowerCase();

                return (
                  <div
                    key={city.id}
                    onClick={() => setActiveCityModal(city)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, #312E81 0%, #4F46E5 100%)'
                        : `linear-gradient(135deg, #1E293B 0%, #0F172A 100%)`,
                      padding: '18px',
                      borderRadius: '18px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      border: `1.5px solid ${isSelected ? '#818CF8' : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: '0 6px 16px -2px rgba(15, 23, 42, 0.1)',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 16px 30px -6px rgba(79, 70, 229, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(15, 23, 42, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={16} color="#38BDF8" />
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{city.name}</h3>
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          background: 'rgba(255,255,255,0.15)',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          color: '#A5B4FC',
                          fontWeight: 700,
                        }}
                      >
                        {city.state}
                      </span>
                    </div>

                    <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.4, margin: '6px 0 12px 0' }}>
                      {city.desc}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '11px',
                        color: '#CBD5E1',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#38BDF8' }}>{city.kitchens}+ Kitchens</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#FBBF24' }}>
                        <Star size={11} fill="#FBBF24" /> {city.rating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔤 ALPHABET FILTER STRIP */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Browse All 500+ Indian Cities by Letter:
              </span>
              {selectedLetter && (
                <button
                  onClick={() => setSelectedLetter('')}
                  style={{
                    fontSize: '12px',
                    color: '#4F46E5',
                    fontWeight: 700,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <X size={13} /> Clear Filter ({selectedLetter})
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(selectedLetter === letter ? '' : letter)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedLetter === letter ? '#4F46E5' : '#F1F5F9',
                    color: selectedLetter === letter ? '#FFFFFF' : '#334155',
                    transition: 'all 0.15s',
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* 🌐 ALL 500+ CITIES DIRECTORY GRID */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>
                  All Service Cities
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Showing {filteredCities.length} Indian cities
                  {selectedLetter && ` starting with "${selectedLetter}"`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>

            {filteredCities.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '60px 20px',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏙️</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  No matching city found
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                  Try searching for a different city or browse by letter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLetter('');
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '10px',
                }}
              >
                {filteredCities.map((city) => {
                  const isSelected = (selectedCity || '').toLowerCase() === (city || '').toLowerCase();

                  return (
                    <div
                      key={city}
                      onClick={() => handleSelectAndActivateCity(city)}
                      style={{
                        background: isSelected ? '#EEF2FF' : '#FFFFFF',
                        border: `1px solid ${isSelected ? '#4F46E5' : '#E2E8F0'}`,
                        borderRadius: '12px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#A5B4FC';
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#E2E8F0';
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#4F46E5' : '#0F172A' }}>
                          {city}
                        </span>
                      </div>
                      {isSelected ? (
                        <CheckCircle size={14} color="#4F46E5" />
                      ) : (
                        <ArrowRight size={13} color="#94A3B8" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 📢 DON'T SEE YOUR CITY? CTA BANNER (RentiGo Style) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
              borderRadius: '28px',
              padding: '48px 32px',
              color: '#FFFFFF',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.25)',
            }}
          >
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '10px' }}>
                Don't See Your Locality or Colony?
              </h2>
              <p style={{ fontSize: '15px', color: '#CBD5E1', marginBottom: '24px', lineHeight: 1.5 }}>
                We're onboarding new home cooks and cloud kitchens daily across India. Request a kitchen hub for your college, office campus, or society!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => addToast('Request registered! Our delivery team will review your area.', 'success')}
                  style={{
                    background: '#FFFFFF',
                    color: '#4F46E5',
                    fontWeight: 800,
                    fontSize: '14px',
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  }}
                >
                  Request Kitchen Hub ➔
                </button>
                <button
                  onClick={onExploreMenu}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    padding: '12px 28px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Explore Today's Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏙️ CITY DETAILS POPUP MODAL */}
      {activeCityModal && (
        <div className="modal-backdrop" onClick={() => setActiveCityModal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '540px',
              borderRadius: '24px',
              padding: '0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
                padding: '24px',
                color: '#FFFFFF',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setActiveCityModal(null)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.3)',
                    color: '#A5B4FC',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {activeCityModal.state}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Active Kitchen Network</span>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
                {activeCityModal.name} Delivery Hub
              </h2>
              <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>
                {activeCityModal.desc}
              </p>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#4F46E5' }}>
                    {activeCityModal.kitchens}+
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Home Kitchens</span>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A' }}>
                    {activeCityModal.deliveryTime}
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Avg Delivery</span>
                </div>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '10px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#D97706' }}>
                    ⭐ {activeCityModal.rating}
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Rating</span>
                </div>
              </div>

              {/* Specialty Dish */}
              {activeCityModal.specialty && (
                <div
                  style={{
                    background: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', marginBottom: '2px' }}>
                    🍱 Regional Specialty:
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B' }}>
                    {activeCityModal.specialty}
                  </div>
                </div>
              )}

              {/* Major Localities */}
              {activeCityModal.popularAreas && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Major Delivery Localities:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {activeCityModal.popularAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          fontSize: '11.5px',
                          background: '#F1F5F9',
                          color: '#334155',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 600,
                        }}
                      >
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleSelectAndActivateCity(activeCityModal.name, activeCityModal)}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: '12px 20px', fontSize: '13.5px' }}
                >
                  Deliver to {activeCityModal.name} ➔
                </button>
                <button
                  onClick={() => setActiveCityModal(null)}
                  className="btn btn-secondary"
                  style={{ padding: '12px 18px', fontSize: '13.5px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
