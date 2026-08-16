import React, { useState } from 'react';
import {
  X,
  MapPin,
  CheckCircle,
  Navigation,
  Sparkles,
  Search,
  Building,
  Check,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RAJASTHAN_CITIES } from '../utils/rajasthanCities';

export const LocationModal = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    selectedCity,
    selectedLocality,
    switchLocation,
    detectLiveLocation,
    isDetectingGps,
  } = useAuth();
  const { addToast } = useToast();

  const [activeCityTab, setActiveCityTab] = useState(() => selectedCity || 'jaipur');
  const [searchTerm, setSearchTerm] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  if (!isLocationModalOpen) return null;

  const currentCityObj = RAJASTHAN_CITIES.find(c => c.id === activeCityTab) || RAJASTHAN_CITIES[0];

  const filteredLocalities = (currentCityObj.localities || []).filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLocality = (locality) => {
    const fullAddr = `${locality}, ${currentCityObj.name}, Rajasthan`;
    switchLocation(currentCityObj.id, locality, fullAddr);
    addToast(`📍 Delivery location set to: ${locality}, ${currentCityObj.name}`, 'success');
    setIsLocationModalOpen(false);
  };

  const handleCustomAddressSubmit = (e) => {
    e?.preventDefault?.();
    const query = customAddress.trim() || searchTerm.trim();
    if (!query) {
      addToast('Please enter your colony, society, or landmark name', 'error');
      return;
    }
    const fullAddr = `${query}, ${currentCityObj.name}, Rajasthan`;
    switchLocation(currentCityObj.id, query, fullAddr);
    addToast(`📍 Delivery location set to: ${query}, ${currentCityObj.name}`, 'success');
    setCustomAddress('');
    setSearchTerm('');
    setIsLocationModalOpen(false);
  };

  const handleGpsDetect = async () => {
    const res = await detectLiveLocation();
    if (res.success) {
      addToast(`📍 Live GPS Detected: ${res.data.locality || 'Current Location'}`, 'success');
      setIsLocationModalOpen(false);
    } else {
      addToast(res.error || 'GPS detection failed. Please select your locality.', 'error');
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsLocationModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(28, 25, 23, 0.35)',
          background: '#FFFFFF',
          border: '1px solid #EAE3D9'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 60%, #431407 100%)',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: 'rgba(232, 89, 12, 0.25)',
                    border: '1px solid rgba(251, 146, 60, 0.4)',
                    color: '#FDBA74',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={11} />
                  Rajasthan Delivery Network
                </span>
                <span style={{ fontSize: '11.5px', color: '#D6D3D1' }}>
                  20-25 mins instant hot dispatch
                </span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 0 0' }}>
                Choose Your Delivery City & Locality
              </h2>
            </div>

            <button
              onClick={() => setIsLocationModalOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* GPS Quick Action */}
          <button
            onClick={handleGpsDetect}
            disabled={isDetectingGps}
            style={{
              marginTop: '18px',
              width: '100%',
              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: isDetectingGps ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(232, 89, 12, 0.35)'
            }}
          >
            <Compass size={17} className={isDetectingGps ? 'animate-spin' : ''} />
            <span>{isDetectingGps ? 'Detecting Live Location...' : '🛰️ Use Current Live GPS Location'}</span>
          </button>
        </div>

        {/* City Switcher Tabs (Jaipur, Ajmer, Kishangarh) */}
        <div style={{ padding: '16px 24px 0', background: '#FFFDFB', borderBottom: '1px solid #EAE3D9' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#78716C', textTransform: 'uppercase', marginBottom: '10px' }}>
            Select Service City:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', paddingBottom: '16px' }}>
            {RAJASTHAN_CITIES.map((city) => {
              const isSelected = activeCityTab === city.id;
              return (
                <div
                  key={city.id}
                  onClick={() => {
                    setActiveCityTab(city.id);
                    setSearchTerm('');
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                      : '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#DC2626' : '#EAE3D9'}`,
                    borderRadius: '14px',
                    padding: '12px',
                    cursor: 'pointer',
                    color: isSelected ? '#FFFFFF' : '#1C1917',
                    boxShadow: isSelected
                      ? '0 6px 20px -3px rgba(220, 38, 38, 0.35)'
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{city.name}</div>
                  <div style={{ fontSize: '11px', color: isSelected ? 'rgba(255,255,255,0.85)' : '#78716C', marginTop: '2px' }}>
                    {city.hubsCount} • {city.deliveryTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Localities Selection Area */}
        <div style={{ padding: '20px 24px', flexGrow: 1, overflowY: 'auto', maxHeight: '380px' }}>
          {/* Locality Search Input */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search
              size={16}
              color="#78716C"
              style={{ position: 'absolute', left: '14px', top: '12px' }}
            />
            <input
              type="text"
              placeholder={`Search locality / colony in ${currentCityObj.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '10px',
                border: '1.5px solid #EAE3D9',
                fontSize: '13px',
                background: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>

          {/* Localities Grid */}
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#44403C', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Popular Delivery Hubs in {currentCityObj.name}:</span>
            <span style={{ color: '#DC2626' }}>{filteredLocalities.length} Areas</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredLocalities.map((loc) => {
              const isCurrent = selectedCity === currentCityObj.id && selectedLocality?.name === loc.name;
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelectLocality(loc)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: `1px solid ${isCurrent ? '#DC2626' : '#EAE3D9'}`,
                    background: isCurrent ? '#FEF2F2' : '#FFFFFF',
                    color: isCurrent ? '#DC2626' : '#1C1917',
                    fontWeight: isCurrent ? 800 : 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.borderColor = '#DC2626';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) {
                      e.currentTarget.style.borderColor = '#EAE3D9';
                    }
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.name}</span>
                  {isCurrent ? <Check size={14} color="#DC2626" /> : <MapPin size={12} color="#A8A29E" />}
                </button>
              );
            })}
          </div>

          {/* Custom Colony / Society Form */}
          <div style={{ background: '#FFF9F2', border: '1px dashed rgba(232, 89, 12, 0.35)', borderRadius: '14px', padding: '14px 16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>
              Don't see your specific colony or society in {currentCityObj.name}?
            </div>
            <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '10px' }}>
              Type your apartment, colony, or landmark name below:
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="e.g. Unique Sapphire, Mahima Trinity, Vaishali..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #EAE3D9',
                  fontSize: '12.5px',
                  background: '#FFFFFF'
                }}
              />
              <button
                type="button"
                onClick={handleCustomAddressSubmit}
                style={{
                  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(232, 89, 12, 0.25)'
                }}
              >
                Deliver Here
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #EAE3D9',
            padding: '12px 24px',
            background: '#FFFDFB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '12px', color: '#57534E' }}>
            Active Delivery Hub: <strong style={{ color: '#1C1917' }}>{currentCityObj.name}</strong> ({selectedLocality || 'Malviya Nagar'})
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsLocationModalOpen(false)}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
