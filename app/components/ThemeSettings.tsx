'use client';

import { useCustomTheme, ColorScheme, colorSchemes } from '../contexts/CustomThemeContext';

export default function ThemeSettings() {
  const { theme, setMode, setColorScheme, toggleMode } = useCustomTheme();

  const handleColorSchemeChange = (colorScheme: ColorScheme) => {
    setColorScheme(colorScheme);
  };

  return (
    <div className="space-y-8">
      {/* Theme Settings Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Theme Settings</h1>
        <p className="text-[var(--text-secondary)]">Customize your dashboard appearance</p>
      </div>

      {/* Dark Mode Toggle */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Dark Mode</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Switch between light and dark appearance
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 ${
                theme.mode === 'dark' 
                  ? 'bg-gradient-primary' 
                  : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                  theme.mode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-[var(--foreground)]">
              {theme.mode === 'dark' ? 'Dark' : 'Light'}
            </span>
          </div>
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Color Scheme</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Choose your preferred accent color
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(colorSchemes).map(([key, scheme]) => {
            const isSelected = theme.colorScheme === key;
            return (
              <button
                key={key}
                onClick={() => handleColorSchemeChange(key as ColorScheme)}
                className={`relative flex items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                    : 'border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/5'
                }`}
                style={{
                  '--preview-color': scheme.colors.primary
                } as React.CSSProperties}
              >
                {/* Color preview circle */}
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ background: scheme.colors.gradient }}
                  />
                  <span className={`text-xs font-medium ${
                    isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'
                  }`}>
                    {scheme.name}
                  </span>
                </div>
                
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg 
                      className="w-4 h-4 text-[var(--accent-primary)]" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}