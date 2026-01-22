/**
 * Streaming ECharts Test Page - Hybrid Approach
 *
 * Tests per-section loading with:
 * 1. Series opacity dimming (placeholder data while loading)
 * 2. RSuite Loader overlay positioned over each grid section
 *
 * Expected behavior:
 * - All 4 chart sections appear immediately with dimmed placeholder data + spinner
 * - Header loads at 500ms, sidebar at 1000ms, main at 1500ms, footer at 2000ms
 * - As each section loads, spinner disappears and chart brightens with real data
 */

import { createFileRoute, defer } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { ECharts, EChartsCoreOption } from 'echarts'
import * as echarts from 'echarts'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader, Panel } from 'rsuite'

// ============================================================================
// Types
// ============================================================================

interface SectionData {
  section: string
  data: [number, number][]
  loadTime: number
}

interface GridPosition {
  left: number
  top: number
  width: number
  height: number
}

// ============================================================================
// Server Functions
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function generateChartData(count: number, seed: number): [number, number][] {
  const data: [number, number][] = []
  let value = 100
  for (let i = 0; i < count; i++) {
    // Simple seeded random
    const random = Math.sin(seed + i) * 10000
    value += (random - Math.floor(random) - 0.5) * 20
    data.push([i, Math.round(value)])
  }
  return data
}

async function generateSectionData(
  section: string,
  delayMs: number,
  seed: number
): Promise<SectionData> {
  const start = Date.now()
  console.log(`[SERVER] Starting ${section} loader (${delayMs}ms)...`)
  await delay(delayMs)
  const data = generateChartData(50, seed)
  console.log(`[SERVER] ${section} loaded`)
  return { section, data, loadTime: Date.now() - start }
}

const getHeaderData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('header', 500, 1)
)
const getSidebarData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('sidebar', 2000, 2)
)
const getMainData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('main', 3500, 3)
)
const getFooterData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('footer', 4000, 4)
)

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute('/lab/streaming-data-echarts')({
  loader: async () => ({
    header: defer(getHeaderData()),
    sidebar: defer(getSidebarData()),
    main: defer(getMainData()),
    footer: defer(getFooterData()),
  }),
  component: StreamingEChartsDemo,
})

// ============================================================================
// Placeholder data for loading state
// ============================================================================

const placeholderData: [number, number][] = Array.from(
  { length: 50 },
  (_, i) => [i, 100]
)

// Type for loader data (workaround until route types are generated)
interface StreamingLoaderData {
  header: Promise<SectionData>
  sidebar: Promise<SectionData>
  main: Promise<SectionData>
  footer: Promise<SectionData>
}

// ============================================================================
// Main Component
// ============================================================================

function StreamingEChartsDemo() {
  const loaderData = Route.useLoaderData() as StreamingLoaderData
  const chartRef = useRef<ECharts | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track resolved data and loading states
  const [sectionData, setSectionData] = useState<Record<string, SectionData>>(
    {}
  )
  const [gridPositions, setGridPositions] = useState<
    Record<string, GridPosition>
  >({})

  // Listen to each deferred promise independently using .then()
  // This bypasses Suspense and allows true streaming
  useEffect(() => {
    const sections = ['header', 'sidebar', 'main', 'footer'] as const
    console.log('effects')
    sections.forEach((section) => {
      loaderData[section].then((data) => {
        console.log(`[CLIENT] ${section} resolved:`, data)
        setSectionData((prev) => ({ ...prev, [section]: data }))
      })
    })
  }, [loaderData])

  // Update grid positions - extracted to avoid recreating on every render
  const updateGridPositions = useCallback(() => {
    const chart = chartRef.current
    if (!chart) return

    const positions: Record<string, GridPosition> = {}
    const gridIds = ['header', 'sidebar', 'main', 'footer']

    gridIds.forEach((id, index) => {
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

    setGridPositions(positions)
  }, [])

  // Memoize ECharts option to prevent unnecessary re-renders on resize
  const option = useMemo(() => buildChartOption(sectionData), [sectionData])

  // Initialize ECharts directly (like EfxChartsLayout does - much faster resize!)
  useEffect(() => {
    if (!containerRef.current) return

    // Initialize chart
    const chart = echarts.init(containerRef.current, undefined, {
      renderer: 'canvas',
    })
    chartRef.current = chart
    chart.setOption(option)

    // Update grid positions after initial render
    setTimeout(updateGridPositions, 50)

    // ResizeObserver for fast resize (no debounce needed for chart.resize)
    const resizeObserver = new ResizeObserver(() => {
      if (chart && !chart.isDisposed()) {
        chart.resize()
        // Debounce grid position updates (for loader overlays)
        updateGridPositions()
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      if (chart && !chart.isDisposed()) {
        chart.dispose()
      }
    }
  }, [updateGridPositions, option]) // Only run once on mount

  // Update option when data changes (separate effect for updates)
  useEffect(() => {
    if (chartRef.current && !chartRef.current.isDisposed()) {
      chartRef.current.setOption(option, { notMerge: false })
      // Update grid positions after data changes
      setTimeout(updateGridPositions, 50)
    }
  }, [option, updateGridPositions])

  return (
    <div className="bg-rs-body p-6" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <Panel bordered shaded className="bg-rs-bg-card mb-6">
        <h1 className="text-xl font-bold mb-2">
          Streaming ECharts Test - Hybrid Approach
        </h1>
        <p className="text-rs-secondary">
          4 chart sections load independently. Watch spinners disappear as each
          section loads!
        </p>
      </Panel>

      {/* Chart container with overlay spinners */}
      <div
        className="relative bg-rs-bg-card rounded-lg p-4"
        style={{ height: 600 }}
      >
        {/* Direct ECharts container - no wrapper library */}
        <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

        {/* Overlay spinners for each section */}
        {(['header', 'sidebar', 'main', 'footer'] as const).map((section) => (
          <SectionLoader
            key={section}
            section={section}
            position={gridPositions[section]}
            isLoading={!sectionData[section]}
          />
        ))}
      </div>

      {/* Debug: Show load times */}
      <Panel bordered shaded className="bg-rs-bg-card mt-6">
        <h3 className="font-semibold mb-2">Load Status</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {(['header', 'sidebar', 'main', 'footer'] as const).map((section) => (
            <div key={section}>
              <span className="font-medium">{section}: </span>
              {sectionData[section] ? (
                <span className="text-green-500">
                  ✓ {sectionData[section].loadTime}ms
                </span>
              ) : (
                <span className="text-yellow-500">Loading...</span>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ============================================================================
// Helper Components
// ============================================================================

/** Positioned loader overlay for a grid section - minimal, just spinner */
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
// ECharts Option Builder
// ============================================================================

function buildChartOption(
  sectionData: Record<string, SectionData>
): EChartsCoreOption {
  const sections = ['header', 'sidebar', 'main', 'footer'] as const
  const loadingOpacity = 0.15
  const loadedOpacity = 1

  // Grid layout: 2x2 matrix
  const grids = [
    { id: 'header', left: '5%', right: '55%', top: '5%', bottom: '55%' },
    { id: 'sidebar', left: '55%', right: '5%', top: '5%', bottom: '55%' },
    { id: 'main', left: '5%', right: '55%', top: '55%', bottom: '5%' },
    { id: 'footer', left: '55%', right: '5%', top: '55%', bottom: '5%' },
  ]

  // Create xAxis/yAxis for each grid with loading transparency
  const xAxes = sections.map((section, i) => {
    const isLoading = !sectionData[section]
    const opacity = isLoading ? loadingOpacity : loadedOpacity
    return {
      type: 'value' as const,
      gridIndex: i,
      splitLine: { show: false },
      axisLine: { lineStyle: { opacity } },
      axisTick: { lineStyle: { opacity } },
      axisLabel: { opacity },
    }
  })

  const yAxes = sections.map((section, i) => {
    const isLoading = !sectionData[section]
    const opacity = isLoading ? loadingOpacity : loadedOpacity
    return {
      type: 'value' as const,
      gridIndex: i,
      splitLine: {
        lineStyle: { type: 'dashed' as const, opacity },
      },
      axisLine: { lineStyle: { opacity } },
      axisTick: { lineStyle: { opacity } },
      axisLabel: { opacity },
    }
  })

  // Create series with loading state handling
  const series = sections.map((section, i) => {
    const resolved = sectionData[section]
    const isLoading = !resolved
    const data = resolved?.data ?? placeholderData

    return {
      name: section,
      type: 'line' as const,
      xAxisIndex: i,
      yAxisIndex: i,
      data,
      smooth: true,
      symbol: 'none',
      // Visual loading state - transparent when loading
      lineStyle: {
        width: 2,
        type: 'solid' as const,
        opacity: isLoading ? loadingOpacity : loadedOpacity,
      },
      areaStyle: {
        opacity: isLoading ? 0.05 : 0.3,
      },
      animationDuration: 500,
    }
  })

  // Title for each section
  const titles = sections.map((section, i) => {
    const resolved = sectionData[section]
    const isLoading = !resolved
    const row = Math.floor(i / 2)
    const col = i % 2

    return {
      text: `${section.charAt(0).toUpperCase() + section.slice(1)}${
        isLoading ? ' (loading...)' : ''
      }`,
      left: col === 0 ? '5%' : '55%',
      top: row === 0 ? '2%' : '52%',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal' as const,
        opacity: isLoading ? 0.3 : 1,
      },
    }
  })

  return {
    title: titles,
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    animation: true,
  }
}
