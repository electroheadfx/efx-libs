"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { CustomProvider } from "rsuite";
import type {
	AppTheme,
	EChartsInstance,
	ThemeContextValue,
} from "@/types/theme.types";
import { mapToEChartsTheme } from "@/types/theme.types";

// Context with default values
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Detect system theme preference
function getSystemTheme(): AppTheme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

interface ThemeProviderProps {
	children: ReactNode;
	defaultTheme?: AppTheme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
	// Initialize with system theme if no default provided
	const [theme, setThemeState] = useState<AppTheme>(
		() => defaultTheme ?? getSystemTheme(),
	);
	const [chartInstances] = useState(() => new Map<string, EChartsInstance>());
	const [isInitialized, setIsInitialized] = useState(false);

	// On client-side mount, detect system theme if not already set
	useEffect(() => {
		if (!isInitialized && !defaultTheme) {
			const systemTheme = getSystemTheme();
			setThemeState(systemTheme);
			setIsInitialized(true);
		} else {
			setIsInitialized(true);
		}
	}, [defaultTheme, isInitialized]);

	const echartsTheme = mapToEChartsTheme(theme);

	// Sync ECharts instances when theme changes
	useEffect(() => {
		for (const chart of chartInstances.values()) {
			try {
				// ECharts 6 setTheme API
				chart.setTheme(echartsTheme);
			} catch {
				// Fallback: some versions may not support setTheme
				console.warn("setTheme not supported, chart may need re-render");
			}
		}
	}, [echartsTheme, chartInstances]);

	// Register chart instance
	const registerChart = useCallback(
		(id: string, instance: EChartsInstance) => {
			chartInstances.set(id, instance);
		},
		[chartInstances],
	);

	// Unregister chart instance
	const unregisterChart = useCallback(
		(id: string) => {
			chartInstances.delete(id);
		},
		[chartInstances],
	);

	// Set theme handler
	const setTheme = useCallback((newTheme: AppTheme) => {
		setThemeState(newTheme);
	}, []);

	// Context value
	const contextValue = useMemo<ThemeContextValue>(
		() => ({
			theme,
			echartsTheme,
			setTheme,
			registerChart,
			unregisterChart,
		}),
		[theme, echartsTheme, setTheme, registerChart, unregisterChart],
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
		throw new Error("useAppTheme must be used within a ThemeProvider");
	}
	return context;
}
