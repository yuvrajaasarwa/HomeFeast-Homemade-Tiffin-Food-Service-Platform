import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Clock, Package, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    couponDiscount,
    couponCode,
    couponMessage,
    applyCoupon,
    finalTotal,
    deliverySlot,
    setDeliverySlot,
    packaging,
    setPackaging,
    setIsCheckoutModalOpen
  } = useCart();

  const { user } = useAuth();
  const [inputCoupon, setInputCoupon] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCouponCode = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
    }
  };

  const handleProceed = () => {
    setIsDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleBrowseMenu = () => {
    setIsDrawerOpen(false);
    window.location.hash = '#menu';
    setTimeout(() => {
      const dishesEl = document.getElementById('dishes-container');
      if (dishesEl) {
        dishesEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px', fontSize: '16px' }}>
              🍲
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Your Hot Dabba</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                {items.length} {items.length === 1 ? 'item' : 'items'} ready for kitchen prep
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', background: 'var(--bg-surface-soft)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍱</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Your Dabba is Empty
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '240px', margin: '0 auto 20px' }}>
                Add hot homestyle thalis from today's menu or build your custom dabba.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleBrowseMenu}
                style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: 700 }}
              >
                Browse Today's Menu 🍲
              </button>
            </div>
          ) : (
            <div>
              {/* Delivery Slot Selector */}
              <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: 700 }}>
                  <Clock size={15} color="var(--primary)" />
                  <span>Choose Delivery Time Slot</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn btn-sm ${deliverySlot.startsWith('Lunch') ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, fontSize: '11.5px', padding: '8px 6px' }}
                    onClick={() => setDeliverySlot('Lunch (12:30 PM - 01:30 PM)')}
                  >
                    ☀️ Lunch (12:30 PM)
                  </button>
                  <button
                    className={`btn btn-sm ${deliverySlot.startsWith('Dinner') ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, fontSize: '11.5px', padding: '8px 6px' }}
                    onClick={() => setDeliverySlot('Dinner (07:30 PM - 08:30 PM)')}
                  >
                    🌙 Dinner (7:30 PM)
                  </button>
                </div>
              </div>

              {/* Packaging Choice */}
              <div style={{ background: 'var(--bg-surface-soft)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', fontWeight: 700 }}>
                  <Package size={15} color="var(--primary)" />
                  <span>Packaging Preference</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: packaging.includes('Steel') ? 'var(--primary-light)' : '#FFFFFF',
                      border: `1px solid ${packaging.includes('Steel') ? 'var(--primary)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      fontSize: '12.5px'
                    }}
                  >
                    <input
                      type="radio"
                      name="packOption"
                      checked={packaging.includes('Steel')}
                      onChange={() => setPackaging('304 Insulated Stainless Steel Dabba')}
                    />
                    <div>
                      <strong>🍲 304 Stainless Steel Hot Dabba</strong>
                      <div style={{ fontSize: '11px', color: 'var(--success)' }}>Zero Plastic • Stays Hot 2.5h • Free pickup next day</div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: packaging.includes('Tray') ? 'var(--primary-light)' : '#FFFFFF',
                      border: `1px solid ${packaging.includes('Tray') ? 'var(--primary)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      fontSize: '12.5px'
                    }}
                  >
                    <input
                      type="radio"
                      name="packOption"
                      checked={packaging.includes('Tray')}
                      onChange={() => setPackaging('100% Recyclable Meal Tray')}
                    />
                    <div>
                      <strong>📦 100% Recyclable Meal Tray</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Disposable • Eco-Friendly paper & sugarcane bagasse</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      background: '#FFFFFF'
                    }}
                  >
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '2px' }}>{item.name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>₹{item.price} each</span>
                    </div>

                    {/* Qty Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-soft)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: 800, minWidth: '45px', textAlign: 'right' }}>
                      ₹{item.price * item.qty}
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ color: '#E03131', padding: '4px' }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCouponCode} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FIRSTGHAR50)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    style={{
                      flexGrow: 1,
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '13px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} />
                    <span>Applied: <strong>{couponCode}</strong> (-₹{couponDiscount})</span>
                  </div>
                )}
              </form>

              {/* Bill Details */}
              <div style={{ background: 'var(--bg-surface-soft)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Bill Summary</h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                </div>

                {couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--success)' }}>
                    <span>Coupon Discount ({couponCode})</span>
                    <span style={{ fontWeight: 700 }}>-₹{couponDiscount}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Doorstep Hot Delivery</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span>To Pay</span>
                  <span style={{ color: 'var(--primary)' }}>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleProceed}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: 'var(--text-subtle)' }}>
              🔒 100% Secure Checkout with Instant Live Kitchen Tracking
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
