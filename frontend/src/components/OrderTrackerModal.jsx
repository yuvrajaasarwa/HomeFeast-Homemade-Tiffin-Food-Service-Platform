import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  ChefHat,
  Package,
  Bike,
  MapPin,
  Phone,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Clock,
  Flame,
  Check,
  MessageCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

const TRACKING_STEPS = [
  { key: 'CREATED', label: 'Order Confirmed', desc: 'Kitchen station assigned & fresh ingredients prepped', icon: ChefHat },
  { key: 'COOKING', label: 'Fresh Homestyle Cooking', desc: 'Simmering in cold-pressed oil & pure cow ghee', icon: Flame },
  { key: 'PACKED', label: 'Packed in Steel Dabba', desc: 'Thermal seal locked at 70°C heat retention', icon: Package },
  { key: 'OUT_FOR_DELIVERY', label: 'Rider Out for Delivery', desc: 'On electric green vehicle with hot insulated bag', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered at Doorstep', desc: 'Ghar jaisa swad ready to enjoy! 🍲', icon: CheckCircle }
];

const STATUS_INDEX_MAP = {
  PENDING: 0,
  CREATED: 0,
  ACCEPTED: 0,
  COOKING: 1,
  PREPARING: 1,
  PACKED: 2,
  OUT_FOR_DELIVERY: 3,
  RIDER_OUT: 3,
  DELIVERED: 4
};

export const OrderTrackerModal = () => {
  const { currentTrackingOrder, setCurrentTrackingOrder, isOrderTrackerOpen, setIsOrderTrackerOpen } = useCart();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    if (currentTrackingOrder?.id) {
      setOrder(currentTrackingOrder);
      // Fetch latest live order data from server to stay in sync with Rider and Cook
      api.getOrderById(currentTrackingOrder.id).then(res => {
        if (res && res.success && res.data) {
          setOrder(res.data);
        }
      }).catch(err => console.error('Order fetch error:', err));
    } else {
      setOrder(null);
    }
  }, [currentTrackingOrder?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setOrder(null);
    setShowCallModal(false);
    if (setCurrentTrackingOrder) setCurrentTrackingOrder(null);
    if (setIsOrderTrackerOpen) setIsOrderTrackerOpen(false);
  };

  if (!isOrderTrackerOpen || (!order && !currentTrackingOrder)) return null;

  const activeOrder = order || currentTrackingOrder;
  if (!activeOrder) return null;

  const statusVal = String(activeOrder.orderStatus || activeOrder.status || 'COOKING').toUpperCase();
  const activeIndex =
    activeOrder.statusStep !== undefined
      ? activeOrder.statusStep
      : STATUS_INDEX_MAP[statusVal] !== undefined
      ? STATUS_INDEX_MAP[statusVal]
      : 1;

  const isDelivered = activeIndex === 4 || statusVal === 'DELIVERED';
  const riderPhone = String(activeOrder.rider?.phone || '+91 98290 30001');
  const riderName = String(activeOrder.rider?.name || 'Vikas Saini (Express Rider)');

  // Advance status simulation
  const handleAdvanceStatus = async () => {
    if (!activeOrder?.id) return;
    try {
      setIsUpdating(true);
      const res = await api.advanceOrderStatus(activeOrder.id);
      setIsUpdating(false);
      if (res && res.success && res.data) {
        setOrder(res.data);
        window.dispatchEvent(new CustomEvent('homefeast_order_updated', { detail: res.data }));
        const nextStatusName = (res.data.orderStatus || '').replace(/_/g, ' ');
        addToast(`Tiffin updated: ${nextStatusName} 🍲`, 'info');
      } else {
        // Fallback simulation in state
        const steps = ['CREATED', 'COOKING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
        const nextIdx = (activeIndex + 1) % steps.length;
        const updated = {
          ...activeOrder,
          orderStatus: steps[nextIdx],
          statusStep: nextIdx,
          rider: {
            ...(activeOrder.rider || {}),
            name: activeOrder.rider?.name || 'Vikas Saini (Express Rider)',
            phone: activeOrder.rider?.phone || '+91 98290 30001',
            currentLocation:
              nextIdx === 4
                ? 'Delivered at Doorstep - Enjoy your meal! 🍲'
                : nextIdx === 3
                ? '0.3 km away entering society gate'
                : nextIdx === 2
                ? 'Packed in hot thermal steel dabba (70°C)'
                : 'Preparing in Kitchen Station #1'
          }
        };
        setOrder(updated);
        window.dispatchEvent(new CustomEvent('homefeast_order_updated', { detail: updated }));
        addToast(`Tiffin updated: ${steps[nextIdx].replace(/_/g, ' ')} 🍲`, 'info');
      }
    } catch (err) {
      setIsUpdating(false);
      addToast('Error advancing status', 'error');
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText(riderPhone);
    setCopiedPhone(true);
    addToast(`Rider phone number copied: ${riderPhone}`, 'success');
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <>
      {/* Main Order Tracker Modal */}
      <div
        className="modal-backdrop"
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }}
      >
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '620px',
            width: '100%',
            borderRadius: '24px',
            border: '1.5px solid #EAE3D9',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            background: '#FFFFFF',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '24px',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FFE8CC',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  LIVE TIFFIN TRACKER
                </span>
                <span style={{ fontSize: '12px', color: '#78716C', fontWeight: 700 }}>#{activeOrder.id}</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1C1917', margin: '6px 0 0' }}>
                {isDelivered ? 'Tiffin Delivered! 🎉' : 'Your Hot Meal is on Its Way'}
              </h2>
            </div>

            {/* Top Cross X Button */}
            <button
              type="button"
              id="close-order-tracker-btn"
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F5F5F4',
                border: '1px solid #EAE3D9',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#57534E',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#DC2626';
                e.currentTarget.style.borderColor = '#DC2626';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#F5F5F4';
                e.currentTarget.style.color = '#57534E';
                e.currentTarget.style.borderColor = '#EAE3D9';
              }}
              title="Close Tracker"
            >
              <X size={18} />
            </button>
          </div>

          {/* Estimated Arrival Banner */}
          <div
            style={{
              background: isDelivered ? '#EBFBEE' : '#FFF9F2',
              border: isDelivered ? '1.5px solid #D3F9D8' : '1.5px solid #FFE8CC',
              borderRadius: '16px',
              padding: '10px 16px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={isDelivered ? '#2B8A3E' : '#DC2626'} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: isDelivered ? '#2B8A3E' : '#DC2626' }}>
                {isDelivered
                  ? 'Delivered Fresh & Hot 🍲'
                  : activeIndex === 3
                  ? '⚡ 6 Mins Away • Arriving Soon'
                  : activeIndex === 2
                  ? '🔒 Thermal Sealed at 70°C'
                  : '🍳 Cooking in Fresh Desi Ghee'}
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#78716C', fontWeight: 600 }}>
              {activeOrder.deliveryTime || 'Lunch (12:30 PM)'}
            </span>
          </div>

          {/* Live Status Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    opacity: idx > activeIndex ? 0.45 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#2B8A3E'
                        : isActive
                        ? '#DC2626'
                        : '#F5F5F4',
                      color: isCompleted || isActive ? '#FFFFFF' : '#A8A29E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 0 0 4px rgba(220, 38, 38, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 800,
                          color: isActive ? '#DC2626' : isCompleted ? '#1C1917' : '#78716C',
                          margin: 0
                        }}
                      >
                        {step.label}
                      </h4>
                      {isActive && (
                        <span
                          style={{
                            background: '#FEF2F2',
                            color: '#DC2626',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}
                        >
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#78716C', margin: '2px 0 0' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Partner Details */}
          {activeOrder.rider && (
            <div
              style={{
                background: '#FBFBFA',
                border: '1.5px solid #EAE3D9',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}
                >
                  🚴
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#1C1917', margin: 0 }}>
                    {riderName}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#78716C', marginTop: '2px' }}>
                    Vehicle: <strong>{activeOrder.rider.vehicleNumber || 'RJ 14 ST 4821'}</strong> • Rating: ★ {activeOrder.rider.rating || '4.9'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 700, marginTop: '2px' }}>
                    📍 {activeOrder.rider.currentLocation || 'Preparing in Kitchen Station #1'}
                  </div>
                </div>
              </div>

              {/* Call Rider Trigger Button */}
              <button
                type="button"
                id="open-call-rider-btn"
                onClick={() => setShowCallModal(true)}
                style={{
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: '1.5px solid #DC2626',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#DC2626';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#FEF2F2';
                  e.currentTarget.style.color = '#DC2626';
                }}
              >
                <Phone size={14} />
                <span>Call Rider</span>
              </button>
            </div>
          )}

          {/* Order Items & Destination */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #EAE3D9',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '18px'
            }}
          >
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              DELIVERING TO:
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '12px' }}>
              📍 {activeOrder.address || activeOrder.deliveryAddress || 'Flat 302, Subhash Nagar, Ajmer'}
            </div>

            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              ITEMS IN THIS DABBA:
            </div>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12.5px',
                padding: 0,
                margin: '0 0 10px 0'
              }}
            >
              {(activeOrder.items || []).map((it, idx) => {
                const itemQty = Number(it.qty || it.quantity) || 1;
                const itemPrice =
                  Number(it.price) ||
                  Number(activeOrder.totalAmount) / Math.max(1, activeOrder.items?.length || 1) ||
                  99;
                return (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#44403C' }}>
                      <strong>{itemQty}x</strong> {it.name}
                    </span>
                    <span style={{ fontWeight: 800, color: '#1C1917' }}>₹{Math.round(itemPrice * itemQty)}</span>
                  </li>
                );
              })}
            </ul>

            <div
              style={{
                borderTop: '1px solid #EAE3D9',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#57534E' }}>
                Total Paid ({activeOrder.paymentMethod || 'UPI (Google Pay)'})
              </span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#DC2626' }}>
                ₹{activeOrder.totalAmount || activeOrder.finalAmount || 149}
              </span>
            </div>
          </div>

          {/* Action Buttons: Advance Simulation & Done */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              id="advance-kitchen-step-btn"
              className="btn btn-secondary btn-sm"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 800
              }}
              onClick={handleAdvanceStatus}
              disabled={isUpdating}
            >
              <RefreshCw size={14} className={isUpdating ? 'animate-spin' : ''} />
              <span>{isDelivered ? '🔄 Restart Kitchen Simulation' : '⚡ Advance Next Kitchen Step'}</span>
            </button>

            {/* Done Button (Explicitly closes modal) */}
            <button
              type="button"
              id="done-order-tracker-btn"
              className="btn btn-primary btn-sm"
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 800,
                background: '#DC2626',
                color: '#FFFFFF'
              }}
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Call Rider Popup Modal */}
      {showCallModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCallModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '16px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '420px',
              width: '100%',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              border: '2px solid #EAE3D9',
              position: 'relative'
            }}
          >
            <button
              type="button"
              onClick={() => setShowCallModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#F5F5F4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEF2F2',
                color: '#DC2626',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}
            >
              🚴
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1C1917', margin: '0 0 4px' }}>
              {riderName}
            </h3>
            <p style={{ fontSize: '12.5px', color: '#78716C', margin: '0 0 16px' }}>
              Green Fleet Rider • Vehicle: <strong>{activeOrder.rider?.vehicleNumber || 'RJ 14 ST 4821'}</strong>
            </p>

            <div
              style={{
                background: '#F5F5F4',
                padding: '12px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 700 }}>PHONE NUMBER</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C1917' }}>{riderPhone}</div>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #EAE3D9',
                  background: copiedPhone ? '#EBFBEE' : '#FFFFFF',
                  color: copiedPhone ? '#2B8A3E' : '#57534E',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedPhone ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`tel:${riderPhone.replace(/\s+/g, '')}`}
                onClick={() => addToast(`Calling ${riderName}... 📞`, 'success')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '14px'
                }}
              >
                <Phone size={16} />
                <span>Call Directly ({riderPhone})</span>
              </a>

              <a
                href={`https://wa.me/${riderPhone.replace(/[^0-9]/g, '')}?text=Hello%20Rahul,%20I%20am%20tracking%20my%20tiffin%20order%20%23${activeOrder.id}.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '14px'
                }}
              >
                <MessageCircle size={16} />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
