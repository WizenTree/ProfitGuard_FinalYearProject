import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemeSwitcher() {
  const { themeMode, setThemeMode, theme } = useTheme();

  return (
    <select
      value={themeMode}
      onChange={(e) => setThemeMode(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: "8px",
        border: `1px solid ${theme.border}`,
        background: theme.cardBg,
        color: theme.text,
        outline: "none",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "14px"
      }}
    >
      <option value="classic">👑 Classic Luxury</option>
      <option value="light">☀️ Light Mode</option>
      <option value="dark">🌙 Dark Mode</option>
      <option value="system">💻 System Default</option>
    </select>
  );
}

export default ThemeSwitcher;