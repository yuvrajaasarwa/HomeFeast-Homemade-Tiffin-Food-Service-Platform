import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const WHATSAPP_URL = "https://wa.me/919829012345?text=Hello%20HomeFast!%20I%20have%20an%20inquiry%20regarding%20tiffin%20subscriptions%20and%20daily%20meals.";

export const ContactPage = ({ onExploreMenu, onExplorePlans }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'jaipur',
    subject: 'subscription',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      addToast('Please fill in all required fields (Name, Phone & Message)', 'error');
      return;
    }

    setIsSent(true);
    addToast('🎉 Message sent successfully! Our culinary care team will reach out to you within 2 hours.', 'success');
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <section style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
          <Sparkles size={16} />
          <span>Need Help or Have Questions?</span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#1C1917', lineHeight: 1.2, margin: '0 0 12px 0' }}>
          We'd Love to Hear From <br />
          <span style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Our HomeFeast Family
          </span>
        </h1>

        <p style={{ fontSize: '15.5px', color: '#57534E', lineHeight: 1.6, margin: 0 }}>
          Have a question, special dietary requirement, feedback, or need help with your daily tiffin pass? Our Rajasthan culinary care team is here to assist you 24/7.
        </p>
      </section>

      <div className="container">
        {/* 4 Large Contact Cards (Matching Reference) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '50px'
          }}
        >
          {/* Card 1: Call Us */}
          <div
            className="card-clean"
            style={{
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#EBFBEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Phone size={24} color="#2B8A3E" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', marginBottom: '8px' }}>
              Call Us
            </h3>
            <a href="tel:+919829012345" style={{ fontSize: '14px', fontWeight: 700, color: '#1C1917', textDecoration: 'none', display: 'block' }}>
              +91 98290 12345
            </a>
            <a href="tel:+919829099999" style={{ fontSize: '13px', color: '#78716C', textDecoration: 'none', marginTop: '2px', display: 'block' }}>
              +91 98290 99999
            </a>
            <span style={{ fontSize: '11px', color: '#2B8A3E', fontWeight: 700, marginTop: '10px', background: '#EBFBEE', padding: '3px 10px', borderRadius: '9999px' }}>
              Mon-Sun: 24/7 Helpline
            </span>
          </div>

          {/* Card 2: Email Us */}
          <div
            className="card-clean"
            style={{
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Mail size={24} color="#DC2626" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1C1917', margin: '0 0 6px 0' }}>Email Us</h3>
            <p style={{ fontSize: '13px', color: '#57534E', margin: '0 0 10px 0' }}>care@homefasttiffin.in</p>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#1C1917' }}>chef@homefasttiffin.in</div>
            <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, marginTop: '10px', background: '#FEF2F2', padding: '3px 10px', borderRadius: '9999px' }}>
              Jaipur • Ajmer • Kishangarh
            </span>
          </div>

          {/* Card 3: Visit Us */}
          <div
            className="card-clean"
            style={{
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <MapPin size={24} color="#D97706" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', marginBottom: '8px' }}>
              Central Kitchen HQ
            </h3>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>
              Jaipur Central Kitchen
            </div>
            <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
              Sector 5, Malviya Nagar, Jaipur - 302017
            </div>
            <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, marginTop: '10px', background: '#FEF3C7', padding: '3px 10px', borderRadius: '9999px' }}>
              Jaipur • Ajmer • Kishangarh
            </span>
          </div>

          {/* Card 4: WhatsApp Web */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="card-clean"
            style={{
              padding: '28px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              border: '1.5px solid #25D366',
              textDecoration: 'none',
              background: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.12)'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#EBFBEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <MessageCircle size={26} color="#25D366" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>WhatsApp Web</span>
              <ExternalLink size={14} color="#25D366" />
            </h3>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#25D366' }}>
              +91 98290 12345
            </div>
            <div style={{ fontSize: '12px', color: '#78716C', marginTop: '2px' }}>
              Instant Live Chat & Order Help
            </div>
            <span style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: 800, marginTop: '10px', background: '#25D366', padding: '3px 12px', borderRadius: '9999px' }}>
              Chat on WhatsApp ↗
            </span>
          </a>
        </div>

        {/* Two-Column Section: Form + Rajasthan Hub Locations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Left Column: Drop Us a Message Form */}
          <div
            className="card-clean"
            style={{
              padding: '36px',
              borderRadius: '24px',
              border: '1px solid #EAE3D9',
              background: '#FFFFFF'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              <span>Send Message</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
              Drop Us a <span style={{ color: 'var(--primary)' }}>Message</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '24px' }}>
              Fill out the form below and our kitchen dispatch manager will get back to you within 2 hours.
            </p>

            {isSent ? (
              <div style={{ background: '#EBFBEE', border: '1px solid #B2F2BB', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <CheckCircle size={36} color="#2B8A3E" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2B8A3E', marginBottom: '6px' }}>
                  Thank You, {formData.name}!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#44403C', lineHeight: 1.5, margin: 0 }}>
                  We have received your message regarding <strong>{formData.subject.toUpperCase()}</strong> in <strong>{formData.city.toUpperCase()}</strong>. We will call you on {formData.phone} shortly!
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsSent(false)}
                  style={{ marginTop: '16px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pooja Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98290 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                      Your Service City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none', background: '#FFFFFF' }}
                    >
                      <option value="jaipur">Jaipur (Pink City)</option>
                      <option value="ajmer">Ajmer (Heritage Hub)</option>
                      <option value="kishangarh">Kishangarh (Marble City)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none', background: '#FFFFFF' }}
                  >
                    <option value="subscription">Daily Tiffin Subscription (7/15/30 Days)</option>
                    <option value="custom_thali">Custom Thali Builder / Dabba Pickup</option>
                    <option value="corporate">Corporate Office Lunch & Bulk Catering</option>
                    <option value="partner">Join as Cloud Kitchen / Delivery Rider Partner</option>
                    <option value="feedback">Food Quality / Delivery Feedback</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917', display: 'block', marginBottom: '6px' }}>
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your delivery address, dietary requirements (Veg / Jain / Non-Veg / Fit) or queries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #EAE3D9', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  <Send size={16} />
                  <span>Send Inquiry to Kitchen Team</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Rajasthan Hub Stations & Map Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Jaipur Hub */}
            <div
              className="card-clean"
              style={{
                padding: '20px 24px',
                borderRadius: '18px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>🏰 Jaipur Central Kitchen HQ</span>
                <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                  26 Delivery Hubs
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#57534E', margin: '0 0 8px 0' }}>
                HomeFast Central Station, Sector 5, Malviya Nagar, Near World Trade Park (WTP), Jaipur - 302017
              </p>
              <div style={{ fontSize: '12px', color: '#78716C', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span>🕒 7:00 AM - 10:00 PM</span>
                <span>📞 +91 98290 12345</span>
              </div>
            </div>

            {/* Ajmer Hub */}
            <div
              className="card-clean"
              style={{
                padding: '20px 24px',
                borderRadius: '18px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>🌊 Ajmer Regional Station</span>
                <span style={{ background: '#EBFBEE', color: '#2B8A3E', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                  27 Delivery Hubs
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#57534E', margin: '0 0 8px 0' }}>
                Panchsheel Nagar E-Block, Near Ana Sagar Circular Road, Ajmer - 305004
              </p>
              <div style={{ fontSize: '12px', color: '#78716C', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span>🕒 7:00 AM - 10:00 PM</span>
                <span>📞 +91 98290 99999</span>
              </div>
            </div>

            {/* Kishangarh Hub */}
            <div
              className="card-clean"
              style={{
                padding: '20px 24px',
                borderRadius: '18px',
                border: '1.5px solid #EAE3D9',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917' }}>🏛️ Kishangarh Marble Hub</span>
                <span style={{ background: '#FEF3C7', color: '#D97706', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                  12 Delivery Hubs
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#57534E', margin: '0 0 8px 0' }}>
                RK Marble Circle, Madanganj, Kishangarh (Rajasthan) - 305801
              </p>
              <div style={{ fontSize: '12px', color: '#78716C', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span>🕒 7:00 AM - 9:30 PM</span>
                <span>📞 +91 98290 55555</span>
              </div>
            </div>

            {/* Quality Guarantee Box */}
            <div style={{ background: 'linear-gradient(135deg, #1C1917 0%, #292524 100%)', color: '#FFFFFF', padding: '20px 24px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <ShieldCheck size={32} color="#DC2626" />
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>100% On-Time Hot Dispatch Guarantee</strong>
                <span style={{ fontSize: '12px', color: '#D6D3D1' }}>
                  Every tiffin is sealed in 304 food-grade stainless steel dabbas and dispatched within 20-30 minutes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
