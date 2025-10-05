"use client";

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';

interface AppThemeContextValue {
	mode: PaletteMode;
	toggleMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined);

export const useAppTheme = () => {
	const ctx = useContext(AppThemeContext);
	if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
	return ctx;
};

const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		primary: { main: '#3b82f6' },
		secondary: { main: '#8b5cf6' },
		success: { main: '#22c55e' },
		warning: { main: '#facc15' },
		error: { main: '#ef4444' },
		background: {
			default: '#0f0f23',
			paper: '#1a1a2e',
		},
		text: {
			primary: '#ffffff',
			secondary: '#a1a1aa',
		},
	},
	shape: { borderRadius: 12 },
	typography: {
		fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
		h6: { fontWeight: 600 },
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundColor: 'var(--card-bg)',
					border: '1px solid var(--border-color)',
					color: 'var(--foreground)',
					boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 600,
					} as any,
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: '#1a1a2e',
					border: '1px solid var(--border-color)',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: '#27272a',
					'& fieldset': { borderColor: '#3b82f640' },
					'&:hover fieldset': { borderColor: '#3b82f680' },
					'&.Mui-focused fieldset': { borderColor: '#3b82f6' },
					color: '#ffffff',
					} as any,
				input: {
					'::placeholder': { color: '#a1a1aa', opacity: 1 },
					} as any,
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					borderRadius: 4,
					backgroundColor: '#27272a',
					} as any,
				bar: {
					borderRadius: 4,
					} as any,
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: 600,
					} as any,
			},
		},
	},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
	const [mode, setMode] = useState<PaletteMode>('dark');
	const toggleMode = () => setMode((m: PaletteMode) => (m === 'dark' ? 'light' : 'dark'));

	const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

	return (
		<AppThemeContext.Provider value={{ mode, toggleMode }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppThemeContext.Provider>
	);
}

