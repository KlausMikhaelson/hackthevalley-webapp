'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';

export type ColorScheme = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'orange' 
  | 'pink' 
  | 'cyan' 
  | 'emerald' 
  | 'indigo';

interface CustomTheme {
  mode: ThemeMode;
  colorScheme: ColorScheme;
}

interface CustomThemeContextValue {
  theme: CustomTheme;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  toggleMode: () => void;
}

const CustomThemeContext = createContext<CustomThemeContextValue | undefined>(undefined);

export const useCustomTheme = () => {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
};

export const colorSchemes: Record<ColorScheme, { name: string; colors: { primary: string; secondary: string; bg: string; gradient: string } }> = {
  blue: {
    name: 'Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      bg: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    }
  },
  purple: {
    name: 'Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      bg: '#5b21b6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
  },
  green: {
    name: 'Green',
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      bg: '#15803d',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
    }
  },
  orange: {
    name: 'Orange',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      bg: '#c2410c',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    }
  },
  pink: {
    name: 'Pink',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      bg: '#be185d',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    }
  },
  cyan: {
    name: 'Cyan',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      bg: '#0e7490',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
    }
  },
  emerald: {
    name: 'Emerald',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      bg: '#047857',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    }
  },
  indigo: {
    name: 'Indigo',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      bg: '#4338ca',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    }
  }
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [theme, setTheme] = useState<CustomTheme>({
    mode: 'dark',
    colorScheme: 'blue'
  });

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
      } catch (error) {
        console.error('Error loading theme from localStorage:', error);
      }
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme));
    
    // Apply CSS variables to document root
    const root = document.documentElement;
    const colors = colorSchemes[theme.colorScheme].colors;
    
    if (theme.mode === 'dark') {
      root.style.setProperty('--background', '#0f0f23');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--card-bg', '#1a1a2e');
      root.style.setProperty('--sidebar-bg', '#16213e');
      root.style.setProperty('--text-secondary', '#a1a1aa');
      root.style.setProperty('--border-color', '#27272a');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#1a1a1a');
      root.style.setProperty('--card-bg', '#f8fafc');
      root.style.setProperty('--sidebar-bg', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }
    
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-secondary', colors.secondary);
    root.style.setProperty('--accent-bg', colors.bg);
    root.style.setProperty('--accent-gradient', colors.gradient);
    
    // Apply dark/light class to body
    document.body.className = theme.mode;
  }, [theme]);

  const setMode = (mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    setTheme(prev => ({ ...prev, colorScheme }));
  };

  const toggleMode = () => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' }));
  };

  const value: CustomThemeContextValue = {
    theme,
    setMode,
    setColorScheme,
    toggleMode
  };

  return (
    <CustomThemeContext.Provider value={value}>
      {children}
    </CustomThemeContext.Provider>
  );
}