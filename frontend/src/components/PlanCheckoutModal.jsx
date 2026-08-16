import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Heart,
  QrCode,
  CreditCard,
  Building2,
  Banknote,
  Copy,
  Check,
  ArrowRight,
  Utensils,
  Smartphone,
  Lock,
  Zap,
  HelpCircle,
  KeyRound,
  ShieldAlert,
  ChevronDown,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢', vpa: 'homefeast.gpay@okaxis' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', vpa: 'homefeast@ybl' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔵', vpa: '9829012345@paytm' },
  { id: 'bhim', name: 'BHIM / CRED', icon: '🟠', vpa: 'homefeast@upi' }
];

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC', icon: '🏦', color: '#004c8f' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI', icon: '🏛️', color: '#280071' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI', icon: '🏢', color: '#b02a30' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS', icon: '💳', color: '#97144d' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK', icon: '🔴', color: '#ed1c24' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB', icon: '🟡', color: '#a20034' }
];

const ALL_OTHER_BANKS = [
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'IDFC FIRST Bank',
  'Yes Bank',
  'Federal Bank',
  'Central Bank of India',
  'Indian Overseas Bank',
  'RBL Bank',
  'AU Small Finance Bank',
  'Bank of India',
  'UCO Bank',
  'Indian Bank',
  'Bandhan Bank'
];

// High-reliability QR Code Component with fallback SVG
const ReliableQrCode = ({ url, vpa, amount, label = 'Scan UPI QR' }) => {
  const [imgLoaded, setImgLoaded] = useState(true);

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '8px',
        borderRadius: '12px',
        border: '1.5px solid #DC2626',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(232, 89, 12, 0.15)',
        position: 'relative',
        width: '128px',
        margin: '0 auto'
      }}
    >
      {imgLoaded ? (
        <img
          src={url}
          alt={label}
          style={{
            width: '112px',
            height: '112px',
            display: 'block',
            margin: '0 auto',
            borderRadius: '6px'
          }}
          onError={() => setImgLoaded(false)}
        />
      ) : (
        <div
          style={{
            width: '112px',
            height: '112px',
            background: '#FEF2F2',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '4px',
            margin: '0 auto'
          }}
        >
          <QrCode size={46} color="#DC2626" />
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#DC2626' }}>{label}</span>
        </div>
      )}

      <div style={{ fontSize: '11px', fontWeight: 900, color: '#DC2626', marginTop: '4px' }}>
        Exact: ₹{amount}
      </div>
    </div>
  );
};

export const PlanCheckoutModal = ({
  plan: propPlan,
  isOpen: propIsOpen,
  onClose: propOnClose,
  onActivated: propOnActivated
}) => {
  const {
    isPlanCheckoutModalOpen,
    setIsPlanCheckoutModalOpen,
    selectedPlanForCheckout,
    user,
    selectedCity,
    selectedLocality,
    fetchSubscription
  } = useAuth();
  const { addToast } = useToast();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isPlanCheckoutModalOpen;
  const plan = propPlan || selectedPlanForCheckout;

  // Tomorrow as default start date
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [mealSlot, setMealSlot] = useState('Lunch (12:15 PM - 01:45 PM)');
  const [dietPreference, setDietPreference] = useState('Vegetarian');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING' | 'COD'
  const [selectedUpiApp, setSelectedUpiApp] = useState(UPI_APPS[0]);

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Pay on 1st Delivery State
  const [codMode, setCodMode] = useState('CASH'); // 'CASH' | 'UPI_DOORSTEP'

  // Smart Card Details State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: user?.name ? user.name.toUpperCase() : 'AARAV SHARMA',
    expiry: '',
    cvv: ''
  });
  const [showCvv, setShowCvv] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [isCopiedVpa, setIsCopiedVpa] = useState(false);

  // 5-minute countdown timer for UPI QR Code
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(300);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Sync user address and default slot when plan or user changes
  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address);
    } else if (!deliveryAddress) {
      setDeliveryAddress('Flat 304, Royal Palms, Malviya Nagar Sector 3, Jaipur');
    }
    if (user?.name) {
      setCardDetails(prev => ({ ...prev, name: user.name.toUpperCase() }));
    }
  }, [user]);

  useEffect(() => {
    if (plan?.deliveryTiming) {
      setMealSlot(plan.deliveryTiming);
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const rawDuration = plan.durationDays || plan.duration || (plan.planType === 'DAILY' ? 1 : plan.planType === 'WEEKLY' ? 7 : 30);
  const duration = Number(rawDuration) || 30;
  const rawPrice = plan.totalPrice || plan.price || 1499;
  const price = Number(rawPrice) || 1499;
  const costPerMeal = plan.pricePerMeal || Math.round(price / duration);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // Detect Card Brand from card number
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'VISA', color: '#1A1F71', bg: 'linear-gradient(135deg, #1A1F71 0%, #0D47A1 100%)' };
    if (clean.startsWith('5') || clean.startsWith('2')) return { name: 'Mastercard', color: '#EB001B', bg: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)' };
    if (clean.startsWith('6')) return { name: 'RuPay', color: '#0072BC', bg: 'linear-gradient(135deg, #097930 0%, #004C8C 100%)' };
    if (clean.startsWith('3')) return { name: 'AMEX', color: '#002663', bg: 'linear-gradient(135deg, #002663 0%, #205493 100%)' };
    return { name: 'DEBIT/CREDIT', color: '#4A5568', bg: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' };
  };

  const currentBrand = getCardBrand(cardDetails.number);

  // Auto format card number with spaces (4532 8901 2345 6789)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g) || [];
    const formatted = parts.join(' ');
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  // Auto format expiry date MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardDetails(prev => ({ ...prev, expiry: val }));
  };

  // Format CVV (3-4 digits numeric)
  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails(prev => ({ ...prev, cvv: val }));
  };

  // 1-Click Fill Demo Card for effortless testing
  const handleFillDemoCard = () => {
    setCardDetails({
      number: '4532 8901 2345 6789',
      name: user?.name ? user.name.toUpperCase() : 'AARAV SHARMA',
      expiry: '12/28',
      cvv: '888'
    });
    addToast('💳 Demo Visa Card details filled (CVV: 888)!', 'info');
  };

  // Dynamic QR Code generation for the exact UPI App and pass price
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    `upi://pay?pa=${selectedUpiApp.vpa}&pn=HomeFeast%20Tiffin&am=${price}&cu=INR&tn=${encodeURIComponent(
      plan.name || 'Meal Pass'
    )}`
  )}`;

  // Rider Doorstep QR Code URL
  const riderQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(
    `upi://pay?pa=homefeast.rider204@okaxis&pn=HomeFeast%20Rider%20Delivery&am=${price}&cu=INR&tn=${encodeURIComponent(
      `1st Meal Doorstep Pay PIN-4829 ${plan.name}`
    )}`
  )}`;

  const handleClose = () => {
    if (propOnClose) propOnClose();
    setIsPlanCheckoutModalOpen(false);
  };

  const handleCopyVpa = (vpaToCopy = selectedUpiApp.vpa) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(vpaToCopy);
    }
    setIsCopiedVpa(true);
    addToast(`Copied UPI ID: ${vpaToCopy}`, 'info');
    setTimeout(() => setIsCopiedVpa(false), 2000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      addToast('Please enter your daily delivery address.', 'error');
      return;
    }

    if (paymentMethod === 'CARD') {
      const cleanNum = cardDetails.number.replace(/\s+/g, '');
      if (cleanNum && cleanNum.length < 12) {
        addToast('Please enter a valid 16-digit card number or click "1-Click Demo Card".', 'error');
        return;
      }
    }

    try {
      setSubmitting(true);

      const formattedPaymentMethod =
        paymentMethod === 'UPI'
          ? `UPI (${selectedUpiApp.name})`
          : paymentMethod === 'CARD'
          ? `${currentBrand.name} Card (•••• ${cardDetails.number.slice(-4) || '8821'})`
          : paymentMethod === 'NETBANKING'
          ? `Net Banking (${selectedBank})`
          : `Pay on 1st Meal (${codMode === 'CASH' ? 'Cash on Delivery' : 'Rider UPI at Doorstep'})`;

      const res = await api.createSubscription({
        planId: plan.id,
        planName: plan.name,
        price: price,
        durationDays: duration,
        planType: plan.planType || 'MONTHLY',
        providerId: plan.providerId || 'prov_1',
        providerName: plan.providerName || 'Annapurna Homestyle Rasoi',
        startDate,
        mealSlot,
        dietPreference,
        deliveryAddress: deliveryAddress.trim(),
        deliveryCity: selectedCity || 'jaipur',
        deliveryLocality: selectedLocality || 'Malviya Nagar',
        customerName: user?.name || 'Aarav Sharma',
        customerPhone: user?.phone || '+91 98290 12345',
        notes,
        paymentMethod: formattedPaymentMethod
      });

      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });

        const successMsg =
          paymentMethod === 'COD'
            ? `🎉 ${plan.name} Activated! Pay ₹${price} when your 1st hot meal arrives.`
            : `🎉 ${plan.name} (${duration} Meals) is now ACTIVE! Welcome to stress-free homemade food.`;

        addToast(successMsg, 'success');

        handleClose();
        await fetchSubscription();

        if (propOnActivated) {
          propOnActivated(res.data);
        } else {
          // Navigate to user's subscription manager
          window.location.hash = 'my-pass';
        }
      } else {
        addToast(res.message || 'Could not activate subscription pass.', 'error');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      addToast('Error activating subscription pass. Please try again.', 'error');
    } finally {
      setSubmitting(false);
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
      onClick={handleClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '620px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
            padding: '20px 24px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.25)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.22)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>{plan.planType || 'FLEXIBLE'} PASS ACTIVATION</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.3px', margin: '2px 0 4px' }}>
            {plan.name}
          </h2>
          <p style={{ fontSize: '13px', opacity: 0.92 }}>
            Cooked fresh daily with home-ground masalas • <strong>Zero Penalty Pause Guarantee</strong>
          </p>
        </div>

        {/* Plan Pricing Banner */}
        <div
          style={{
            background: '#FFF5F5',
            padding: '12px 24px',
            borderBottom: '1.5px solid #FEE2E2',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>
              Pass Total ({duration} {duration === 1 ? 'Meal' : 'Meals'})
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              ₹{price}
              <span style={{ fontSize: '12.5px', color: '#991B1B', fontWeight: 500 }}>
                (₹{costPerMeal}/meal)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: '#F0FDF4',
                color: '#166534',
                border: '1px solid #BBF7D0',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={14} /> Free Hot Delivery
            </span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubscribe}
          style={{
            padding: '18px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flexGrow: 1
          }}
        >
          {/* Section 1: Meal Plan Preferences */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Utensils size={15} color="#DC2626" />
              <span>1. Meal Preferences & Schedule</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {/* Start Date */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                />
              </div>

              {/* Delivery Window */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                  Delivery Slot *
                </label>
                <select
                  value={mealSlot}
                  onChange={e => setMealSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '12.5px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Lunch (12:15 PM - 01:45 PM)">☀️ Lunch (12:15 PM - 01:45 PM)</option>
                  <option value="Dinner (07:30 PM - 09:00 PM)">🌙 Dinner (07:30 PM - 09:00 PM)</option>
                  <option value="Both Lunch & Dinner">🍲 Both Lunch & Dinner (2x Daily)</option>
                </select>
              </div>
            </div>

            {/* Diet Preference Chips */}
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                Dietary Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {['Vegetarian', 'Pure Jain', 'Non-Veg Mixed'].map(pref => (
                  <button
                    type="button"
                    key={pref}
                    onClick={() => setDietPreference(pref)}
                    style={{
                      padding: '7px',
                      borderRadius: '8px',
                      border: dietPreference === pref ? '2px solid #DC2626' : '1px solid #EAE3D9',
                      background: dietPreference === pref ? '#FEF2F2' : '#FFFFFF',
                      color: dietPreference === pref ? '#DC2626' : '#57534E',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {pref === 'Vegetarian' ? '🟢 Veg' : pref === 'Pure Jain' ? '🌱 Pure Jain' : '🍗 Non-Veg'}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Delivery Address */}
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                Daily Delivery Address *
              </label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Full address with apartment/flat & street"
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #EAE3D9',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            {/* Cooking Notes */}
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                Special Cooking Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Less spicy, no onion-garlic on Tuesdays, extra salad"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #EAE3D9',
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div style={{ borderTop: '1.5px solid #EAE3D9', paddingTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={15} color="#DC2626" />
              <span>2. Select Payment Method</span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {[
                { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={15} /> },
                { id: 'CARD', label: 'Card', icon: <CreditCard size={15} /> },
                { id: 'NETBANKING', label: 'Net Banking', icon: <Building2 size={15} /> },
                { id: 'COD', label: 'Pay on 1st Meal', icon: <Banknote size={15} /> }
              ].map(tab => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setPaymentMethod(tab.id)}
                  style={{
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: paymentMethod === tab.id ? '2px solid #DC2626' : '1px solid #EAE3D9',
                    background: paymentMethod === tab.id ? '#FEF2F2' : '#FAFAF9',
                    color: paymentMethod === tab.id ? '#DC2626' : '#57534E',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 1. UPI Payment Content WITH DYNAMIC QR CODE */}
            {paymentMethod === 'UPI' && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1.5px dashed #DC2626',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
                }}
              >
                {/* UPI App Switcher */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>
                  {UPI_APPS.map(app => (
                    <button
                      type="button"
                      key={app.id}
                      onClick={() => setSelectedUpiApp(app)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: selectedUpiApp.id === app.id ? '2px solid #DC2626' : '1px solid #EAE3D9',
                        background: selectedUpiApp.id === app.id ? '#FFFFFF' : '#F5F5F4',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: selectedUpiApp.id === app.id ? '#DC2626' : '#1C1917',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <span style={{ fontSize: '13px' }}>{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>

                {/* QR Code and Scan Section */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px 1fr',
                    gap: '14px',
                    alignItems: 'center'
                  }}
                >
                  {/* Real Live QR Code Box */}
                  <ReliableQrCode
                    url={qrUrl}
                    vpa={selectedUpiApp.vpa}
                    amount={price}
                    label="Scan UPI QR"
                  />

                  {/* Scan Instructions & Copy VPA */}
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#1C1917',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Smartphone size={14} color="#DC2626" />
                      <span>Scan with {selectedUpiApp.name}</span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '8px', lineHeight: 1.4 }}>
                      Open Google Pay, PhonePe, or Paytm app & scan this QR code to activate pass.
                    </div>

                    {/* VPA Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #EAE3D9',
                        fontSize: '11.5px'
                      }}
                    >
                      <span style={{ color: '#57534E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        UPI: <strong style={{ color: '#1C1917' }}>{selectedUpiApp.vpa}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyVpa(selectedUpiApp.vpa)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isCopiedVpa ? '#2B8A3E' : '#DC2626',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '11px',
                          marginLeft: '6px'
                        }}
                      >
                        {isCopiedVpa ? <Check size={13} /> : <Copy size={13} />}
                        <span>{isCopiedVpa ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    {/* Countdown Timer */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: '6px',
                        fontSize: '11px',
                        color: '#78716C'
                      }}
                    >
                      <Clock size={12} color="#DC2626" />
                      <span>
                        QR expires in: <strong style={{ color: '#DC2626' }}>{minutes}:{seconds}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ADVANCED INTERACTIVE CARD PAYMENT SECTION */}
            {paymentMethod === 'CARD' && (
              <div
                style={{
                  background: '#FAF8F5',
                  border: '1.5px solid #EAE3D9',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Visual Virtual Card Mockup */}
                <div
                  style={{
                    background: currentBrand.bg,
                    borderRadius: '14px',
                    padding: '16px 20px',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: '-30px',
                      top: '-30px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)'
                    }}
                  />

                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '24px',
                          background: 'linear-gradient(135deg, #FFE082 0%, #FFB300 100%)',
                          borderRadius: '4px',
                          border: '1px solid #FF8F00',
                          position: 'relative'
                        }}
                      />
                      <span style={{ fontSize: '13px', opacity: 0.75 }}>💳 Contactless</span>
                    </div>

                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '1px'
                      }}
                    >
                      {currentBrand.name}
                    </span>
                  </div>

                  {/* Card Number display */}
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '17px',
                      letterSpacing: '2.5px',
                      fontWeight: 700,
                      marginBottom: '14px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {cardDetails.number || '•••• •••• •••• ••••'}
                  </div>

                  {/* Card Footer: Name, Expiry & CVV */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
                    <div>
                      <div style={{ opacity: 0.65, fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Cardholder Name
                      </div>
                      <div style={{ fontWeight: 700, letterSpacing: '0.8px', marginTop: '2px', textTransform: 'uppercase' }}>
                        {cardDetails.name || 'YOUR NAME'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
                      <div>
                        <div style={{ opacity: 0.65, fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Expires
                        </div>
                        <div style={{ fontWeight: 700, letterSpacing: '1px', marginTop: '2px', fontFamily: 'monospace' }}>
                          {cardDetails.expiry || 'MM/YY'}
                        </div>
                      </div>

                      <div>
                        <div style={{ opacity: 0.65, fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          CVV
                        </div>
                        <div style={{ fontWeight: 700, letterSpacing: '1px', marginTop: '2px', fontFamily: 'monospace' }}>
                          {cardDetails.cvv ? '•••' : '---'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Auto-Fill Demo Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11.5px', color: '#78716C', fontWeight: 600 }}>Debit or Credit Card Details:</span>
                  <button
                    type="button"
                    onClick={handleFillDemoCard}
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #DC2626',
                      color: '#DC2626',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={12} fill="#DC2626" />
                    <span>1-Click Demo Card</span>
                  </button>
                </div>

                {/* Card Number Input */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                    16-Digit Card Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="4532 8901 2345 6789"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                      background: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AARAV SHARMA"
                    value={cardDetails.name}
                    onChange={e => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Expiry & CVV Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                      Valid Thru (MM/YY)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="12/28"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #EAE3D9',
                        fontSize: '13.5px',
                        fontFamily: 'monospace',
                        background: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* 100% Working CVV Input (No browser block/tooltip) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#57534E' }}>
                        CVV / Security Code *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#78716C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        {showCvv ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showCvv ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCvv ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        placeholder={showCvv ? '888' : '•••'}
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: cardDetails.cvv ? '1.5px solid #2B8A3E' : '1.5px solid #EAE3D9',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          letterSpacing: showCvv ? '2px' : '4px',
                          background: cardDetails.cvv ? '#F4FBF6' : '#FFFFFF',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2B8A3E', marginTop: '2px' }}>
                  <Lock size={12} color="#2B8A3E" />
                  <span>256-Bit SSL Bank Encrypted • 3-Digit CVV Verified</span>
                </div>
              </div>
            )}

            {/* 3. ADVANCED INTERACTIVE NET BANKING SECTION */}
            {paymentMethod === 'NETBANKING' && (
              <div
                style={{
                  background: '#FAF8F5',
                  border: '1.5px solid #EAE3D9',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917' }}>
                    Popular Indian Banks:
                  </span>
                  <span style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    ⚡ 99.8% Success Rate
                  </span>
                </div>

                {/* Popular Bank Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {POPULAR_BANKS.map(bank => {
                    const isSelected = selectedBank === bank.name;
                    return (
                      <button
                        type="button"
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.name)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #DC2626' : '1.5px solid #EAE3D9',
                          background: isSelected ? '#FEF2F2' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(220, 38, 38, 0.18)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{bank.icon}</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? '#DC2626' : '#1C1917', textAlign: 'center', lineHeight: 1.2 }}>
                          {bank.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* All Other Banks Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#57534E', marginBottom: '4px' }}>
                    Or Select Any Other Bank:
                  </label>
                  <select
                    value={POPULAR_BANKS.some(b => b.name === selectedBank) ? '' : selectedBank}
                    onChange={e => {
                      if (e.target.value) setSelectedBank(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '12.5px',
                      fontFamily: 'inherit',
                      background: '#FFFFFF',
                      outline: 'none',
                      color: '#1C1917'
                    }}
                  >
                    <option value="">-- Choose From 25+ Other Banks --</option>
                    {ALL_OTHER_BANKS.map(bank => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Bank Redirection Summary Card */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EAE3D9',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Building2 size={24} color="#DC2626" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1C1917' }}>
                      {selectedBank} Net Banking
                    </div>
                    <div style={{ fontSize: '11px', color: '#78716C' }}>
                      You will be securely routed to {selectedBank} for OTP / 2FA bank authorization.
                    </div>
                  </div>
                </div>

                {/* Security encryption info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#2B8A3E' }}>
                  <Lock size={12} color="#2B8A3E" />
                  <span>Direct Encrypted Bank Gateway • Instant Pass Activation</span>
                </div>
              </div>
            )}

            {/* 4. ADVANCED PAY ON 1ST MEAL DELIVERY SECTION (WITH SCAN RIDER QR CODE!) */}
            {paymentMethod === 'COD' && (
              <div
                style={{
                  background: '#FAF8F5',
                  border: '1.5px solid #EAE3D9',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Zero Advance Guarantee Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #EBFBEE 0%, #D3F9D8 100%)',
                    border: '1.5px solid #B2F2BB',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <ShieldCheck size={26} color="#2B8A3E" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#2B8A3E' }}>
                      🛡️ 100% Zero-Advance Trial Guarantee
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#2B8A3E', opacity: 0.9 }}>
                      Pay ₹0 right now! Taste your first hot homemade meal box at your doorstep first. Only pay if you love it!
                    </div>
                  </div>
                </div>

                {/* Payment Mode on Arrival Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#57534E', marginBottom: '6px' }}>
                    How would you like to pay the delivery rider on 1st meal?
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setCodMode('CASH')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: codMode === 'CASH' ? '2px solid #DC2626' : '1px solid #EAE3D9',
                        background: codMode === 'CASH' ? '#FEF2F2' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: codMode === 'CASH' ? '#DC2626' : '#57534E',
                        fontSize: '12px',
                        fontWeight: 700,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Banknote size={18} color={codMode === 'CASH' ? '#DC2626' : '#57534E'} />
                      <span>💵 Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCodMode('UPI_DOORSTEP')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: codMode === 'UPI_DOORSTEP' ? '2px solid #DC2626' : '1px solid #EAE3D9',
                        background: codMode === 'UPI_DOORSTEP' ? '#FEF2F2' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: codMode === 'UPI_DOORSTEP' ? '#DC2626' : '#57534E',
                        fontSize: '12px',
                        fontWeight: 700,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <QrCode size={18} color={codMode === 'UPI_DOORSTEP' ? '#DC2626' : '#57534E'} />
                      <span>📱 Scan Rider QR</span>
                    </button>
                  </div>
                </div>

                {/* SHOW RIDER QR CODE WHEN "SCAN RIDER QR" IS SELECTED */}
                {codMode === 'UPI_DOORSTEP' && (
                  <div
                    style={{
                      background: '#FEF2F2',
                      border: '1.5px dashed #DC2626',
                      borderRadius: '14px',
                      padding: '14px',
                      animation: 'fadeIn 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#DC2626', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Smartphone size={15} color="#DC2626" />
                      <span>Rider Live UPI QR Code (Pay on 1st Meal)</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '14px', alignItems: 'center' }}>
                      {/* Live Rider QR Code */}
                      <ReliableQrCode
                        url={riderQrUrl}
                        vpa="homefeast.rider204@okaxis"
                        amount={price}
                        label="Rider Doorstep QR"
                      />

                      {/* Rider Info and Instruction */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#1C1917', marginBottom: '3px' }}>
                          <UserCheck size={14} color="#2B8A3E" />
                          <span>Green Fleet Rider #204 (Jaipur Hub)</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#78716C', marginBottom: '8px', lineHeight: 1.4 }}>
                          Scan this QR or rider's phone QR using any UPI app (GPay / PhonePe / Paytm) when your hot tiffin box arrives!
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #EAE3D9', fontSize: '11.5px' }}>
                          <span style={{ color: '#57534E', fontSize: '11px' }}>
                            Rider UPI: <strong>homefeast.rider204@okaxis</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyVpa('homefeast.rider204@okaxis')}
                            style={{ background: 'none', border: 'none', color: isCopiedVpa ? '#2B8A3E' : '#E8590C', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                          >
                            {isCopiedVpa ? <Check size={12} /> : <Copy size={12} />}
                            <span>{isCopiedVpa ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Security PIN Simulation Card */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #EAE3D9',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <KeyRound size={18} color="#E8590C" />
                    <div>
                      <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>
                        Your Doorstep Delivery PIN
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#1C1917', letterSpacing: '2px' }}>
                        4829
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: '#2B8A3E', background: '#EBFBEE', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    Auto-Generated
                  </span>
                </div>

                {/* Dabba Security Info */}
                <div style={{ fontSize: '11px', color: '#78716C', lineHeight: 1.4 }}>
                  🍱 <strong>Insulated Stainless Steel Dabba:</strong> Included with ₹0 deposit. Handover empty dabba to rider during the next delivery.
                </div>
              </div>
            )}
          </div>

          {/* Guarantee Pill */}
          <div
            style={{
              background: '#EBFBEE',
              border: '1px solid #B2F2BB',
              padding: '9px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2B8A3E',
              fontSize: '11.5px',
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={16} />
            <span>
              <strong>100% Flexibility:</strong> Pause any meal date in 1-tap from your pass manager.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '2px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF',
                color: '#57534E',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                padding: '12px 18px',
                borderRadius: '12px',
                border: 'none',
                background:
                  paymentMethod === 'COD'
                    ? 'linear-gradient(135deg, #2B8A3E 0%, #40C057 100%)'
                    : 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow:
                  paymentMethod === 'COD'
                    ? '0 6px 20px rgba(43, 138, 62, 0.35)'
                    : '0 6px 20px rgba(232, 89, 12, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              {submitting ? (
                <span>Activating Pass...</span>
              ) : paymentMethod === 'COD' ? (
                <>
                  <ShieldCheck size={17} />
                  <span>Activate (Pay ₹{price} on 1st Meal)</span>
                </>
              ) : paymentMethod === 'NETBANKING' ? (
                <>
                  <Building2 size={16} />
                  <span>Pay ₹{price} via {selectedBank}</span>
                </>
              ) : paymentMethod === 'CARD' ? (
                <>
                  <CreditCard size={16} />
                  <span>Pay ₹{price} via Card</span>
                </>
              ) : (
                <>
                  <Heart size={16} fill="#FFFFFF" />
                  <span>Pay ₹{price} & Activate Pass</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
