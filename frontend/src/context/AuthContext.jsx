import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { geoLocator } from '../utils/geoLocator';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Current active user (null when unauthenticated / guest)
  const [user, setUser] = useState(null);

  // Active City and Location State
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('homefeast_city') || 'jaipur';
  });
  const [selectedLocality, setSelectedLocality] = useState(() => {
    return localStorage.getItem('homefeast_locality') || 'Malviya Nagar';
  });
  const [liveGpsInfo, setLiveGpsInfo] = useState(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [allLocations, setAllLocations] = useState(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isPlanCheckoutModalOpen, setIsPlanCheckoutModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [activeModalData, setActiveModalData] = useState(null);

  // Subscriptions & Notifications state
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  // Initialize profile, locations and notifications on mount
  useEffect(() => {
    async function init() {
      const locs = await api.getLocations();
      if (locs) setAllLocations(locs);

      // Check if existing token
      const token = localStorage.getItem('homefeast_token');
      if (token) {
        const profile = await api.getProfile();
        if (profile) {
          setUser(profile);
          fetchSubscription();
          fetchNotifications();
        } else {
          localStorage.removeItem('homefeast_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    init();
  }, []);

  // Save selected city & locality to localStorage
  useEffect(() => {
    if (selectedCity) localStorage.setItem('homefeast_city', selectedCity);
    if (selectedLocality) localStorage.setItem('homefeast_locality', selectedLocality);
  }, [selectedCity, selectedLocality]);

  const fetchSubscription = async () => {
    try {
      setLoadingSub(true);
      const sub = await api.getActiveSubscription();
      if (sub) setActiveSubscription(sub);
    } catch (err) {
      console.warn('fetchSubscription error:', err);
    } finally {
      setLoadingSub(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const list = await api.getNotifications();
      if (Array.isArray(list)) {
        setNotifications(list);
        setUnreadNotifCount(list.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.warn('fetchNotifications error:', err);
    }
  };

  const markNotificationRead = async (id) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadNotifCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadNotifCount(0);
  };

  const refreshUserProfile = async () => {
    try {
      const token = localStorage.getItem('homefeast_token');
      if (token) {
        const profile = await api.getProfile();
        if (profile) {
          setUser(profile);
          fetchSubscription();
          fetchNotifications();
          return profile;
        }
      }
      return null;
    } catch (err) {
      console.warn('refreshUserProfile error:', err);
      return null;
    }
  };

  const updateUserProfile = async (payload) => {
    try {
      const res = await api.updateProfile(payload);
      if (res && res.success && res.data) {
        if (res.token) {
          localStorage.setItem('homefeast_token', res.token);
        }
        setUser(res.data);
        if (res.data.city) setSelectedCity(res.data.city);
        if (res.data.area) setSelectedLocality(res.data.area);
        window.dispatchEvent(new CustomEvent('homefeast_profile_updated', { detail: res.data }));
      }
      return res;
    } catch (err) {
      console.warn('updateUserProfile error:', err);
      return { success: false, message: 'Could not update profile.' };
    }
  };

  const loginUser = (userData) => {
    setUser(userData);
    if (userData.city) setSelectedCity(userData.city);
    if (userData.area) setSelectedLocality(userData.area);
    setIsAuthModalOpen(false);
    window.dispatchEvent(new CustomEvent('homefeast_profile_updated', { detail: userData }));
    fetchSubscription();
    fetchNotifications();
  };

  const logoutUser = async () => {
    await api.logout();
    localStorage.removeItem('homefeast_token');
    setUser(null);
    setActiveSubscription(null);
    setNotifications([]);
    setUnreadNotifCount(0);
    window.dispatchEvent(new CustomEvent('homefeast_profile_updated', { detail: null }));
  };

  const switchLocation = (cityId, localityName, newAddress, gpsData = null) => {
    const cleanCityId = (cityId || 'jaipur').toLowerCase().replace(/\s+/g, '-');
    setSelectedCity(cleanCityId);
    setSelectedLocality(localityName || 'City Center');
    if (gpsData) setLiveGpsInfo(gpsData);

    if (user && user.id !== 'guest') {
      setUser(prev => ({
        ...prev,
        city: cleanCityId,
        area: localityName || 'City Center',
        address: newAddress || prev.address
      }));
    }
    setIsLocationModalOpen(false);
  };

  const detectLiveLocation = async () => {
    try {
      setIsDetectingGps(true);
      const data = await geoLocator.detectLiveLocation();
      const detectedCityKey = (data.cityName || 'jaipur').toLowerCase().replace(/\s+/g, '-');
      const locality = data.locality || 'Live GPS Location';
      const address = data.formattedAddress;

      setLiveGpsInfo(data);
      switchLocation(detectedCityKey, locality, address, data);
      setIsDetectingGps(false);
      return { success: true, data };
    } catch (err) {
      setIsDetectingGps(false);
      return { success: false, error: err.message };
    }
  };

  const openPlanCheckout = (plan) => {
    setSelectedPlanForCheckout(plan);
    setIsPlanCheckoutModalOpen(true);
  };

  const openReviewModal = (data = null) => {
    setActiveModalData(data);
    setIsReviewModalOpen(true);
  };

  const openComplaintModal = (data = null) => {
    setActiveModalData(data);
    setIsComplaintModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginUser,
        logoutUser,
        selectedCity,
        selectedLocality,
        liveGpsInfo,
        isDetectingGps,
        detectLiveLocation,
        allLocations,
        switchLocation,
        // Modal states
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        openReviewModal,
        isComplaintModalOpen,
        setIsComplaintModalOpen,
        openComplaintModal,
        isPlanCheckoutModalOpen,
        setIsPlanCheckoutModalOpen,
        selectedPlanForCheckout,
        openPlanCheckout,
        activeModalData,
        // Subscriptions & Notifications
        activeSubscription,
        setActiveSubscription,
        fetchSubscription,
        loadingSub,
        notifications,
        unreadNotifCount,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        // Profile Helpers
        updateUserProfile,
        refreshUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
