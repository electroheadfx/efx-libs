'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { CustomProvider } from 'rsuite';
import type {
  AppTheme,
  ThemeSource,
  ThemeContextValue,
  EChartsInstance,
} from '@/types/theme.types';
import { mapToEChartsTheme } from '@/types/theme.types';

// Context with default values
const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: AppTheme;
  defaultThemeSource?: ThemeSource;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultThemeSource = 'system',
}: ThemeProviderProps) {
  const [themeSource, setThemeSource] = useState<ThemeSource>(defaultThemeSource);
  const [manualTheme, setManualTheme] = useState<AppTheme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<AppTheme>('light');
  const [chartInstances] = useState(() => new Map<string, EChartsInstance>());

  // Detect system theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Initial detection
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute active theme
  const theme = themeSource === 'system' ? systemTheme : manualTheme;
  const echartsTheme = mapToEChartsTheme(theme);

  // Sync ECharts instances when theme changes
  useEffect(() => {
    for (const chart of chartInstances.values()) {
      try {
        // ECharts 6 setTheme API
        chart.setTheme(echartsTheme);
      } catch {
        // Fallback: some versions may not support setTheme
        console.warn('setTheme not supported, chart may need re-render');
      }
    }
  }, [echartsTheme, chartInstances]);

  // Register chart instance
  const registerChart = useCallback(
    (id: string, instance: EChartsInstance) => {
      chartInstances.set(id, instance);
    },
    [chartInstances]
  );

  // Unregister chart instance
  const unregisterChart = useCallback(
    (id: string) => {
      chartInstances.delete(id);
    },
    [chartInstances]
  );

  // Set theme handler
  const setTheme = useCallback((newTheme: AppTheme) => {
    setManualTheme(newTheme);
    setThemeSource('manual');
  }, []);

  // Context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      themeSource,
      echartsTheme,
      setTheme,
      setThemeSource,
      registerChart,
      unregisterChart,
    }),
    [theme, themeSource, echartsTheme, setTheme, registerChart, unregisterChart]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <CustomProvider theme={theme}>{children}</CustomProvider>
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
