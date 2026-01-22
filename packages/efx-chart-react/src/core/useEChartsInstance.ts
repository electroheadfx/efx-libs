/**
 * useEChartsInstance Hook
 *
 * Core hook for ECharts lifecycle management.
 * Uses full ECharts import to include matrix coordinate system.
 */

import type { EChartsOption, ECharts as EChartsType } from 'echarts'
import * as echarts from 'echarts'
import { type RefObject, useCallback, useEffect, useRef } from 'react'

/** Event handler for useEChartsInstance */
type CoreEventHandler = (
  params: Record<string, unknown>,
  chart: EChartsType
) => void

/**
 * Options for useEChartsInstance hook
 */
export interface UseEChartsInstanceOptions {
  /** ECharts option configuration */
  option: EChartsOption
  /** Event handlers (same API as echarts-for-react onEvents) */
  events?: Record<string, CoreEventHandler>
  /** Callback when chart instance is ready */
  onReady?: (chart: EChartsType) => void
  /** Theme name (must be registered with echarts.registerTheme) */
  theme?: string
  /** Renderer type */
  renderer?: 'canvas' | 'svg'
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

/**
 * Core hook for managing ECharts instance lifecycle
 */
export function useEChartsInstance(
  containerRef: RefObject<HTMLDivElement | null>,
  options: UseEChartsInstanceOptions
): UseEChartsInstanceReturn {
  const {
    option,
    events,
    onReady,
    theme,
    renderer = 'canvas',
    autoResize = true,
  } = options

  const instanceRef = useRef<EChartsType | null>(null)
  const eventsRef = useRef<Record<string, CoreEventHandler> | undefined>(events)
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

    // Bind events
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

  // Expose chart instance getter
  const getEchartsInstance = useCallback(() => instanceRef.current, [])

  return {
    getEchartsInstance,
    instanceRef,
  }
}

/** Re-export echarts for external use */
export { echarts }
export type { EChartsType, EChartsOption as EChartsCoreOption }
