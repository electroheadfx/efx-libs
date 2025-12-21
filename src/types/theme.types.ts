// Theme type definitions for RSuite + ECharts integration

export type AppTheme = "light" | "dark" | "high-contrast";
export type EChartsTheme = "default" | "dark";

export interface ThemeContextValue {
	theme: AppTheme;
	echartsTheme: EChartsTheme;
	setTheme: (theme: AppTheme) => void;
	registerChart: (id: string, instance: EChartsInstance) => void;
	unregisterChart: (id: string) => void;
}

// ECharts instance type (simplified)
export interface EChartsInstance {
	setTheme: (theme: string) => void;
	setOption: (option: unknown, notMerge?: boolean) => void;
	resize: () => void;
	dispose: () => void;
	getOption: () => unknown;
	on: (eventName: string, handler: (...args: unknown[]) => void) => void;
	off: (eventName: string, handler?: (...args: unknown[]) => void) => void;
}

// Map RSuite theme to ECharts theme
export function mapToEChartsTheme(theme: AppTheme): EChartsTheme {
	switch (theme) {
		case "light":
			return "default";
		case "dark":
		case "high-contrast":
			return "dark";
	}
}
