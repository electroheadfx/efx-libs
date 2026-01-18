/**
 * EfxChartsLayout Component (Streaming Version)
 *
 * The main layout component that renders a single ECharts instance
 * with matrix-based grid positioning from ASCII templates.
 *
 * STREAMING FEATURES:
 * - Per-section loading states with opacity dimming
 * - RSuite Loader overlay positioned over each grid section
 * - Progressive data loading with visual feedback
 */

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Loader } from 'rsuite'
import { type EChartsType, useEChartsInstance } from './core'
import { useResizeObserver } from './core/useResizeObserver'
import { EfxChart } from './EfxChart'
import type {
  EfxChartProps,
  EfxChartsLayoutProps,
  EfxLayoutTemplate,
} from './types'
import {
  buildEChartsOption,
  buildMediaDefinitions,
  type ContainerSize,
  type EfxMediaUnit,
  type GapConfig,
  mirrorLayoutHorizontally,
  parseLayoutTemplate,
} from './utils'

// ============================================================================
// Streaming Types
// ============================================================================

interface GridPosition {
  left: number
  top: number
  width: number
  height: number
}

interface StreamingState {
  loadedSections: Set<string>
  gridPositions: Record<string, GridPosition>
}

/**
 * Extract EfxChart props from children
 */
function extractChartProps(children: React.ReactNode): EfxChartProps<string>[] {
  const props: EfxChartProps<string>[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === EfxChart) {
      props.push(child.props as EfxChartProps<string>)
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
 *   <EfxChart section="header" type="line" data={headerData} />
 *   <EfxChart section="main" type="line" data={mainData} />
 *   <EfxChart section="sidebar" type="bar" data={sidebarData} invertAxis />
 * </EfxChartsLayout>
 * ```
 */
// ============================================================================
// Streaming Section Loader Component
// ============================================================================

function SectionLoader({
  position,
  isLoading,
}: {
  section: string
  position?: GridPosition
  isLoading: boolean
}) {
  if (!isLoading || !position) return null

  return (
    <div
      className="absolute flex items-center justify-center pointer-events-none"
      style={{
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
      }}
    >
      <Loader size="lg" />
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function EfxChartsLayout<
  TTemplate extends EfxLayoutTemplate = EfxLayoutTemplate
>({
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
  // Streaming props
  loadingStrategy = 'simple',
  sectionLoadingStates,
}: EfxChartsLayoutProps<TTemplate>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<EChartsType | null>(null)

  // Track container size for pixel-based gap calculations
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  })

  // Streaming state: track grid positions for loader overlays
  const [streamingState, setStreamingState] = useState<StreamingState>({
    loadedSections: new Set(),
    gridPositions: {},
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

  // Get section IDs from template
  const sectionIds = useMemo(
    () => template.sections as readonly string[],
    [template]
  )

  // Build the ECharts option with media queries for responsive layouts
  // Apply loading opacity when in streaming mode
  const option = useMemo(() => {
    // Apply loading opacity to sections when in streaming mode
    const sectionsWithLoadingState =
      loadingStrategy === 'streaming' && sectionLoadingStates
        ? chartSections.map((section) => ({
            ...section,
            // Mark section as loading if its state is true (loading)
            _isLoading: sectionLoadingStates[section.section] ?? false,
          }))
        : chartSections

    const baseOption = buildEChartsOption(
      sectionsWithLoadingState,
      desktopLayout.sectionCoordMap,
      desktopLayout.columns,
      desktopLayout.rows,
      gapConfig,
      containerSize,
      loadingStrategy === 'streaming' ? sectionLoadingStates : undefined
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
    loadingStrategy,
    sectionLoadingStates,
  ])

  // Update grid positions for loader overlays (streaming mode)
  const updateGridPositions = useCallback(() => {
    const chart = chartInstanceRef.current
    if (!chart || loadingStrategy !== 'streaming') return

    const positions: Record<string, GridPosition> = {}

    sectionIds.forEach((id, index) => {
      try {
        // biome-ignore lint/suspicious/noExplicitAny: ECharts internal API
        const gridModel = (chart as any).getModel().getComponent('grid', index)
        if (gridModel?.coordinateSystem) {
          const rect = gridModel.coordinateSystem.getRect()
          positions[id] = {
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
          }
        }
      } catch {
        // Grid not ready yet
      }
    })

    setStreamingState((prev) => ({ ...prev, gridPositions: positions }))
  }, [loadingStrategy, sectionIds])

  // Handle chart ready callback
  const handleReady = useCallback(
    (chart: EChartsType) => {
      chartInstanceRef.current = chart
      onChartReady?.(chart as unknown as import('echarts').ECharts)

      // Update grid positions after chart is ready (streaming mode)
      if (loadingStrategy === 'streaming') {
        setTimeout(updateGridPositions, 50)
      }
    },
    [onChartReady, loadingStrategy, updateGridPositions]
  )

  // Update grid positions when container resizes (streaming mode)
  useEffect(() => {
    if (loadingStrategy === 'streaming' && containerSize.width > 0) {
      updateGridPositions()
    }
  }, [containerSize, loadingStrategy, updateGridPositions])

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
  const { instanceRef } = useEChartsInstance(containerRef, {
    option,
    events: coreEvents,
    onReady: handleReady,
    renderer,
    theme,
    autoResize: true,
  })

  // Keep chart instance ref in sync
  useEffect(() => {
    chartInstanceRef.current = instanceRef.current
  }, [instanceRef])

  // Container styles - fill parent container height
  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      flex: 1,
      minHeight: 0,
      ...style,
    }),
    [style]
  )

  // Determine if each section is loading (streaming mode)
  const isStreaming = loadingStrategy === 'streaming'

  return (
    <div className={`relative ${className ?? ''}`} style={containerStyle}>
      {/* ECharts container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Loader overlays for streaming mode */}
      {isStreaming &&
        sectionIds.map((section) => (
          <SectionLoader
            key={section}
            section={section}
            position={streamingState.gridPositions[section]}
            isLoading={sectionLoadingStates?.[section] ?? false}
          />
        ))}
    </div>
  )
}

export default EfxChartsLayout
