import { Suspense } from 'react'
import { createFileRoute, defer } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  createTypedChart,
  EFX_CHART_TEMPLATES,
  EfxChartsLayout,
  generateTimeSeriesData,
  useStreamingData,
} from '@efxlab/chart-react'
import { EfxLayout, LayoutItem } from '@efxlab/layout-react'

// Simple numeric time series type for the example
type TimeSeriesPoint = [number, number]

interface SectionData {
  data: TimeSeriesPoint[]
  loadTime: number
}

interface StreamingLoaderData {
  header: Promise<SectionData>
  sidebar: Promise<SectionData>
  main: Promise<SectionData>
  footer: Promise<SectionData>
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function generateSectionData(
  section: string,
  delayMs: number,
  length: number
): Promise<SectionData> {
  const start = Date.now()
  console.log(`[SERVER] Starting ${section} loader (${delayMs}ms)...`)
  await delay(delayMs)
  const data = generateTimeSeriesData(length)
  console.log(`[SERVER] ${section} loaded`)
  return { data, loadTime: Date.now() - start }
}

// Server functions for each section
const getHeaderData = createServerFn({ method: 'GET' }).handler(async () =>
  generateSectionData('header', 500, 80)
)

const getSidebarData = createServerFn({ method: 'GET' }).handler(async () =>
  generateSectionData('sidebar', 1200, 40)
)

const getMainData = createServerFn({ method: 'GET' }).handler(async () =>
  generateSectionData('main', 2000, 160)
)

const getFooterData = createServerFn({ method: 'GET' }).handler(async () =>
  generateSectionData('footer', 2800, 30)
)

export const Route = createFileRoute('/')({
  loader: async () => ({
    header: defer(getHeaderData()),
    sidebar: defer(getSidebarData()),
    main: defer(getMainData()),
    footer: defer(getFooterData()),
  }),
  component: StreamingEfxChartsPage,
})

const SECTIONS = ['header', 'sidebar', 'main', 'footer'] as const

type SectionId = (typeof SECTIONS)[number]

function StreamingEfxChartsPage() {
  const loaderData = Route.useLoaderData() as StreamingLoaderData

  return (
    <div style={{ height: '100vh', padding: 16, boxSizing: 'border-box' }}>
      <EfxLayout
        template={{
          areas: '"title" "content" "status"',
          columns: ['1fr'],
          rows: ['auto', '1fr', 'auto'],
          gap: 16,
          padding: 16,
        }}
        fillViewport
      >
        <LayoutItem area="title">
          <h1>TanStack Start + EfxChart Streaming</h1>
          <p style={{ color: '#666', marginTop: 4 }}>
            Server-side data loading via <code>createServerFn</code> and
            <code>defer()</code>, rendered into a multi-section EfxChart
            dashboard.
          </p>
        </LayoutItem>

        <LayoutItem area="content">
          <Suspense fallback={<div>Preparing streaming charts...</div>}>
            <StreamingChartsContent loaderData={loaderData} />
          </Suspense>
        </LayoutItem>

        <LayoutItem area="status">
          <StreamingStatus loaderData={loaderData} />
        </LayoutItem>
      </EfxLayout>
    </div>
  )
}

function StreamingChartsContent({
  loaderData,
}: {
  loaderData: StreamingLoaderData
}) {
  const { chartData, sectionLoadingStates } = useStreamingData<
    SectionData,
    TimeSeriesPoint[]
  >({
    loaderData: loaderData as unknown as Record<string, Promise<SectionData>>,
    sections: SECTIONS,
  })

  const template = EFX_CHART_TEMPLATES.finance
  const EfxChart = createTypedChart(template)

  const handleChartReady = (chart: import('echarts').ECharts) => {
    console.log('TanStack Start streaming EfxChartsLayout ready:', chart)
  }

  return (
    <EfxChartsLayout
      template={template}
      gap={20}
      loadingStrategy="streaming"
      sectionLoadingStates={sectionLoadingStates}
      sidebarPosition="left"
      onChartReady={handleChartReady}
    >
      <EfxChart
        section="header"
        type="line"
        title={{ text: 'Header (Server Stream)' }}
        data={chartData.header}
        xAxis={{ type: 'time' }}
        yAxis={{ splitNumber: 2 }}
      />
      <EfxChart
        section="sidebar"
        type="bar"
        title={{ text: 'Sidebar (Server Bars)' }}
        data={chartData.sidebar}
        xAxis={{ type: 'value' }}
        yAxis={{ type: 'time' }}
      />
      <EfxChart
        section="main"
        type="line"
        title={{ text: 'Main (Server Series)' }}
        data={chartData.main}
        xAxis={{ type: 'time' }}
      />
      <EfxChart
        section="footer"
        type="bar"
        title={{ text: 'Footer (Server Summary)' }}
        data={chartData.footer}
        xAxis={{ type: 'time' }}
        yAxis={{ splitNumber: 2 }}
      />
    </EfxChartsLayout>
  )
}

function StreamingStatus({ loaderData }: { loaderData: StreamingLoaderData }) {
  const { loadTimes, sectionLoadingStates } = useStreamingData<
    SectionData,
    TimeSeriesPoint[]
  >({
    loaderData: loaderData as unknown as Record<string, Promise<SectionData>>,
    sections: SECTIONS,
  })

  return (
    <div style={{ fontSize: 14 }}>
      <strong>Section load status:</strong>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 8,
          marginTop: 8,
        }}
      >
        {SECTIONS.map((section) => (
          <div key={section}>
            <span style={{ fontWeight: 500 }}>{section}: </span>
            {sectionLoadingStates[section] ? (
              <span style={{ color: '#d97706' }}>Loading…</span>
            ) : (
              <span style={{ color: '#16a34a' }}>
                ✓ {loadTimes[section] ?? 0}
                ms
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
