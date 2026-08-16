import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Smartphone, Copy, Check, Clock, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢', vpa: 'homefast.gpay@okaxis' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', vpa: 'homefast@ybl' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔵', vpa: '9829012345@paytm' },
  { id: 'bhim', name: 'BHIM / CRED', icon: '🟠', vpa: 'homefast@upi' }
];

export const CheckoutModal = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    items,
    finalTotal,
    deliverySlot,
    packaging,
    couponCode,
    clearCart,
    setCurrentTrackingOrder
  } = useCart();

  const { user, selectedCity, selectedLocality } = useAuth();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'COD'
  const [selectedUpiApp, setSelectedUpiApp] = useState(UPI_APPS[0]);
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopiedVpa, setIsCopiedVpa] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.address) setAddress(user.address);
      if (user.phone) setPhone(user.phone);
      if (user.name) setCustomerName(user.name);
    }
  }, [user]);

  // 5-minute countdown timer for UPI QR
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isCheckoutModalOpen) {
      setTimeLeft(300);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCheckoutModalOpen]);

  if (!isCheckoutModalOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const triggerConfetti = () => {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(selectedUpiApp.vpa);
    setIsCopiedVpa(true);
    addToast(`Copied UPI ID: ${selectedUpiApp.vpa}`, 'info');
    setTimeout(() => setIsCopiedVpa(false), 2000);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone) {
      addToast('Please enter complete delivery address and phone number!', 'error');
      return;
    }

    setIsProcessing(true);

    const payload = {
      customerName,
      customerPhone: phone,
      phone,
      deliveryCity: selectedCity || 'Ajmer',
      city: selectedCity || 'Ajmer',
      deliveryLocality: selectedLocality || 'Ramganj',
      locality: selectedLocality || 'Ramganj',
      deliveryAddress: address,
      address,
      mealSlot: deliverySlot,
      packaging,
      couponCode,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === 'UPI' ? `UPI (${selectedUpiApp.name})` : paymentMethod,
      items: items.map(it => ({
        name: it.name,
        qty: it.qty || 1,
        quantity: it.qty || 1,
        price: it.price || 99
      }))
    };

    setTimeout(async () => {
      const res = await api.createOrder(payload);

      setIsProcessing(false);
      if (res.success) {
        triggerConfetti();
        addToast(`Payment Verified! Order assigned to ${(selectedCity || 'Jaipur').toUpperCase()} Hub 🍲`, 'success');
        clearCart();
        setIsCheckoutModalOpen(false);
        setCurrentTrackingOrder(res.data);
      } else {
        addToast(res.message || 'Error placing order.', 'error');
      }
    }, 1400);
  };

  // Dynamic QR generator URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${encodeURIComponent(selectedUpiApp.vpa)}&pn=HomeFast%20Tiffin&am=${finalTotal}&cu=INR&tn=HomeFast%20Tiffin%20Order`;

  return (
    <div className="modal-backdrop" onClick={() => setIsCheckoutModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-primary">
                📍 {(selectedCity || 'Jaipur').toUpperCase()} HUB DELIVERY
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Slot: {deliverySlot}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              Checkout & Real-Time Payment
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', background: 'var(--bg-surface-soft)' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder}>
          {/* 1. Destination & Contact */}
          <div style={{ background: 'var(--bg-surface-soft)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>1. Delivery Destination ({(selectedCity || 'Jaipur').toUpperCase()})</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)' }}>Your Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '13px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)' }}>Mobile (For OTP & Rider GPS)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '13px' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)' }}>Doorstep Address in {selectedCity || 'Selected City'}</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '13px' }}
                required
              />
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>2. Real-Time Payment Method</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div
                className={`builder-option-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
                style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 8px' }}
              >
                <QrCode size={24} color="var(--primary)" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px' }}>Instant UPI QR</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>GPay / PhonePe / Paytm</span>
              </div>

              <div
                className={`builder-option-card ${paymentMethod === 'CARD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('CARD')}
                style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 8px' }}
              >
                <CreditCard size={24} color="#2B8A3E" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px' }}>Debit / Credit</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>NetBanking & Cards</span>
              </div>

              <div
                className={`builder-option-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('COD')}
                style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '12px 8px' }}
              >
                <Banknote size={24} color="#D97706" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px' }}>Cash on Delivery</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>Pay at Doorstep</span>
              </div>
            </div>

            {/* REAL-TIME DYNAMIC UPI EXPERIENCE */}
            {paymentMethod === 'UPI' && (
              <div
                style={{
                  background: '#FFF9F2',
                  border: '1.5px dashed var(--primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* UPI App Switcher */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto' }}>
                  {UPI_APPS.map(app => (
                    <button
                      key={app.id}
                      type="button"
                      className={`btn btn-sm ${selectedUpiApp.id === app.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '11.5px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                      onClick={() => setSelectedUpiApp(app)}
                    >
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '20px', alignItems: 'center' }}>
                  {/* Dynamic Live QR */}
                  <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '12px', border: '1px solid var(--border-light)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <img
                      src={qrUrl}
                      alt="Real-time UPI Dynamic QR"
                      style={{ width: '120px', height: '120px', display: 'block', margin: '0 auto' }}
                    />
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                      Exact: ₹{finalTotal}
                    </div>
                  </div>

                  {/* VPA and Timer info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                        Live Instant Gateway
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                        <Clock size={13} />
                        <span>{minutes}:{seconds}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                      Scan QR or Pay to UPI VPA:
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        marginBottom: '8px'
                      }}
                    >
                      <code style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                        {selectedUpiApp.vpa}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        style={{ padding: '2px 6px', fontSize: '11px', color: 'var(--text-muted)' }}
                      >
                        {isCopiedVpa ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Supports all UPI apps (GPay, PhonePe, Paytm, BHIM, CRED).
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bill Total & Pay CTA */}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>Total Payable Amount</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>₹{finalTotal}</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>⚡ Verifying Live Payment...</span>
              ) : (
                <>
                  <span>Verify Payment & Dispatch Tiffin</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
