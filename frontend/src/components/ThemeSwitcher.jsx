import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeSwitcher() {
  const { themeMode, setThemeMode, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { id: 'classic', label: 'Classic Luxury', icon: '👑' },
    { id: 'light', label: 'Light Mode', icon: '☀️' },
    { id: 'dark', label: 'Dark Mode', icon: '🌙' },
    { id: 'system', label: 'System Default', icon: '💻' }
  ];

  const currentOption = options.find(o => o.id === themeMode) || options[0];

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          borderRadius: '24px',
          border: `1px solid ${theme.border}`,
          background: theme.cardBg,
          color: theme.text,
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          boxShadow: theme.shadow,
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = theme.bg}
        onMouseOut={(e) => e.currentTarget.style.background = theme.cardBg}
      >
        <span style={{ fontSize: '16px' }}>{currentOption.icon}</span>
        <span>{currentOption.label}</span>
        <svg 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease', color: theme.textMuted }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '10px',
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          minWidth: '180px',
          overflow: 'hidden',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {options.map((option) => {
            const isActive = themeMode === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setThemeMode(option.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: isActive ? `${theme.accent}15` : 'transparent',
                  color: isActive ? theme.accent : theme.text,
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = theme.bg; }}
                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: '16px' }}>{option.icon}</span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;