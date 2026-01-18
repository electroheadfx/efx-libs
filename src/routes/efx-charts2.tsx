/**
 * EfxCharts2 Finance Dashboard - Streaming Version
 *
 * Demonstrates the EfxChart2 component with streaming data loading.
 * Each chart section loads independently with visual feedback.
 */

import { createFileRoute, defer, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, lazy, Suspense } from 'react'
import { Panel, Button, ButtonGroup } from 'rsuite'
import {
  EFX_CHART_TEMPLATES,
  createTypedChart,
  useStreamingData,
} from '../components/EfxChart2'
import { EfxLayout, LayoutItem } from '../components/EfxLayout'
import { ChartLoadingFallback } from '../components/route-states'
import type { TimeSeriesDataPoint } from '../serverActions/efxChartsActions'

// Lazy load EfxChartsLayout for SSR compatibility
const EfxChartsLayout = lazy(
  () => import('../components/EfxChart2/EfxChartsLayout')
)

// ============================================================================
// Types
// ============================================================================

interface SectionData {
  data: TimeSeriesDataPoint[]
  loadTime: number
}

interface StreamingLoaderData {
  header: Promise<SectionData>
  sidebar: Promise<SectionData>
  main: Promise<SectionData>
  footer: Promise<SectionData>
}

// ============================================================================
// Server Functions - Per-section with staggered delays
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function generateSingleSeriesData(
  dayCount: number,
  inverseXY: boolean,
  seed: number
): TimeSeriesDataPoint[] {
  const dayStart = new Date('2025-05-05T00:00:00.000Z')
  const timeStart = dayStart.getTime()
  const sevenDay = 7 * 1000 * 3600 * 24
  const seriesData: TimeSeriesDataPoint[] = []

  let localSeed = seed
  const seededRandom = () => {
    const x = Math.sin(localSeed++) * 10000
    return x - Math.floor(x)
  }

  let lastVal = Math.round(seededRandom() * 300)
  let turnCount: number | null = null
  let sign = -1

  for (let idx = 0; idx < dayCount; idx++) {
    if (turnCount === null || idx >= turnCount) {
      turnCount =
        idx + Math.round((dayCount / 4) * ((seededRandom() - 0.5) * 0.1))
      sign = -sign
    }
    const deltaMag = 50
    const delta = Math.round(
      seededRandom() * deltaMag - deltaMag / 2 + (sign * deltaMag) / 3
    )
    lastVal += delta
    const val = Math.max(0, lastVal)
    const xTime = timeStart + idx * sevenDay
    const date = new Date(xTime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dataXVal = `${year}-${month}-${day}`
    const item: TimeSeriesDataPoint = [dataXVal, val]
    if (inverseXY) {
      item.reverse()
    }
    seriesData.push(item)
  }
  return seriesData
}

async function generateSectionData(
  section: string,
  delayMs: number,
  seed: number,
  dayCount: number,
  inverseXY: boolean
): Promise<SectionData> {
  const start = Date.now()
  console.log(`[SERVER] Starting ${section} loader (${delayMs}ms)...`)
  await delay(delayMs)
  const data = generateSingleSeriesData(dayCount, inverseXY, seed)
  console.log(`[SERVER] ${section} loaded`)
  return { data, loadTime: Date.now() - start }
}

// Per-section server functions with staggered delays
const getHeaderData = createServerFn({ method: 'GET' })
  .inputValidator((d: { seed: number }) => d)
  .handler(async ({ data }) =>
    generateSectionData('header', 500, data.seed, 100, false)
  )

const getSidebarData = createServerFn({ method: 'GET' })
  .inputValidator((d: { seed: number }) => d)
  .handler(async ({ data }) =>
    generateSectionData('sidebar', 1500, data.seed + 100, 10, true)
  )

const getMainData = createServerFn({ method: 'GET' })
  .inputValidator((d: { seed: number }) => d)
  .handler(async ({ data }) =>
    generateSectionData('main', 2500, data.seed + 200, 100, false)
  )

const getFooterData = createServerFn({ method: 'GET' })
  .inputValidator((d: { seed: number }) => d)
  .handler(async ({ data }) =>
    generateSectionData('footer', 3500, data.seed + 300, 10, false)
  )

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute('/efx-charts2')({
  validateSearch: (search: Record<string, unknown>) => ({
    seed: Number(search.seed) || 42,
  }),

  loaderDeps: ({ search }) => ({
    seed: search.seed,
  }),

  loader: async ({ deps }) => ({
    header: defer(getHeaderData({ data: { seed: deps.seed } })),
    sidebar: defer(getSidebarData({ data: { seed: deps.seed } })),
    main: defer(getMainData({ data: { seed: deps.seed } })),
    footer: defer(getFooterData({ data: { seed: deps.seed } })),
  }),

  component: EfxCharts2Demo,
})

// ============================================================================
// Main Component
// ============================================================================

function EfxCharts2Demo() {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <EfxCharts2Content />
    </Suspense>
  )
}

// Section names for streaming
const SECTIONS = ['header', 'sidebar', 'main', 'footer'] as const

function EfxCharts2Content() {
  const loaderData = Route.useLoaderData() as StreamingLoaderData
  const { seed } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>(
    'left'
  )

  // ✨ Use the streaming data hook - handles state, loading, and placeholders
  const { chartData, sectionLoadingStates, reset, loadTimes } =
    useStreamingData<SectionData, TimeSeriesDataPoint[]>({
      loaderData: loaderData as unknown as Record<string, Promise<SectionData>>,
      sections: SECTIONS,
      placeholder: {
        type: 'timeseries',
        count: 50,
        overrides: {
          sidebar: { count: 10 },
          footer: { count: 10 },
        },
      },
      onSectionLoad: (section, data) => {
        console.log(`[CLIENT] ${section} resolved:`, data)
      },
    })

  // Handle randomize - just update URL, loader handles the rest
  const handleRandomize = () => {
    reset()
    navigate({
      search: { seed: Math.floor(Math.random() * 100000) },
    })
  }

  // Create typed EfxChart for FINANCE_LAYOUT
  const efxChartTemplate = EFX_CHART_TEMPLATES.finance
  const EfxChart = createTypedChart(efxChartTemplate)

  return (
    <div
      className="bg-rs-body flex flex-col"
      style={{ height: 'calc(100vh - 70px)' }}
    >
      {/* Control Panel */}
      <Panel
        bordered
        shaded
        className="bg-rs-bg-card m-6 mb-0"
        style={{ flexShrink: 0 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-rs-secondary">
            Streaming EfxCharts - Each section loads independently
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-rs-secondary whitespace-nowrap">
                Sidebar:
              </span>
              <ButtonGroup>
                <Button
                  appearance={
                    sidebarPosition === 'left' ? 'primary' : 'default'
                  }
                  size="sm"
                  onClick={() => setSidebarPosition('left')}
                >
                  Left
                </Button>
                <Button
                  appearance={
                    sidebarPosition === 'right' ? 'primary' : 'default'
                  }
                  size="sm"
                  onClick={() => setSidebarPosition('right')}
                >
                  Right
                </Button>
              </ButtonGroup>
            </div>
            <Button appearance="primary" onClick={handleRandomize}>
              🎲 Randomize (seed: {seed})
            </Button>
          </div>
        </div>
      </Panel>

      {/* EfxLayout with Title + Chart Content */}
      <EfxLayout
        className="border rounded-lg m-6 h-full"
        template={{
          areas: `"title" "content"`,
          columns: ['1fr'],
          rows: ['auto', '1fr'],
          gap: 10,
          padding: 24,
        }}
      >
        {/* Title */}
        <LayoutItem area="title">
          <h2>Streaming Finances Efx Charts v2</h2>
        </LayoutItem>

        {/* Chart Content Area */}
        <LayoutItem area="content">
          <EfxChartsLayout
            template={efxChartTemplate}
            sidebarPosition={sidebarPosition}
            gap={20}
            loadingStrategy="streaming"
            sectionLoadingStates={sectionLoadingStates}
          >
            <EfxChart
              section="header"
              type="line"
              title={{
                text: 'Header Section',
                textStyle: { fontSize: 14 },
              }}
              data={chartData.header}
              xAxis={{ type: 'time' }}
              yAxis={{ splitNumber: 2 }}
              axisPointer={{
                type: 'cross',
                label: { show: true },
                snap: true,
              }}
              series={{ symbol: 'none' }}
              padding="0,0,0,0"
            />
            <EfxChart
              section="sidebar"
              type="bar"
              title={{
                text: 'Sidebar Section',
                textStyle: { fontSize: 14 },
              }}
              data={chartData.sidebar}
              xAxis={{ type: 'value' }}
              yAxis={{ type: 'time' }}
            />
            <EfxChart
              section="main"
              type="line"
              title={{
                text: 'Main Content Area',
                textStyle: { fontSize: 14 },
              }}
              data={chartData.main}
              xAxis={{ type: 'time' }}
              axisPointer={{
                type: 'cross',
                label: { show: true },
                snap: true,
              }}
              series={{ symbol: 'none' }}
            />
            <EfxChart
              section="footer"
              type="bar"
              title={{
                text: 'Footer Section',
                textStyle: { fontSize: 14 },
              }}
              data={chartData.footer}
              xAxis={{ type: 'time' }}
              yAxis={{ splitNumber: 2 }}
            />
          </EfxChartsLayout>
        </LayoutItem>
      </EfxLayout>

      {/* Debug: Show load times */}
      <Panel bordered shaded className="bg-rs-bg-card mx-6 mb-6">
        <h3 className="font-semibold mb-2">Load Status</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {SECTIONS.map((section) => (
            <div key={section}>
              <span className="font-medium">{section}: </span>
              {loadTimes[section] !== undefined ? (
                <span className="text-green-500">✓ {loadTimes[section]}ms</span>
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

export default EfxCharts2Demo
