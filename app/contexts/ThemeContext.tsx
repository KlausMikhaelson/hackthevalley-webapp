'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'emerald' | 'indigo';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  themeMode: ThemeMode;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorSchemes = {
  blue: {
    light: { 
      primary: '#1976d2', 
      secondary: '#dc004e',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
      accent: '#64b5f6'
    },
    dark: { 
      primary: '#90caf9', 
      secondary: '#f48fb1',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      accent: '#60a5fa'
    }
  },
  purple: {
    light: { 
      primary: '#7b1fa2', 
      secondary: '#f57c00',
      gradient: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
      accent: '#ba68c8'
    },
    dark: { 
      primary: '#ce93d8', 
      secondary: '#ffb74d',
      gradient: 'linear-gradient(135deg, #6b21a8 0%, #8b5cf6 100%)',
      accent: '#a855f7'
    }
  },
  green: {
    light: { 
      primary: '#388e3c', 
      secondary: '#d32f2f',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      accent: '#81c784'
    },
    dark: { 
      primary: '#81c784', 
      secondary: '#ef5350',
      gradient: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
      accent: '#4ade80'
    }
  },
  orange: {
    light: { 
      primary: '#f57c00', 
      secondary: '#303f9f',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
      accent: '#ffb74d'
    },
    dark: { 
      primary: '#ffb74d', 
      secondary: '#7986cb',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      accent: '#fb923c'
    }
  },
  pink: {
    light: { 
      primary: '#c2185b', 
      secondary: '#00796b',
      gradient: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
      accent: '#f06292'
    },
    dark: { 
      primary: '#f06292', 
      secondary: '#4db6ac',
      gradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
      accent: '#f472b6'
    }
  },
  cyan: {
    light: { 
      primary: '#0097a7', 
      secondary: '#5d4037',
      gradient: 'linear-gradient(135deg, #0097a7 0%, #00bcd4 100%)',
      accent: '#4dd0e1'
    },
    dark: { 
      primary: '#4dd0e1', 
      secondary: '#8d6e63',
      gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)',
      accent: '#22d3ee'
    }
  },
  emerald: {
    light: { 
      primary: '#00c853', 
      secondary: '#ff1744',
      gradient: 'linear-gradient(135deg, #00c853 0%, #4caf50 100%)',
      accent: '#69f0ae'
    },
    dark: { 
      primary: '#69f0ae', 
      secondary: '#ff5252',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      accent: '#34d399'
    }
  },
  indigo: {
    light: { 
      primary: '#3f51b5', 
      secondary: '#ff5722',
      gradient: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
      accent: '#9c27b0'
    },
    dark: { 
      primary: '#9c27b0', 
      secondary: '#ff7043',
      gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
      accent: '#8b5cf6'
    }
  }
};

interface ThemeProviderWrapperProps {
  children: React.ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedColorScheme = localStorage.getItem('theme-colorScheme') as ColorScheme;
    const savedThemeMode = localStorage.getItem('theme-mode') as ThemeMode;
    
    if (savedColorScheme && colorSchemes[savedColorScheme]) {
      setColorScheme(savedColorScheme);
    }
    if (savedThemeMode && ['light', 'dark'].includes(savedThemeMode)) {
      setThemeMode(savedThemeMode);
    }
  }, []);

  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('theme-colorScheme', colorScheme);
    localStorage.setItem('theme-mode', themeMode);
  }, [colorScheme, themeMode]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: colorSchemes[colorScheme][themeMode].primary,
        light: colorSchemes[colorScheme][themeMode].accent,
      },
      secondary: {
        main: colorSchemes[colorScheme][themeMode].secondary,
      },
      background: {
        default: themeMode === 'dark' ? '#0f0f23' : '#fafafa',
        paper: themeMode === 'dark' ? '#1a1a2e' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
        secondary: themeMode === 'dark' ? '#a1a1aa' : '#666666',
      },
      success: {
        main: themeMode === 'dark' ? '#4ade80' : '#22c55e',
      },
      warning: {
        main: themeMode === 'dark' ? '#fbbf24' : '#f59e0b',
      },
      error: {
        main: themeMode === 'dark' ? '#f87171' : '#ef4444',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: themeMode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
              : '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            border: themeMode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: themeMode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                : '0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: themeMode === 'dark' ? '#16213e' : '#f8fafc',
            borderRight: themeMode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: themeMode === 'dark' ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: themeMode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            height: 8,
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 8,
              background: colorSchemes[colorScheme][themeMode].gradient,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            background: colorSchemes[colorScheme][themeMode].gradient,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: colorSchemes[colorScheme][themeMode].gradient,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colorSchemes[colorScheme][themeMode].primary,
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colorSchemes[colorScheme][themeMode].primary,
                  borderWidth: 2,
                },
              },
              // Remove spinner arrows from number inputs
              '& input[type=number]': {
                '-moz-appearance': 'textfield',
                '&::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '&::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              },
            },
            // Remove double outline issue
            '& .MuiOutlinedInput-root.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colorSchemes[colorScheme][themeMode].primary,
                borderWidth: 2,
                outline: 'none',
              },
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: colorSchemes[colorScheme][themeMode].gradient,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-thumb': {
              background: colorSchemes[colorScheme][themeMode].gradient,
            },
            '& .MuiSwitch-track': {
              backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
  });

  const value: ThemeContextType = {
    colorScheme,
    themeMode,
    setColorScheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProviderWrapper');
  }
  return context;
}