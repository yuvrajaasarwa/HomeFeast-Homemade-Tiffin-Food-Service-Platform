import React, { useState } from 'react';
import {
  X,
  User,
  ChefHat,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UtensilsCrossed,
  Bike
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginUser,
    selectedCity,
    selectedLocality
  } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(authModalTab || 'login'); // 'login' | 'register'
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'PROVIDER'

  React.useEffect(() => {
    if (authModalTab) setActiveTab(authModalTab);
  }, [authModalTab, isAuthModalOpen]);

  // Login form fields (empty by default for real user auth)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState(selectedCity || 'jaipur');
  const [regArea, setRegArea] = useState(selectedLocality || 'Malviya Nagar');
  const [regAddress, setRegAddress] = useState('');
  // Provider specific
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCuisine, setRegCuisine] = useState('North Indian');
  const [regMealType, setRegMealType] = useState('veg');
  const [regDescription, setRegDescription] = useState('');
  // Rider specific
  const [regVehicleType, setRegVehicleType] = useState('EV Scooter (Eco Delivery)');
  const [regVehicleNumber, setRegVehicleNumber] = useState('RJ 14 EV 4022');

  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      addToast('Please enter your login email / phone and password.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(loginIdentifier, loginPassword, role);
      const userObj = res.user || res.data;
      if (res.success && userObj) {
        loginUser(userObj);
        addToast(`Welcome back, ${userObj.name}! 🍲`, 'success');
      } else {
        addToast(res.message || 'Invalid credentials.', 'error');
      }
    } catch (err) {
      addToast('Network error during login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      addToast('Please fill all required fields.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role,
        city: regCity,
        area: regArea,
        address: regAddress || `${regArea}, ${regCity}`,
        businessName: regBusinessName || `${regName}'s Kitchen`,
        cuisine: regCuisine,
        mealType: regMealType,
        description: regDescription,
        vehicleType: regVehicleType,
        vehicleNumber: regVehicleNumber
      });

      const userObj = res.user || res.data;
      if (res.success && userObj) {
        loginUser(userObj);
        addToast(res.message || 'Registration successful!', 'success');
      } else {
        addToast(res.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      addToast('Network error during registration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '540px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', padding: '24px 24px 18px 24px', color: '#FFFFFF', position: 'relative' }}>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>🍲</span>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: '12px' }}>
              HomeFeast Platform
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            {activeTab === 'login' ? 'Welcome Back!' : 'Join HomeFeast Community'}
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.95, marginTop: '2px' }}>
            {activeTab === 'login'
              ? 'Access your daily meals, active passes & live kitchen tracking'
              : 'Discover trusted homemade tiffins or start sharing your culinary love'}
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.15)', borderRadius: '12px', padding: '4px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'login' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'login' ? '#DC2626' : '#FFFFFF',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'register' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'register' ? '#DC2626' : '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Register
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  Email Address or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. customer@homefeast.test or 98290 20001"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                  <Mail size={18} color="#78716C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password (default: password123)"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '14px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                  <Lock size={18} color="#78716C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #E8590C 0%, #FA8C16 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(232, 89, 12, 0.35)',
                  marginTop: '6px'
                }}
              >
                <span>{loading ? 'Signing In...' : 'Sign In to HomeFeast'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Role Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '8px' }}>
                  I want to register as:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRole('CUSTOMER')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: role === 'CUSTOMER' ? '2px solid #DC2626' : '1.5px solid #EAE3D9',
                      background: role === 'CUSTOMER' ? '#FEF2F2' : '#FFFFFF',
                      color: role === 'CUSTOMER' ? '#DC2626' : '#57534E',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <User size={16} />
                    <span>Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('PROVIDER')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: role === 'PROVIDER' ? '2px solid #2B8A3E' : '1.5px solid #EAE3D9',
                      background: role === 'PROVIDER' ? '#EBFBEE' : '#FFFFFF',
                      color: role === 'PROVIDER' ? '#2B8A3E' : '#57534E',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <ChefHat size={16} />
                    <span>Home Cook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('RIDER')}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: role === 'RIDER' ? '2px solid #D9480F' : '1.5px solid #EAE3D9',
                      background: role === 'RIDER' ? '#FFF4E6' : '#FFFFFF',
                      color: role === 'RIDER' ? '#D9480F' : '#57534E',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Bike size={16} />
                    <span>Rider Hub</span>
                  </button>
                </div>
              </div>

              {/* Full Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Sunita Sharma"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+91 98290 12345"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>Password *</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Location (City & Locality) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>City *</label>
                  <select
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
                  >
                    <option value="jaipur">Jaipur</option>
                    <option value="ajmer">Ajmer</option>
                    <option value="kishangarh">Kishangarh</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1C1917', marginBottom: '4px' }}>Area / Locality *</label>
                  <input
                    type="text"
                    value={regArea}
                    onChange={e => setRegArea(e.target.value)}
                    placeholder="e.g. Malviya Nagar"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Provider Specific Details */}
              {role === 'PROVIDER' && (
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1.5px dashed #CBD5E1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#2B8A3E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ChefHat size={16} />
                    <span>Kitchen & Service Information (Admin Verified)</span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1C1917', marginBottom: '2px' }}>Business / Kitchen Name *</label>
                    <input
                      type="text"
                      value={regBusinessName}
                      onChange={e => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Annapurna Homestyle Rasoi"
                      required={role === 'PROVIDER'}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1C1917', marginBottom: '2px' }}>Cuisine Style</label>
                      <select
                        value={regCuisine}
                        onChange={e => setRegCuisine(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
                      >
                        <option value="North Indian">North Indian</option>
                        <option value="Rajasthani">Rajasthani</option>
                        <option value="Punjabi">Punjabi</option>
                        <option value="Jain">Jain / Satvik</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="South Indian">South Indian</option>
                        <option value="Maharashtrian">Maharashtrian</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1C1917', marginBottom: '2px' }}>Meal Type</label>
                      <select
                        value={regMealType}
                        onChange={e => setRegMealType(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
                      >
                        <option value="veg">Pure Veg</option>
                        <option value="both">Veg & Non-Veg</option>
                        <option value="jain">Pure Jain</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Rider Specific Details */}
              {role === 'RIDER' && (
                <div style={{ background: '#FFF9F2', padding: '14px', borderRadius: '14px', border: '1.5px dashed #FDBA74', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#D9480F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bike size={16} />
                    <span>Express Dabba Fleet Delivery Partner</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1C1917', marginBottom: '2px' }}>Vehicle Type *</label>
                      <select
                        value={regVehicleType}
                        onChange={e => setRegVehicleType(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none', background: '#FFF' }}
                      >
                        <option value="EV Scooter (Eco Delivery)">EV Scooter (Eco Delivery)</option>
                        <option value="Motorcycle / Bike">Motorcycle / Bike</option>
                        <option value="Bicycle (Local Eco Fleet)">Bicycle (Local Eco Fleet)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#1C1917', marginBottom: '2px' }}>Vehicle Number / ID *</label>
                      <input
                        type="text"
                        value={regVehicleNumber}
                        onChange={e => setRegVehicleNumber(e.target.value)}
                        placeholder="e.g. RJ 14 EV 4022"
                        required={role === 'RIDER'}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#B45309', background: 'rgba(232, 89, 12, 0.08)', padding: '6px 10px', borderRadius: '8px' }}>
                    ⚡ Earn ₹45 per tiffin delivery + ₹10 per steel dabba eco return!
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  background: role === 'PROVIDER'
                    ? 'linear-gradient(135deg, #2B8A3E 0%, #10B981 100%)'
                    : role === 'RIDER'
                    ? 'linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)'
                    : 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  marginTop: '4px'
                }}
              >
                <span>{loading ? 'Registering...' : role === 'PROVIDER' ? 'Submit Kitchen for Verification' : 'Create Free Account'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
