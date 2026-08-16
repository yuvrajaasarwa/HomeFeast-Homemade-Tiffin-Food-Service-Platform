import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/client';

export const ComplaintModal = () => {
  const { isComplaintModalOpen, setIsComplaintModalOpen, activeModalData, user } = useAuth();
  const { addToast } = useToast();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  if (!isComplaintModalOpen) return null;

  const providerName = activeModalData?.providerName || 'Home Cook';
  const providerId = activeModalData?.providerId || 'prov_1';
  const orderId = activeModalData?.orderId || activeModalData?.id || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      addToast('Please provide both subject and issue description.', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitComplaint({
        providerId,
        orderId,
        subject,
        description,
        priority,
        customerName: user?.name || 'Aarav Sharma',
        customerPhone: user?.phone || '+91 98290 12345',
        customerId: user?.id || 'usr_customer_1'
      });

      if (res.success) {
        addToast('Report submitted to Support Desk! Track it under "Your Reports" tab. 🛡️', 'success');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('homefeast_complaint_submitted', { detail: res.data || res.complaint }));
        }
        setIsComplaintModalOpen(false);
        setSubject('');
        setDescription('');
      } else {
        addToast(res.message || 'Error submitting complaint.', 'error');
      }
    } catch (err) {
      addToast('Network error lodging dispute.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => setIsComplaintModalOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: '#1C1917', padding: '24px', color: '#FFFFFF', position: 'relative' }}>
          <button
            onClick={() => setIsComplaintModalOpen(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <AlertTriangle size={24} color="#F59E0B" />
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', padding: '2px 10px', borderRadius: '12px' }}>
              Support & Dispute Desk
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Report an Issue with {providerName}</h2>
          {orderId && (
            <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>
              Related to Order #{orderId}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Priority selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '8px' }}>
              Urgency / Priority
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'LOW', label: 'Low (Feedback)', color: '#10B981' },
                { id: 'MEDIUM', label: 'Medium (Timing / Food)', color: '#F59E0B' },
                { id: 'HIGH', label: 'High (Missing / Spill)', color: '#EF4444' }
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: priority === p.id ? `2px solid ${p.color}` : '1px solid #EAE3D9',
                    background: priority === p.id ? `${p.color}15` : '#FFFFFF',
                    color: priority === p.id ? p.color : '#57534E',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
              Issue Subject <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Delivery was 15 mins late, Salt was excessive, Lid opened"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {/* Detailed description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1C1917', marginBottom: '6px' }}>
              Detailed Description <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please provide details so we can coordinate with the cook and rider team to resolve this immediately..."
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #EAE3D9',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => setIsComplaintModalOpen(false)}
              style={{
                flex: 1,
                padding: '12px',
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
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#1C1917',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit to Support Desk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
