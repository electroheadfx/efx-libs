/**
 * useStreamingData Hook
 *
 * Manages streaming data loading state for EfxChart2 components.
 * Handles deferred promises, loading states, and placeholder data generation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ============================================================================
// Types
// ============================================================================

export type PlaceholderType = "timeseries" | "category" | "numeric";

export interface PlaceholderConfig {
	/** Placeholder data type (default: 'timeseries') */
	type?: PlaceholderType;
	/** Number of data points (default: 50) */
	count?: number;
}

export interface PlaceholderOptions extends PlaceholderConfig {
	/** Per-section overrides */
	overrides?: Record<string, PlaceholderConfig>;
}

export interface UseStreamingDataOptions<T = unknown, TData = unknown> {
	/** Record of deferred promises from TanStack Router loader */
	loaderData: Record<string, Promise<T>> | { [K in string]: Promise<T> };
	/** Section names to track (e.g., ['header', 'sidebar', 'main', 'footer']) */
	sections: readonly string[];
	/** Placeholder configuration (auto-generates if not provided) */
	placeholder?: PlaceholderOptions;
	/** Custom placeholders per section (overrides auto-generation) */
	customPlaceholders?: Record<string, TData>;
	/** Callback when a section finishes loading */
	onSectionLoad?: (section: string, data: T) => void;
}

export interface UseStreamingDataReturn<T = unknown, TData = unknown[]> {
	/** Raw resolved data for each section (undefined if not loaded) */
	sectionData: Record<string, T | undefined>;
	/** Loading state for each section (true = still loading) */
	sectionLoadingStates: Record<string, boolean>;
	/** Data with placeholders applied (safe to render) */
	chartData: Record<string, TData>;
	/** Reset all section data (call on navigation/refresh) */
	reset: () => void;
	/** True if all sections have finished loading */
	allLoaded: boolean;
	/** Load time in ms per section (if data includes loadTime property) */
	loadTimes: Record<string, number | undefined>;
}

// ============================================================================
// Placeholder Generators
// ============================================================================

function generatePlaceholder(type: PlaceholderType, count: number): unknown[] {
	switch (type) {
		case "timeseries":
			return Array.from({ length: count }, (_, i) => {
				const date = new Date(2025, 0, i + 1);
				return [date.toISOString().slice(0, 10), 100];
			});
		case "category":
			return Array.from({ length: count }, (_, i) => [
				`Category ${i + 1}`,
				100,
			]);
		case "numeric":
			return Array.from({ length: count }, (_, i) => [i, 100]);
		default:
			return Array.from({ length: count }, (_, i) => [i, 100]);
	}
}

// ============================================================================
// Hook Implementation
// ============================================================================

const DEFAULT_TYPE: PlaceholderType = "timeseries";
const DEFAULT_COUNT = 50;

export function useStreamingData<T = unknown, TData = unknown[]>(
	options: UseStreamingDataOptions<T, TData>,
): UseStreamingDataReturn<T, TData> {
	const {
		loaderData,
		sections,
		placeholder = {},
		customPlaceholders = {},
		onSectionLoad,
	} = options;

	const [sectionData, setSectionData] = useState<Record<string, T>>({});

	// Store callback in ref to avoid re-triggering effect when callback reference changes
	const onSectionLoadRef = useRef(onSectionLoad);
	onSectionLoadRef.current = onSectionLoad;

	// Generate placeholders for each section
	const placeholders = useMemo(() => {
		const result: Record<string, unknown> = {};
		const defaultType = placeholder.type ?? DEFAULT_TYPE;
		const defaultCount = placeholder.count ?? DEFAULT_COUNT;

		for (const section of sections) {
			if (customPlaceholders[section]) {
				result[section] = customPlaceholders[section];
				continue;
			}
			const override = placeholder.overrides?.[section] ?? {};
			const type = override.type ?? defaultType;
			const count = override.count ?? defaultCount;
			result[section] = generatePlaceholder(type, count);
		}
		return result;
	}, [sections, placeholder, customPlaceholders]);

	// Listen to each deferred promise independently
	useEffect(() => {
		sections.forEach((section) => {
			const promise = loaderData[section];
			if (promise && typeof promise.then === "function") {
				promise.then((data) => {
					setSectionData((prev) => ({ ...prev, [section]: data }));
					onSectionLoadRef.current?.(section, data);
				});
			}
		});
	}, [loaderData, sections]);

	// Calculate loading states
	const sectionLoadingStates = useMemo(() => {
		return sections.reduce(
			(acc, section) => {
				acc[section] = !sectionData[section];
				return acc;
			},
			{} as Record<string, boolean>,
		);
	}, [sections, sectionData]);

	// Get chart data with placeholders applied
	const chartData = useMemo(() => {
		return sections.reduce(
			(acc, section) => {
				const resolved = sectionData[section] as { data?: TData } | undefined;
				acc[section] = (resolved?.data ??
					resolved ??
					placeholders[section]) as TData;
				return acc;
			},
			{} as Record<string, TData>,
		);
	}, [sections, sectionData, placeholders]);

	const allLoaded = useMemo(() => {
		return sections.every((section) => sectionData[section] !== undefined);
	}, [sections, sectionData]);

	const loadTimes = useMemo(() => {
		return sections.reduce(
			(acc, section) => {
				const data = sectionData[section] as { loadTime?: number } | undefined;
				acc[section] = data?.loadTime;
				return acc;
			},
			{} as Record<string, number | undefined>,
		);
	}, [sections, sectionData]);

	const reset = useCallback(() => setSectionData({}), []);

	return {
		sectionData,
		sectionLoadingStates,
		chartData,
		reset,
		allLoaded,
		loadTimes,
	};
}
