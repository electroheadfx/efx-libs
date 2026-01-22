/**
 * useEChartsInstance Hook
 *
 * Core hook for ECharts lifecycle management.
 * Provides same event API as echarts-for-react with additional flexibility.
 *
 * IMPORTANT: Uses full ECharts import to include matrix coordinate system
 * which is required for the finance.js-style layout positioning.
 */

import type {
	EChartsOption as EChartsCoreOption,
	ECharts as EChartsType,
} from "echarts"
// Use full ECharts import to include matrix coordinate system
// The modular imports don't include the matrix feature
import * as echarts from "echarts"
import { type RefObject, useCallback, useEffect, useRef } from "react"

/** Event handler for useEChartsInstance (uses core EChartsType) */
type CoreEventHandler = (
	params: Record<string, unknown>,
	chart: EChartsType,
) => void

/**
 * Core hook for managing ECharts instance lifecycle
 *
 * @param containerRef - Ref to the container element
 * @param options - Configuration options
 * @returns Object with getEchartsInstance function and instanceRef
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const { getEchartsInstance } = useEChartsInstance(containerRef, {
 *   option: chartOption,
 *   events: { click: (params, chart) => console.log(params) },
 *   onReady: (chart) => console.log('Chart ready'),
 * });
 * ```
 */
/**
 * Options for useEChartsInstance hook
 */
export interface UseEChartsInstanceOptions {
	/** ECharts option configuration */
	option: EChartsCoreOption
	/** Event handlers (same API as echarts-for-react onEvents) */
	events?: Record<string, CoreEventHandler>
	/** Callback when chart instance is ready */
	onReady?: (chart: EChartsType) => void
	/** Theme name (must be registered with echarts.registerTheme) */
	theme?: string
	/** Renderer type */
	renderer?: "canvas" | "svg"
	/** Whether to auto-resize on container size change */
	autoResize?: boolean
}

/**
 * Return type for useEChartsInstance hook
 */
export interface UseEChartsInstanceReturn {
	/** Get the ECharts instance */
	getEchartsInstance: () => EChartsType | null
	/** Ref to the ECharts instance */
	instanceRef: React.MutableRefObject<EChartsType | null>
}

export function useEChartsInstance(
	containerRef: RefObject<HTMLDivElement | null>,
	options: UseEChartsInstanceOptions,
): UseEChartsInstanceReturn {
	const {
		option,
		events,
		onReady,
		theme,
		renderer = "canvas",
		autoResize = true,
	} = options

	const instanceRef = useRef<EChartsType | null>(null)
	const eventsRef = useRef<Record<string, CoreEventHandler> | undefined>(
		events,
	)
	const resizeObserverRef = useRef<ResizeObserver | null>(null)

	// Keep events ref up to date
	useEffect(() => {
		eventsRef.current = events
	}, [events])

	// Initialize chart
	useEffect(() => {
		if (!containerRef.current) return

		// Dispose existing instance if any
		if (instanceRef.current) {
			instanceRef.current.dispose()
		}

		// Initialize ECharts
		const chart = echarts.init(containerRef.current, theme, { renderer })
		instanceRef.current = chart

		// Set initial option
		chart.setOption(option)

		// Bind events (same pattern as echarts-for-react)
		if (eventsRef.current) {
			for (const [eventName, handler] of Object.entries(eventsRef.current)) {
				// biome-ignore lint/suspicious/noExplicitAny: ECharts event params vary by event type
				chart.on(eventName, (params: any) => {
					handler(params, chart)
				})
			}
		}

		// Ready callback
		onReady?.(chart)

		// Auto-resize observer
		if (autoResize && containerRef.current) {
			resizeObserverRef.current = new ResizeObserver(() => {
				if (instanceRef.current && !instanceRef.current.isDisposed()) {
					instanceRef.current.resize()
				}
			})
			resizeObserverRef.current.observe(containerRef.current)
		}

		// Cleanup
		return () => {
			resizeObserverRef.current?.disconnect()
			if (instanceRef.current && !instanceRef.current.isDisposed()) {
				instanceRef.current.dispose()
			}
			instanceRef.current = null
		}
	}, [containerRef, theme, renderer, autoResize, onReady, option])

	// Update option when it changes (handled in initialization effect)
	// No separate effect needed since option is in init dependencies

	// Expose chart instance getter
	const getEchartsInstance = useCallback(() => instanceRef.current, [])

	return {
		getEchartsInstance,
		instanceRef,
	}
}

/**
 * Re-export echarts for external use
 */
export { echarts }
export type { EChartsType, EChartsCoreOption }
