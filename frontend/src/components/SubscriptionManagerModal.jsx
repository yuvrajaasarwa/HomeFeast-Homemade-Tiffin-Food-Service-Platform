import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, PauseCircle, PlayCircle, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { api } from '../api/client';

export const SubscriptionManagerModal = () => {
  const { activeSubscription, setActiveSubscription } = useAuth();
  const { isSubModalOpen, setIsSubModalOpen } = useCart();
  const { addToast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  if (!isSubModalOpen) return null;

  // Generate calendar days for current month (e.g. August 2026)
  const currentYear = 2026;
  const currentMonth = 7; // August (0-indexed)
  const daysInMonth = 31;

  const handleToggleDate = async (dayNum) => {
    const formattedDate = `2026-08-${String(dayNum).padStart(2, '0')}`;
    setIsToggling(true);

    const res = await api.togglePauseDate(formattedDate);
    setIsToggling(false);

    if (res.success) {
      setActiveSubscription(res.data);
      addToast(res.message, 'info');
    } else {
      addToast(res.message, 'error');
    }
  };

  const pausedDates = activeSubscription?.pausedDates || [];

  return (
    <div className="modal-backdrop" onClick={() => setIsSubModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success">Active Tiffin Pass</span>
              <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>#{activeSubscription?.id || 'SUB-401'}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              {activeSubscription?.planName || '30-Day Royal Monthly Pass'}
            </h2>
          </div>
          <button
            onClick={() => setIsSubModalOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', background: 'var(--bg-surface-soft)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Subscription Stats Bar */}
        <div
          style={{
            background: 'var(--bg-surface-soft)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Total Meals</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>{activeSubscription?.totalMeals || 30}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Consumed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-muted)' }}>{activeSubscription?.consumedMeals || 13}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Remaining Credits</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>{activeSubscription?.remainingMeals || 17}</div>
          </div>
        </div>

        {/* Pause & Resume Calendar Instructions */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="var(--primary)" />
              <span>Pause / Resume Calendar (August 2026)</span>
            </h4>
            <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>
              Click any date to pause or resume
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '2px' }} />
              Active Meal Scheduled
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', background: '#FFF1F0', border: '1px solid #FFA39E', borderRadius: '2px' }} />
              Paused (Credit Preserved)
            </span>
          </div>
        </div>

        {/* 31-Day Calendar Grid */}
        <div className="calendar-grid">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayHeader, idx) => (
            <div key={idx} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>
              {dayHeader}
            </div>
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const dayNum = i + 1;
            const formattedDate = `2026-08-${String(dayNum).padStart(2, '0')}`;
            const isPaused = pausedDates.includes(formattedDate);
            const isPast = dayNum < 13;

            return (
              <button
                key={dayNum}
                className={`cal-day-cell ${isPaused ? 'paused' : 'active-meal'}`}
                onClick={() => !isPast && handleToggleDate(dayNum)}
                disabled={isPast || isToggling}
                style={{ opacity: isPast ? 0.45 : 1, cursor: isPast ? 'not-allowed' : 'pointer' }}
                title={isPaused ? `Paused for ${formattedDate}` : `Scheduled for ${formattedDate}`}
              >
                <span style={{ fontSize: '13px', fontWeight: 700 }}>{dayNum}</span>
                <span style={{ fontSize: '9px', fontWeight: 600 }}>
                  {isPaused ? 'PAUSED' : 'MEAL'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Paused Dates List */}
        {pausedDates.length > 0 && (
          <div style={{ marginTop: '16px', padding: '12px 14px', background: '#FFF1F0', borderRadius: 'var(--radius-sm)', border: '1px solid #FFA39E' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#CF1322', marginBottom: '4px' }}>
              Currently Paused Dates ({pausedDates.length}/5 allowed):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pausedDates.map(d => (
                <span key={d} className="badge" style={{ background: '#FFFFFF', color: '#CF1322', border: '1px solid #FFA39E', fontSize: '11px' }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => addToast('Invoice #INV-2026-892 downloaded (PDF)', 'success')}
          >
            <Download size={14} />
            <span>Tax Invoice</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsSubModalOpen(false)}
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
