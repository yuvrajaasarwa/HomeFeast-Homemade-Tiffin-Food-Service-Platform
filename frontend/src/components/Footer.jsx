import React, { useState } from 'react';
import {
  ChevronDown,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Heart,
  Sparkles,
  Send,
  CheckCircle,
  Clock,
  Utensils,
  Award,
  Flame,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const FAQS = [
  {
    q: 'How does the Insulated Steel Dabba pickup work?',
    a: 'Your meal is delivered hot in a 304 food-grade stainless steel dabba. When our rider delivers the next day’s lunch, they collect the previous day’s cleaned dabba container. Zero plastic waste, 100% eco-friendly!'
  },
  {
    q: 'Can I pause my subscription meals if I travel?',
    a: 'Yes, absolutely! You can pause any upcoming dates directly in the app before 9:00 AM on the delivery day. Your remaining meal balance automatically extends by the exact number of paused days.'
  },
  {
    q: 'What oil and ingredients are used in cooking?',
    a: 'We strictly cook using cold-pressed mustard oil, sunflower oil, and pure Gir cow desi ghee for our rotis, dal tadka, and signature Dal Baati Churma. We NEVER use reheated palm oils, artificial MSG, or baking soda.'
  },
  {
    q: 'What time are Lunch and Dinner delivered in Jaipur, Ajmer & Kishangarh?',
    a: 'Lunch is delivered piping hot between 12:30 PM and 1:30 PM. Dinner is delivered between 7:30 PM and 8:30 PM across all 56+ Rajasthan delivery hubs.'
  }
];

const WHATSAPP_URL = "https://wa.me/919829012345?text=Hello%20HomeFeast!%20I%20want%20to%20inquire%20about%20tiffin%20subscriptions%20and%20daily%20homestyle%20meals.";

export const Footer = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('🎉 Subscribed! You will receive weekly menu drops & exclusive discounts.', 'success');
  };

  return (
    <footer style={{ background: '#141211', color: '#FAF7F2', paddingTop: '80px', paddingBottom: '30px' }}>
      <div className="container">
        {/* FAQ Section */}
        <div style={{ maxWidth: '780px', margin: '0 auto 70px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(232, 89, 12, 0.18)',
                color: '#FF922B',
                border: '1px solid rgba(232, 89, 12, 0.35)',
                fontSize: '11.5px',
                padding: '4px 12px'
              }}
            >
              Common Questions
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', marginTop: '10px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: isOpen ? '#1E1B1A' : '#231F1E',
                    borderRadius: '14px',
                    border: isOpen ? '1.5px solid #DC2626' : '1px solid #383330',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 4px 20px rgba(232, 89, 12, 0.15)' : '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '12px'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isOpen ? '#FF922B' : '#FFFFFF' }}>
                      <span style={{ color: 'var(--primary)', fontSize: '16px', fontWeight: 800 }}>Q.</span>
                      <span>{faq.q}</span>
                    </span>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isOpen ? 'rgba(232, 89, 12, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isOpen ? '#DC2626' : '#D6D3D1',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease'
                        }}
                      />
                    </div>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '14px 22px 18px',
                        fontSize: '14px',
                        color: '#E7E5E4',
                        lineHeight: 1.65,
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* NEWSLETTER STRIP (Reference Style) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1F1B19 0%, #292320 100%)',
            border: '1px solid #3D3530',
            borderRadius: '20px',
            padding: '36px 40px',
            marginBottom: '50px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(232, 89, 12, 0.2)',
                  color: '#FF922B',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={11} />
                Exclusive Offers & Menus
              </span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Subscribe to Chef's Weekly Specials
            </h3>
            <p style={{ fontSize: '13.5px', color: '#A8A29E', lineHeight: 1.5, margin: 0 }}>
              Get exclusive tiffin discount codes, festival specials, and upcoming weekly menu drops delivered directly to your inbox.
            </p>
          </div>

          <div style={{ flexGrow: 1, maxWidth: '440px', width: '100%' }}>
            {isSubscribed ? (
              <div
                style={{
                  background: 'rgba(43, 138, 62, 0.15)',
                  border: '1px solid rgba(43, 138, 62, 0.35)',
                  borderRadius: '12px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8CE99A'
                }}
              >
                <CheckCircle size={20} color="#51CF66" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  You are subscribed! Check your inbox for your 20% welcome discount.
                </span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1px solid #4D443E',
                    background: '#141211',
                    color: '#FFFFFF',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(232, 89, 12, 0.35)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Send size={15} />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* TRUST BADGES BAR WITH DIRECT WHATSAPP WEB LINK */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '50px',
            borderBottom: '1px solid #292320',
            paddingBottom: '30px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1C1917', border: '1px solid #2F2926', padding: '12px 16px', borderRadius: '12px' }}>
            <ShieldCheck size={20} color="#DC2626" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>100% FSSAI Certified</div>
              <div style={{ fontSize: '11px', color: '#A8A29E' }}>Lic: 10022011000843</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1C1917', border: '1px solid #2F2926', padding: '12px 16px', borderRadius: '12px' }}>
            <Award size={20} color="#DC2626" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>304 Stainless Steel</div>
              <div style={{ fontSize: '11px', color: '#A8A29E' }}>Zero Plastic Dabbas</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1C1917', border: '1px solid #2F2926', padding: '12px 16px', borderRadius: '12px' }}>
            <Flame size={20} color="#E8590C" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>Pure Gir Cow Ghee</div>
              <div style={{ fontSize: '11px', color: '#A8A29E' }}>Zero Reheated Palm Oil</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1C1917', border: '1px solid #2F2926', padding: '12px 16px', borderRadius: '12px' }}>
            <Clock size={20} color="#2B8A3E" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>20-30 min Express</div>
              <div style={{ fontSize: '11px', color: '#A8A29E' }}>Live GPS Radar Lock</div>
            </div>
          </div>

          {/* Direct WhatsApp Web Button */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat directly on WhatsApp Web"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#1C1917',
              border: '1.5px solid #25D366',
              padding: '12px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#212E27'}
            onMouseLeave={e => e.currentTarget.style.background = '#1C1917'}
          >
            <MessageCircle size={22} color="#25D366" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>24/7 WhatsApp Chat</span>
                <ExternalLink size={11} color="#25D366" />
              </div>
              <div style={{ fontSize: '11px', color: '#25D366', fontWeight: 700 }}>+91 98290 12345</div>
            </div>
          </a>
        </div>

        {/* MULTI-COLUMN FOOTER LINKS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}
        >
          {/* Col 1: Brand & Contact */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="brand-icon-box" style={{ width: '38px', height: '38px', fontSize: '18px' }}>
                🍲
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>HomeFeast</span>
            </div>
            <p style={{ fontSize: '13px', color: '#A8A29E', lineHeight: 1.6, marginBottom: '20px' }}>
              Fresh, hygienic & authentic homemade tiffins delivered straight to your doorstep across India.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#D6D3D1' }}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#25D366', fontWeight: 700, textDecoration: 'none' }}
              >
                <MessageCircle size={15} color="#25D366" />
                <span>Chat on WhatsApp (+91 98290 12345)</span>
              </a>

              <a
                href="tel:+919829012345"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D6D3D1', textDecoration: 'none' }}
              >
                <Phone size={14} color="var(--primary)" />
                <span>+91 98290 12345 (Voice Call)</span>
              </a>

              <a
                href="mailto:care@homefasttiffin.in"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D6D3D1', textDecoration: 'none' }}
              >
                <Mail size={14} color="var(--primary)" />
                <span>care@homefasttiffin.in</span>
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A8A29E' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>Jaipur • Ajmer • Kishangarh</span>
              </div>
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#A8A29E' }}>
              <li><a href="#about" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>About HomeFast</a></li>
              <li><a href="#contact" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Contact & Help Center</a></li>
              <li><a href="#hygiene" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Kitchen Hygiene & FSSAI</a></li>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Cloud Kitchen Network</a></li>
              <li><a href="#provider-portal" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Kitchen Partner Portal</a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.15s ease', color: '#25D366' }}>Apply for Delivery Rider Job ↗</a></li>
            </ul>
          </div>

          {/* Col 3: Meal Passes & Services */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Meal Passes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#A8A29E' }}>
              <li><a href="#plans" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>7-Day Trial Pass</a></li>
              <li><a href="#plans" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>15-Day Flexi Saver</a></li>
              <li><a href="#plans" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>30-Day Royal Pass</a></li>
              <li><a href="#thali-builder" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Custom Thali Builder</a></li>
              <li><a href="#my-pass" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Pause / Resume Dates</a></li>
            </ul>
          </div>

          {/* Col 4: Dietary Cuisines */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Dietary Menus
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#A8A29E' }}>
              <li><a href="#menu" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Rajasthani Dal Baati Churma</a></li>
              <li><a href="#menu" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>100% Jain Sattvic (No Garlic)</a></li>
              <li><a href="#menu" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>High-Protein Fitness Meals</a></li>
              <li><a href="#menu" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Rajputana Laal Maas & Murgh</a></li>
              <li><a href="#menu" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>7-Day Menu Rotation</a></li>
            </ul>
          </div>

          {/* Col 5: Popular Rajasthan Hubs */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
              Popular Hubs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px', color: '#A8A29E' }}>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Jaipur (Malviya Nagar & WTP)</a></li>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Jaipur (Mansarovar & Vaishali)</a></li>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Ajmer (Panchsheel & Ana Sagar)</a></li>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Ajmer (Civil Lines & Madar)</a></li>
              <li><a href="#kitchens" style={{ transition: 'color 0.15s ease' }} onMouseEnter={e => e.target.style.color='#FFFFFF'} onMouseLeave={e => e.target.style.color='#A8A29E'}>Kishangarh (Madanganj & CURAJ)</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & SOCIAL BAR */}
        <div
          style={{
            borderTop: '1px solid #292320',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12.5px',
            color: '#78716C'
          }}
        >
          <div>
            © 2026 HomeFast Technologies Pvt Ltd. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Made with</span>
            <Heart size={14} fill="#E03131" color="#E03131" />
            <span>for authentic Ghar Ka Swad across Rajasthan</span>
          </div>

          {/* Social Links with Direct Functional Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#231F1E',
                border: '1px solid #383330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: '#D6D3D1',
                textDecoration: 'none'
              }}
            >
              f
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter / X"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#231F1E',
                border: '1px solid #383330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: '#D6D3D1',
                textDecoration: 'none'
              }}
            >
              𝕏
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#231F1E',
                border: '1px solid #383330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#D6D3D1',
                textDecoration: 'none'
              }}
            >
              in
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#231F1E',
                border: '1px solid #383330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#D6D3D1',
                textDecoration: 'none'
              }}
            >
              📸
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#231F1E',
                border: '1px solid #383330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                color: '#D6D3D1',
                textDecoration: 'none'
              }}
            >
              ▶
            </a>

            {/* Direct WhatsApp Web Social Icon */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat directly on WhatsApp Web"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#25D366',
                border: '1px solid #25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)'
              }}
            >
              <MessageCircle size={16} color="#FFFFFF" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
