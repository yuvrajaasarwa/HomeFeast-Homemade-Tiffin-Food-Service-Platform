import React from 'react';
import {
  Users,
  Building,
  MapPin,
  Star,
  ShieldCheck,
  Award,
  Flame,
  Heart,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Utensils
} from 'lucide-react';

export const AboutPage = ({ onExploreMenu, onExplorePlans }) => {
  return (
    <div style={{ background: '#FAF8F5', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Section (Matching Reference) */}
      <section style={{ padding: '60px 20px 40px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px', border: '1px solid rgba(220, 38, 38, 0.25)' }}>
          <Sparkles size={16} />
          <span>Our Story & Mission</span>
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#1C1917', lineHeight: 1.2, margin: '0 0 14px 0' }}>
          Bringing Back the Joy of <br />
          <span style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Authentic Ghar Ka Khana
          </span>
        </h1>

        <p style={{ fontSize: '16px', color: '#57534E', lineHeight: 1.6, margin: 0 }}>
          We're on a mission to transform how Rajasthan eats daily. From authentic pure desi ghee Dal Baati Churma to Sattvic Jain & High-Protein fitness meals, HomeFast delivers wholesome, hygienic ghar-jaisa swad in 304 insulated stainless steel dabbas.
        </p>
      </section>

      <div className="container">
        {/* 4 Stat Badges (Matching Reference Screenshot 2) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '60px'
          }}
        >
          {/* Stat 1: 28K+ Customers */}
          <div
            className="card-clean"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Users size={24} color="#DC2626" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.02em' }}>
              28K+
            </div>
            <div style={{ fontSize: '13px', color: '#78716C', fontWeight: 600, marginTop: '2px' }}>
              Happy Tiffin Subscribers
            </div>
          </div>

          {/* Stat 2: 56+ Kitchens */}
          <div
            className="card-clean"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <Building size={24} color="#D97706" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.02em' }}>
              70+
            </div>
            <div style={{ fontSize: '13px', color: '#78716C', fontWeight: 600, marginTop: '2px' }}>
              Verified Cloud Kitchen Hubs (Rajasthan)
            </div>
          </div>

          {/* Stat 3: 3 Rajasthan Cities */}
          <div
            className="card-clean"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#EBFBEE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <MapPin size={24} color="#2B8A3E" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.02em' }}>
              3
            </div>
            <div style={{ fontSize: '13px', color: '#78716C', fontWeight: 600, marginTop: '2px' }}>
              Cities (Jaipur, Ajmer, Kishangarh)
            </div>
          </div>

          {/* Stat 4: 4.95 Rating */}
          <div
            className="card-clean"
            style={{
              padding: '28px 20px',
              textAlign: 'center',
              borderRadius: '20px',
              border: '1px solid #EAE3D9'
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#FFF9DB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}
            >
              <Star size={24} color="#F59E0B" fill="#F59E0B" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#1C1917', letterSpacing: '-0.02em' }}>
              4.95★
            </div>
            <div style={{ fontSize: '13px', color: '#78716C', fontWeight: 600, marginTop: '2px' }}>
              Hygiene & Taste Rating
            </div>
          </div>
        </div>

        {/* "Our Story - Started with a Simple Idea" Section */}
        <div
          className="card-clean"
          style={{
            padding: '44px 40px',
            borderRadius: '24px',
            border: '1px solid #EAE3D9',
            marginBottom: '60px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#DC2626', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              <span>Our Story</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', lineHeight: 1.3, marginBottom: '14px' }}>
              Started with a <span style={{ color: '#DC2626' }}>Simple Idea</span>
            </h2>
            <p style={{ fontSize: '14.5px', color: '#57534E', lineHeight: 1.7, marginBottom: '14px' }}>
              Like thousands of students and working professionals in Jaipur, Ajmer, and Kishangarh, we struggled every day with oily, stale restaurant food, unhealthy plastic dabbas, and unreliable local messes.
            </p>
            <p style={{ fontSize: '14.5px', color: '#57534E', lineHeight: 1.7, marginBottom: '20px' }}>
              We asked ourselves: <em>Why can't daily food delivery be as wholesome, loving, and pure as Maa ke haath ka khana?</em> HomeFast was born to solve this. Today, we cook in certified FSSAI central kitchens with 100% pure desi ghee, mustard oil, and deliver piping hot in 304 food-grade stainless steel dabbas.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>
                <CheckCircle size={16} color="#2B8A3E" />
                <span>Zero Reheated Palm Oils & Zero Soda Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>
                <CheckCircle size={16} color="#2B8A3E" />
                <span>Insulated Stainless Steel Dabbas (Zero Plastic Leach)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 700, color: '#1C1917' }}>
                <CheckCircle size={16} color="#2B8A3E" />
                <span>Flexibility to Pause / Resume Anytime</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
              alt="Authentic Rajasthani Thali Preparation"
              style={{
                width: '100%',
                height: '340px',
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'rgba(28, 25, 23, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '12px 18px',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <ShieldCheck size={20} color="#DC2626" />
              <span>FSSAI Central Kitchen Station #10022011000843</span>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ background: '#FFF4E6', color: '#DC2626', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              Our Promise
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1C1917', marginTop: '8px' }}>
              The 4 Pillars of HomeFast
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div className="card-clean" style={{ padding: '24px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Flame size={20} color="#DC2626" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                Pure Cow Ghee Cooking
              </h3>
              <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                We exclusively cook with Gir cow desi ghee and kachi ghani mustard oil. No cheap vanaspati or trans-fats.
              </p>
            </div>

            <div className="card-clean" style={{ padding: '24px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Award size={20} color="#D97706" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                304 Stainless Steel Dabbas
              </h3>
              <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                Zero plastic containers. Our insulated steel tiffins keep rotis soft and curries piping hot at 65°C.
              </p>
            </div>

            <div className="card-clean" style={{ padding: '24px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EBFBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Clock size={20} color="#2B8A3E" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                20-30 min Express Dispatch
              </h3>
              <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                Hyperlocal cloud kitchen hubs across Jaipur, Ajmer, and Kishangarh guarantee on-time lunch & dinner.
              </p>
            </div>

            <div className="card-clean" style={{ padding: '24px', borderRadius: '18px', border: '1px solid #EAE3D9' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFF0F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Heart size={20} color="#E64980" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', marginBottom: '6px' }}>
                Light & Digestive
              </h3>
              <p style={{ fontSize: '13px', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                Everyday food must not feel heavy. Balanced spices, fresh daily market vegetables, and low salt/oil.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bottom Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1C1917 0%, #2E1B0E 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 48px',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)'
          }}
        >
          <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '10px' }}>
            Ready to Taste Genuine Ghar Ka Swad?
          </h2>
          <p style={{ fontSize: '14.5px', color: '#D6D3D1', maxWidth: '600px', margin: '0 auto 24px' }}>
            Start with our 7-Day Trial Pass starting at just ₹79 per meal. Free doorstep delivery in insulated steel dabbas.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onExplorePlans ? onExplorePlans() : window.location.hash = '#plans'}
            >
              <span>View Tiffin Passes</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              style={{ background: '#FFFFFF', color: '#1C1917', border: 'none' }}
              onClick={() => onExploreMenu ? onExploreMenu() : window.location.hash = '#menu'}
            >
              <span>Explore Today's Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
