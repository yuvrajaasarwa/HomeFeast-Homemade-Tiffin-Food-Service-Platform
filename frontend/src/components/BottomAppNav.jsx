import React from 'react';
import { Home, Store, BookOpen, Utensils, Award, Calendar, ChefHat, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomAppNav = ({ activePage, setActivePage }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'kitchens', label: 'Kitchens', icon: Store },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'thali-builder', label: 'Thali', icon: Utensils },
    { id: 'plans', label: 'Passes', icon: Award },
    { id: 'my-pass', label: 'My Pass', icon: Calendar },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 6px',
        maxWidth: '1240px',
        margin: '0 auto',
        borderRadius: '24px 24px 0 0'
      }}
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
            <span style={{ fontSize: '10.5px', fontWeight: isActive ? 800 : 600 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
