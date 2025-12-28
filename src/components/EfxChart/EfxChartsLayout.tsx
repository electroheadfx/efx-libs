/**
 * EfxChartsLayout Component
 *
 * The main layout component that renders a single ECharts instance
 * with matrix-based grid positioning from ASCII templates.
 */

import {
  useRef,
  useMemo,
  Children,
  isValidElement,
  useState,
  useCallback,
} from 'react'
import { useEChartsInstance, type EChartsType } from './core'
import { useResizeObserver } from './core/useResizeObserver'
import { EfxChart } from './EfxChart'
import {
  parseLayoutTemplate,
  mirrorLayoutHorizontally,
  buildEChartsOption,
  buildMediaDefinitions,
  type EfxMediaUnit,
  type GapConfig,
  type ContainerSize,
} from './utils'
import type { EfxChartsLayoutProps, EfxChartProps } from './types'

/**
 * Extract EfxChart props from children
 */
function extractChartProps(children: React.ReactNode): EfxChartProps[] {
  const props: EfxChartProps[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === EfxChart) {
      props.push(child.props as EfxChartProps)
    }
  })

  return props
}

/**
 * EfxChartsLayout - Matrix-based ECharts dashboard layout
 *
 * Renders a single ECharts canvas with multiple chart grids positioned
 * according to an ASCII template. Supports responsive layouts and
 * provides the same event API as echarts-for-react.
 *
 * @example
 * ```tsx
 * <EfxChartsLayout
 *   template={FINANCE_LAYOUT}
 *   sidebarPosition="left"
 *   onChartReady={(chart) => console.log('Ready!')}
 *   onEvents={{
 *     click: (params) => console.log('Clicked:', params),
 *   }}
 * >
 *   <EfxChart id="header" type="line" data={headerData} />
 *   <EfxChart id="main" type="line" data={mainData} />
 *   <EfxChart id="sidebar" type="bar" data={sidebarData} invertAxis />
 * </EfxChartsLayout>
 * ```
 */
export function EfxChartsLayout({
  template,
  sidebarPosition = 'left',
  gap = 0,
  gapX,
  gapY,
  breakpoints,
  className,
  style,
  children,
  onChartReady,
  onEvents,
  renderer = 'canvas',
  theme,
}: EfxChartsLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track container size for pixel-based gap calculations
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  })

  // Update container size on resize
  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect
    setContainerSize({ width, height })
  }, [])

  // Observe container size
  useResizeObserver(containerRef, {
    onResize: handleResize,
    debounceMs: 50,
    enabled: true,
  })

  // Calculate gap configuration
  const gapConfig: GapConfig = useMemo(
    () => ({
      x: gapX ?? gap,
      y: gapY ?? gap,
    }),
    [gap, gapX, gapY]
  )

  // Parse the template for all breakpoints
  const parsedLayouts = useMemo(() => parseLayoutTemplate(template), [template])

  // Apply sidebar position transformation if needed
  const { mobileLayout, desktopLayout } = useMemo(() => {
    let mobile = parsedLayouts.mobile
    let desktop = parsedLayouts.desktop

    // Mirror layout if sidebar should be on the right
    if (sidebarPosition === 'right') {
      mobile = mirrorLayoutHorizontally(mobile)
      desktop = mirrorLayoutHorizontally(desktop)
    }

    return { mobileLayout: mobile, desktopLayout: desktop }
  }, [parsedLayouts, sidebarPosition])

  // Extract chart props from children
  const chartSections = useMemo(() => extractChartProps(children), [children])

  // Build the ECharts option with media queries for responsive layouts
  const option = useMemo(() => {
    const baseOption = buildEChartsOption(
      chartSections,
      desktopLayout.sectionCoordMap,
      desktopLayout.columns,
      desktopLayout.rows,
      gapConfig,
      containerSize
    )

    // Add media queries for responsive behavior
    const mobileMaxWidth = breakpoints?.mobile?.maxWidth ?? 500
    const media: EfxMediaUnit[] = buildMediaDefinitions(
      mobileLayout,
      desktopLayout,
      chartSections,
      mobileMaxWidth,
      gapConfig,
      containerSize
    )

    return {
      ...baseOption,
      media,
    } as unknown as import('./core').EChartsCoreOption
  }, [
    chartSections,
    desktopLayout,
    mobileLayout,
    breakpoints,
    gapConfig,
    containerSize,
  ])

  // Handle chart ready callback
  const handleReady = useMemo(() => {
    if (!onChartReady) return undefined
    return (chart: EChartsType) => {
      onChartReady(chart as unknown as import('echarts').ECharts)
    }
  }, [onChartReady])

  // Convert events to core format
  const coreEvents = useMemo(() => {
    if (!onEvents) return undefined

    const events: Record<
      string,
      (params: Record<string, unknown>, chart: EChartsType) => void
    > = {}

    for (const [eventName, handler] of Object.entries(onEvents)) {
      events[eventName] = (params, chart) => {
        handler(params, chart as unknown as import('echarts').ECharts)
      }
    }

    return events
  }, [onEvents])

  // Initialize ECharts
  useEChartsInstance(containerRef, {
    option,
    events: coreEvents,
    onReady: handleReady,
    renderer,
    theme,
    autoResize: true,
  })

  // Container styles - fill parent container height
  // Uses both height: 100% and flex: 1 to work in both block and flex parent contexts
  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: 0, // Important for flex containers to allow shrinking
      ...style,
    }),
    [style]
  )

  return <div ref={containerRef} className={className} style={containerStyle} />
}

export default EfxChartsLayout
