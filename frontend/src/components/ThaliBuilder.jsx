import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

export const ThaliBuilder = () => {
  const [components, setComponents] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected components
  const [selectedCurry, setSelectedCurry] = useState(null);
  const [selectedDal, setSelectedDal] = useState(null);
  const [selectedBread, setSelectedBread] = useState(null);
  const [selectedAccompaniment, setSelectedAccompaniment] = useState(null);

  const { addItem, setIsDrawerOpen } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await api.getThaliBuilder();
      if (data) {
        setComponents(data);
        // Default selections
        setSelectedCurry(data.curries[0]);
        setSelectedDal(data.dals[0]);
        setSelectedBread(data.breadsAndRice[0]);
        setSelectedAccompaniment(data.accompaniments[0]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Compute total dynamic price & calories
  const baseBoxPrice = 49; // packaging and cooking base
  const totalCurryPrice = selectedCurry ? selectedCurry.price : 0;
  const totalDalPrice = selectedDal ? selectedDal.price : 0;
  const totalBreadPrice = selectedBread ? selectedBread.price : 0;
  const totalAccPrice = selectedAccompaniment ? selectedAccompaniment.price : 0;

  const totalCalculatedPrice = baseBoxPrice + totalCurryPrice + totalDalPrice + totalBreadPrice + totalAccPrice;
  const totalCalculatedCal = (selectedCurry?.cal || 0) + (selectedDal?.cal || 0) + (selectedBread?.cal || 0) + (selectedAccompaniment?.cal || 0);

  const handleAddCustomThali = () => {
    const customMeal = {
      id: `custom-thali-${Date.now()}`,
      name: `Custom Dabba (${selectedCurry?.name || 'Chef Mix'})`,
      diet: selectedCurry?.type === 'non_veg' ? 'non_veg' : 'veg',
      price: totalCalculatedPrice,
      calories: totalCalculatedCal,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      items: [
        `Main: ${selectedCurry?.name}`,
        `Dal: ${selectedDal?.name}`,
        `Bread/Rice: ${selectedBread?.name}`,
        `Side: ${selectedAccompaniment?.name}`
      ]
    };

    addItem(customMeal);
    setIsDrawerOpen(true);
  };

  const applyPreset = (curryId, dalId, breadId, accId) => {
    if (!components) return;
    const c = components.curries.find(x => x.id === curryId);
    const d = components.dals.find(x => x.id === dalId);
    const b = components.breadsAndRice.find(x => x.id === breadId);
    const a = components.accompaniments.find(x => x.id === accId);
    if (c) setSelectedCurry(c);
    if (d) setSelectedDal(d);
    if (b) setSelectedBread(b);
    if (a) setSelectedAccompaniment(a);
  };

  if (loading || !components) {
    return (
      <section id="custom-thali" className="thali-builder-section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🍱</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Loading 4-Compartment Thali Studio...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="custom-thali" className="thali-builder-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">🍱 Interactive 4-Compartment Studio</span>
          <h2 className="section-title">Build Your Own Custom Dabba</h2>
          <p className="section-subtitle">
            Pick your favourite curry, dal, fresh breads or fragrant basmati rice, and sweet dessert. Watch your hot tiffin assemble in real-time.
          </p>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset('c-1', 'd-2', 'b-1', 'a-3')}
          >
            ✨ Royal Shahi Paneer & Dal Makhani
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset('c-8', 'd-1', 'b-3', 'a-1')}
          >
            💪 High-Protein Fit Box
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset('c-5', 'd-1', 'b-5', 'a-1')}
          >
            🍗 Dhaba Murgh & Jeera Rice
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>Loading Thali Studio...</div>
        ) : (
          <div className="thali-builder-container">
            {/* Left: Step Pickers */}
            <div>
              {/* Step 1: Main Curry */}
              <div className="builder-step-group">
                <div className="builder-step-title">
                  <span>1. Choose Main Curry / Gravy</span>
                  <span className="badge badge-primary">Step 1 of 4</span>
                </div>
                <div className="builder-options-grid">
                  {components.curries.map(c => (
                    <div
                      key={c.id}
                      className={`builder-option-card ${selectedCurry?.id === c.id ? 'active' : ''}`}
                      onClick={() => setSelectedCurry(c)}
                    >
                      <span className="option-emoji">{c.img}</span>
                      <div className="option-details">
                        <span className="option-name">{c.name}</span>
                        <span className="option-sub">+₹{c.price} • {c.cal} cal</span>
                      </div>
                      {selectedCurry?.id === c.id && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Dal / Gravy */}
              <div className="builder-step-group">
                <div className="builder-step-title">
                  <span>2. Choose Dal / Lentils</span>
                  <span className="badge badge-primary">Step 2 of 4</span>
                </div>
                <div className="builder-options-grid">
                  {components.dals.map(d => (
                    <div
                      key={d.id}
                      className={`builder-option-card ${selectedDal?.id === d.id ? 'active' : ''}`}
                      onClick={() => setSelectedDal(d)}
                    >
                      <span className="option-emoji">{d.img}</span>
                      <div className="option-details">
                        <span className="option-name">{d.name}</span>
                        <span className="option-sub">+₹{d.price} • {d.cal} cal</span>
                      </div>
                      {selectedDal?.id === d.id && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Breads & Rice */}
              <div className="builder-step-group">
                <div className="builder-step-title">
                  <span>3. Choose Bread or Rice Portion</span>
                  <span className="badge badge-primary">Step 3 of 4</span>
                </div>
                <div className="builder-options-grid">
                  {components.breadsAndRice.map(b => (
                    <div
                      key={b.id}
                      className={`builder-option-card ${selectedBread?.id === b.id ? 'active' : ''}`}
                      onClick={() => setSelectedBread(b)}
                    >
                      <span className="option-emoji">{b.img}</span>
                      <div className="option-details">
                        <span className="option-name">{b.name}</span>
                        <span className="option-sub">+₹{b.price} • {b.cal} cal</span>
                      </div>
                      {selectedBread?.id === b.id && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Accompaniment / Sweet */}
              <div className="builder-step-group">
                <div className="builder-step-title">
                  <span>4. Choose Salad / Raita / Sweet</span>
                  <span className="badge badge-primary">Step 4 of 4</span>
                </div>
                <div className="builder-options-grid">
                  {components.accompaniments.map(a => (
                    <div
                      key={a.id}
                      className={`builder-option-card ${selectedAccompaniment?.id === a.id ? 'active' : ''}`}
                      onClick={() => setSelectedAccompaniment(a)}
                    >
                      <span className="option-emoji">{a.img}</span>
                      <div className="option-details">
                        <span className="option-name">{a.name}</span>
                        <span className="option-sub">+₹{a.price} • {a.cal} cal</span>
                      </div>
                      {selectedAccompaniment?.id === a.id && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Plate Visualizer & Price Summary */}
            <div className="thali-plate-visualizer">
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Your Customized Hot Tiffin</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Packed in Insulated 304 Food-Grade Stainless Steel
              </p>

              {/* 4-Compartment Dabba Graphic */}
              <div className="thali-circle-dabba">
                {/* Katori 1: Main Curry */}
                <div className="dabba-katori selected">
                  <span className="katori-emoji">{selectedCurry?.img || '🥘'}</span>
                  <span className="katori-title">{selectedCurry?.name || 'Main Curry'}</span>
                </div>

                {/* Katori 2: Dal */}
                <div className="dabba-katori selected">
                  <span className="katori-emoji">{selectedDal?.img || '🥣'}</span>
                  <span className="katori-title">{selectedDal?.name || 'Dal / Gravy'}</span>
                </div>

                {/* Katori 3: Bread/Rice */}
                <div className="dabba-katori selected">
                  <span className="katori-emoji">{selectedBread?.img || '🫓'}</span>
                  <span className="katori-title">{selectedBread?.name || 'Bread / Rice'}</span>
                </div>

                {/* Katori 4: Sweet / Salad */}
                <div className="dabba-katori selected">
                  <span className="katori-emoji">{selectedAccompaniment?.img || '🥗'}</span>
                  <span className="katori-title">{selectedAccompaniment?.name || 'Side / Sweet'}</span>
                </div>
              </div>

              {/* Nutrition and Price Box */}
              <div style={{ background: 'var(--bg-surface-soft)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Estimated Nutrition</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>🔥 {totalCalculatedCal} Calories</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>Custom Dabba Price</span>
                  <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>₹{totalCalculatedPrice}</span>
                </div>
              </div>

              {/* Add to Dabba CTA */}
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                onClick={handleAddCustomThali}
              >
                <ShoppingBag size={18} />
                <span>Add This Custom Dabba (₹{totalCalculatedPrice})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
