import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';
import { api } from '../api/client';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [activeProviderId, setActiveProviderId] = useState(null);
  const [activeProviderName, setActiveProviderName] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState('Lunch (12:15 PM - 01:45 PM)');
  const [packaging, setPackaging] = useState('304 Insulated Stainless Steel Dabba');
  const [couponCode, setCouponCode] = useState('FIRSTGHAR50');
  const [couponDiscount, setCouponDiscount] = useState(50);
  const [couponMessage, setCouponMessage] = useState('Flat ₹50 OFF applied on first meal!');
  const [currentTrackingOrder, setCurrentTrackingOrder] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  const { addToast } = useToast();

  const addItem = (meal, qty = 1, provider = null) => {
    // If cart has items from another provider, prompt or clear
    if (provider && activeProviderId && activeProviderId !== provider.id) {
      if (!window.confirm(`Your cart contains meals from "${activeProviderName}". Clear cart to add from "${provider.businessName}"?`)) {
        return;
      }
      setItems([]);
    }

    if (provider) {
      setActiveProviderId(provider.id);
      setActiveProviderName(provider.businessName);
    } else if (meal.providerId) {
      setActiveProviderId(meal.providerId);
    }

    setItems(prev => {
      const existing = prev.find(it => it.id === meal.id);
      if (existing) {
        return prev.map(it => it.id === meal.id ? { ...it, qty: it.qty + qty } : it);
      }
      return [...prev, {
        ...meal,
        menuItemId: meal.id,
        providerId: provider?.id || meal.providerId || 'prov_1',
        qty
      }];
    });
    addToast(`Added "${meal.name}" to your Dabba! 🍲`, 'success');
  };

  const removeItem = (id) => {
    setItems(prev => {
      const updated = prev.filter(it => it.id !== id);
      if (updated.length === 0) {
        setActiveProviderId(null);
        setActiveProviderName(null);
      }
      return updated;
    });
    addToast('Item removed from cart', 'info');
  };

  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(it => it.id === id ? { ...it, qty: newQty } : it));
  };

  const clearCart = () => {
    setItems([]);
    setActiveProviderId(null);
    setActiveProviderName(null);
  };

  const subtotal = items.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.qty) || 1)), 0);
  const deliveryFee = 0; // Free doorstep delivery
  const finalTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const totalItemsCount = items.reduce((acc, it) => acc + it.qty, 0);

  const applyCoupon = async (code) => {
    if (!code) {
      setCouponDiscount(0);
      setCouponCode('');
      setCouponMessage('');
      return;
    }
    const res = await api.validateCoupon(code, subtotal);
    if (res.success) {
      setCouponCode(res.code);
      setCouponDiscount(res.discount);
      setCouponMessage(res.message);
      addToast(res.message, 'success');
    } else {
      addToast(res.message || 'Invalid coupon', 'error');
    }
  };

  const openOrderTracker = (order) => {
    setCurrentTrackingOrder(order);
    setIsOrderTrackerOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        activeProviderId,
        activeProviderName,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        deliveryFee,
        couponDiscount,
        couponCode,
        couponMessage,
        applyCoupon,
        finalTotal,
        totalItemsCount,
        deliverySlot,
        setDeliverySlot,
        packaging,
        setPackaging,
        isDrawerOpen,
        setIsDrawerOpen,
        currentTrackingOrder,
        setCurrentTrackingOrder,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        openOrderTracker
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
