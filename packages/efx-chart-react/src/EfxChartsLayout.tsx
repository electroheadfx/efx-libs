/**
 * EfxChartsLayout Component (Streaming Version)
 *
 * The main layout component that renders a single ECharts instance
 * with matrix-based grid positioning from ASCII templates.
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
import type { EfxChartSectionConfig, EfxLayoutTemplate } from '@efxlab/chart-core'
import {
  buildEChartsOption,
  buildMediaDefinitions,
  type ContainerSize,
  type GapConfig,
  mirrorLayoutHorizontally,
  parseLayoutTemplate,
} from '@efxlab/chart-core'
import { type EChartsType, useEChartsInstance } from './core'
import { useResizeObserver } from './core/useResizeObserver'
import { EfxChart } from './EfxChart'
import type { EfxChartProps, EfxChartsLayoutProps } from './types'

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
 * Simple loader component (no rsuite dependency)
 */
function SimpleLoader({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizeMap = { xs: 16, sm: 20, md: 24, lg: 32 }
  const pixels = sizeMap[size]

  return (
    <div
      style={{
        width: pixels,
        height: pixels,
        border: '2px solid #e0e0e0',
        borderTopColor: '#3498db',
        borderRadius: '50%',
        animation: 'efx-spin 0.8s linear infinite',
      }}
    />
  )
}

/**
 * Section loader overlay
 */
function SectionLoader({
  position,
  isLoading,
  spinnerSize = 'md',
}: {
  section: string
  position?: GridPosition
  isLoading: boolean
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  if (!isLoading || !position) return null

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        left: position.left,
        top: position.top,
        width: position.width,
        height: position.height,
      }}
    >
      <SimpleLoader size={spinnerSize} />
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * EfxChartsLayout - Matrix-based ECharts dashboard layout
 *
 * Renders a single ECharts canvas with multiple chart grids positioned
 * according to an ASCII template.
 */
export function EfxChartsLayout<
  TTemplate extends EfxLayoutTemplate = EfxLayoutTemplate,
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
  loadingStrategy = 'simple',
  sectionLoadingStates,
  spinnerSize = 'md',
}: EfxChartsLayoutProps<TTemplate>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<EChartsType | null>(null)

  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0,
  })

  const [streamingState, setStreamingState] = useState<StreamingState>({
    loadedSections: new Set(),
    gridPositions: {},
  })

  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect
    setContainerSize({ width, height })
  }, [])

  useResizeObserver(containerRef, {
    onResize: handleResize,
    debounceMs: 50,
    enabled: true,
  })

  const gapConfig: GapConfig = useMemo(
    () => ({
      x: gapX ?? gap,
      y: gapY ?? gap,
    }),
    [gap, gapX, gapY]
  )

  const parsedLayouts = useMemo(() => parseLayoutTemplate(template), [template])

  const { mobileLayout, desktopLayout } = useMemo(() => {
    let mobile = parsedLayouts.mobile
    let desktop = parsedLayouts.desktop

    if (sidebarPosition === 'right') {
      mobile = mirrorLayoutHorizontally(mobile)
      desktop = mirrorLayoutHorizontally(desktop)
    }

    return { mobileLayout: mobile, desktopLayout: desktop }
  }, [parsedLayouts, sidebarPosition])

  const chartSections = useMemo(() => extractChartProps(children), [children])

  const sectionIds = useMemo(
    () => template.sections as readonly string[],
    [template]
  )

  // Convert React props to core config
  const coreChartSections: EfxChartSectionConfig[] = useMemo(
    () =>
      chartSections.map((props) => ({
        section: props.section,
        title: props.title,
        type: props.type,
        data: props.data,
        xAxis: props.xAxis,
        yAxis: props.yAxis,
        invertAxis: props.invertAxis,
        series: props.series,
        padding: props.padding,
        backgroundColor: props.backgroundColor,
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
        shadowBlur: props.shadowBlur,
        shadowColor: props.shadowColor,
        shadowOffsetX: props.shadowOffsetX,
        shadowOffsetY: props.shadowOffsetY,
        emphasis: props.emphasis,
        axisPointer: props.axisPointer,
        tooltip: props.tooltip,
        animation: props.animation,
        animationType: props.animationType,
        animationDuration: props.animationDuration,
        animationEasing: props.animationEasing,
        echartsOption: props.echartsOption,
      })),
    [chartSections]
  )

  const option = useMemo(() => {
    const baseOption = buildEChartsOption(
      coreChartSections,
      desktopLayout.sectionCoordMap,
      desktopLayout.columns,
      desktopLayout.rows,
      gapConfig,
      containerSize,
      loadingStrategy === 'streaming' ? sectionLoadingStates : undefined
    )

    const mobileMaxWidth = breakpoints?.mobile?.maxWidth ?? 500
    const media = buildMediaDefinitions(
      mobileLayout,
      desktopLayout,
      coreChartSections,
      mobileMaxWidth,
      gapConfig,
      containerSize
    )

    return {
      ...baseOption,
      media,
    } as import('./core').EChartsCoreOption
  }, [
    coreChartSections,
    desktopLayout,
    mobileLayout,
    breakpoints,
    gapConfig,
    containerSize,
    loadingStrategy,
    sectionLoadingStates,
  ])

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

  const handleReady = useCallback(
    (chart: EChartsType) => {
      chartInstanceRef.current = chart
      onChartReady?.(chart as unknown as import('echarts').ECharts)

      if (loadingStrategy === 'streaming') {
        setTimeout(updateGridPositions, 50)
      }
    },
    [onChartReady, loadingStrategy, updateGridPositions]
  )

  useEffect(() => {
    if (loadingStrategy === 'streaming' && containerSize.width > 0) {
      updateGridPositions()
    }
  }, [containerSize, loadingStrategy, updateGridPositions])

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

  const { instanceRef } = useEChartsInstance(containerRef, {
    option,
    events: coreEvents,
    onReady: handleReady,
    renderer,
    theme,
    autoResize: true,
  })

  useEffect(() => {
    chartInstanceRef.current = instanceRef.current
  }, [instanceRef])

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

  const isStreaming = loadingStrategy === 'streaming'

  return (
    <>
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes efx-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className={className}
        style={{ position: 'relative', ...containerStyle }}
      >
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
              spinnerSize={spinnerSize}
            />
          ))}
      </div>
    </>
  )
}

export default EfxChartsLayout
