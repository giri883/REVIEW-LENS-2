import React, { createContext, useContext, useEffect } from 'react';

export interface ThemeConfig {
  id: 'green';
  name: 'Emerald Green';
  emoji: '🌿';
  accentText: string;
  accentGradient: string;
  btnGradient: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  headerBorder: string;
  glowGradient: string;
  swatchBg: string;
  isDark: boolean;
}

export const GREEN_THEME: ThemeConfig = {
  id: 'green',
  name: 'Emerald Green',
  emoji: '🌿',
  accentText: 'text-emerald-600',
  accentGradient: 'from-emerald-600 via-teal-600 to-green-600',
  btnGradient: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25',
  pageBg: 'bg-gradient-to-b from-emerald-50/40 via-white to-teal-50/20 text-slate-800 selection:bg-emerald-500/20 selection:text-emerald-900',
  cardBg: 'bg-white/95',
  cardBorder: 'border-emerald-100',
  cardHoverBorder: 'hover:border-emerald-400',
  badgeBg: 'bg-emerald-50',
  badgeText: 'text-emerald-800',
  badgeBorder: 'border-emerald-200',
  headerBg: 'bg-white/95',
  headerBorder: 'border-emerald-100',
  glowGradient: 'from-emerald-400/20 via-teal-300/15 to-green-400/20',
  swatchBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
  isDark: false,
};

interface ThemeContextType {
  config: ThemeConfig;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  config: GREEN_THEME,
  isDark: false,
  isLight: true,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Lock app permanently to Green theme - no switching based on user
    localStorage.removeItem('reviewlens_active_palette');
    localStorage.removeItem('reviewlens_theme');
    document.documentElement.setAttribute('data-theme', 'green');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        config: GREEN_THEME,
        isDark: false,
        isLight: true,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
