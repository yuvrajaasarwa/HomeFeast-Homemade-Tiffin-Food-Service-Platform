import React, { useState } from 'react';
import {
  X,
  Navigation,
  Phone,
  CheckCircle,
  MapPin,
  Clock,
  Award,
  DollarSign,
  Truck,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RiderDashboardModal = () => {
  const { isRiderModalOpen, setIsRiderModalOpen, user } = useAuth();
  const { addToast } = useToast();

  const [isOnline, setIsOnline] = useState(true);
  const [activeHub, setActiveHub] = useState('jaipur');

  // Simulated live deliveries for the rider
  const [orders, setOrders] = useState([
    {
      id: 'HF-ORD-8821',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98290 12345',
      address: 'Flat 304, Royal Palms, Malviya Nagar Sector 3, Jaipur',
      distance: '1.2 km away',
      estTime: '8 mins',
      slot: 'Lunch (12:30 PM - 01:30 PM)',
      mealName: 'Dal Baati Churma Rajasthani Royal Thali',
      dabbaCode: 'DB-304-41',
      status: 'ON_THE_WAY', // 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED'
      dabbaCollected: false,
      payout: '₹55'
    },
    {
      id: 'HF-ORD-8825',
      customerName: 'Priya Rathore',
      customerPhone: '+91 98290 77777',
      address: 'House 82, Everest Colony, Mansarovar VT Road, Jaipur',
      distance: '2.4 km away',
      estTime: '15 mins',
      slot: 'Lunch (12:30 PM - 01:30 PM)',
      mealName: 'Jain Special Shahi Paneer & Hing Moong Dal',
      dabbaCode: 'DB-304-88',
      status: 'ASSIGNED',
      dabbaCollected: false,
      payout: '₹55'
    },
    {
      id: 'HF-ORD-8810',
      customerName: 'Dr. Manish Verma',
      customerPhone: '+91 98290 33445',
      address: 'Plot 12, Queens Road, Vaishali Nagar, Jaipur',
      distance: 'Completed',
      estTime: 'Delivered',
      slot: 'Lunch (12:30 PM - 01:30 PM)',
      mealName: 'High-Protein Grilled Paneer Fit Meal',
      dabbaCode: 'DB-304-12',
      status: 'DELIVERED',
      dabbaCollected: true,
      payout: '₹60'
    }
  ]);

  if (!isRiderModalOpen) return null;

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus };
          if (newStatus === 'DELIVERED') {
            updated.dabbaCollected = true;
          }
          return updated;
        }
        return ord;
      })
    );

    if (newStatus === 'ON_THE_WAY') {
      addToast(`🛵 Order ${orderId}: Marked as Out for Delivery!`, 'info');
    } else if (newStatus === 'DELIVERED') {
      addToast(`🎉 Order ${orderId} successfully delivered & 304 Dabba collected! Payout +₹55 credited.`, 'success');
    }
  };

  const handleToggleDuty = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      addToast('🟢 You are now ONLINE. Receiving active tiffin pickup orders!', 'success');
    } else {
      addToast('🔴 You are now OFFLINE. Duty paused.', 'info');
    }
  };

  const completedCount = orders.filter(o => o.status === 'DELIVERED').length;
  const activeCount = orders.filter(o => o.status !== 'DELIVERED').length;

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsRiderModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(20, 18, 17, 0.75)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          background: '#FFFFFF',
          border: '1px solid #EAE3D9'
        }}
      >
        {/* Rider Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #292524 60%, #431407 100%)',
            padding: '22px 28px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  boxShadow: '0 4px 14px rgba(232, 89, 12, 0.35)'
                }}
              >
                🛵
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {user?.name || 'Rahul Meena (Express Rider)'}
                  </h2>
                  <span
                    style={{
                      background: isOnline ? '#2B8A3E' : '#78716C',
                      color: '#FFFFFF',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isOnline ? '● Online Duty' : '○ Offline'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#D6D3D1', margin: '3px 0 0 0' }}>
                  ID: <strong>HF-RIDER-4821</strong> • Bike: <strong>RJ 14 ST 4821</strong> • Station: <strong>Jaipur Hub #1</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleToggleDuty}
                style={{
                  background: isOnline ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  border: `1px solid ${isOnline ? '#EF4444' : '#22C55E'}`,
                  color: isOnline ? '#FCA5A5' : '#86EFAC',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isOnline ? 'Go Offline' : 'Go Online 🟢'}
              </button>

              <button
                onClick={() => setIsRiderModalOpen(false)}
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
          </div>

          {/* Quick Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#A8A29E', textTransform: 'uppercase', fontWeight: 600 }}>Today's Payout</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FF922B' }}>₹680.00</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#A8A29E', textTransform: 'uppercase', fontWeight: 600 }}>Completed</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#51CF66' }}>{completedCount} Tiffins</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#A8A29E', textTransform: 'uppercase', fontWeight: 600 }}>Pending</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FCC419' }}>{activeCount} Active</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#A8A29E', textTransform: 'uppercase', fontWeight: 600 }}>Dabba Return</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#67E8F9' }}>11/12 (92%)</div>
            </div>
          </div>
        </div>

        {/* Assigned Orders List */}
        <div style={{ padding: '20px 24px', flexGrow: 1, overflowY: 'auto', maxHeight: '420px', background: '#FAF8F5' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1C1917', textTransform: 'uppercase' }}>
              📍 Live Assigned Hot Dispatches ({orders.length})
            </div>
            <span style={{ fontSize: '11.5px', color: '#78716C' }}>
              Lunch Slot: 12:30 PM - 1:30 PM
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((ord) => {
              const isDone = ord.status === 'DELIVERED';
              return (
                <div
                  key={ord.id}
                  style={{
                    background: '#FFFFFF',
                    border: `1.5px solid ${isDone ? '#E2E8F0' : '#DC2626'}`,
                    borderRadius: '16px',
                    padding: '16px 18px',
                    boxShadow: isDone ? 'none' : '0 4px 14px rgba(220, 38, 38, 0.12)',
                    opacity: isDone ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '15px', color: '#1C1917' }}>{ord.customerName}</strong>
                        <span
                          style={{
                            background: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          Dabba Tag: {ord.dabbaCode}
                        </span>
                        <span style={{ fontSize: '11px', color: '#78716C' }}>({ord.id})</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#57534E', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} color="#DC2626" />
                        <span>{ord.address}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: isDone ? '#EBFBEE' : '#FEF2F2',
                          color: isDone ? '#2B8A3E' : '#DC2626',
                          fontWeight: 800,
                          fontSize: '11.5px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          textTransform: 'uppercase'
                        }}
                      >
                        {isDone ? '✓ Delivered' : ord.status === 'ON_THE_WAY' ? '🛵 Out For Delivery' : '📦 At Kitchen'}
                      </span>
                      <div style={{ fontSize: '11px', color: '#78716C', marginTop: '4px' }}>
                        Earn: <strong style={{ color: '#2B8A3E' }}>{ord.payout}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Meal description */}
                  <div
                    style={{
                      background: '#FFF1F2',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#44403C',
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>🍱 <strong>Meal:</strong> {ord.mealName}</span>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>304 Insulated Steel Dabba</span>
                  </div>

                  {/* Action Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={13} />
                        <span>Call Customer</span>
                      </a>

                      <button
                        onClick={() => addToast(`📍 Live Google Maps Directions opened for: ${ord.address}`, 'info')}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Navigation size={13} color="#06B6D4" />
                        <span>Directions</span>
                      </button>
                    </div>

                    {!isDone && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {ord.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'ON_THE_WAY')}
                            style={{
                              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 16px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Picked Up & Start Delivery 🛵
                          </button>
                        )}

                        {ord.status === 'ON_THE_WAY' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')}
                            style={{
                              background: 'linear-gradient(135deg, #2B8A3E 0%, #40C057 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 16px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <CheckCircle size={14} />
                            <span>Mark Delivered & Collect Dabba</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info bar */}
        <div
          style={{
            borderTop: '1px solid #EAE3D9',
            padding: '12px 24px',
            background: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '12px', color: '#57534E' }}>
            Rider Support Helpline: <strong>+91 98290 99999</strong> (24/7 Fleet Dispatch)
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsRiderModalOpen(false)}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
