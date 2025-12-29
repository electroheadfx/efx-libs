/**
 * EfxCharts Finance Dashboard
 *
 * Demonstrates the EfxCharts component with the finance layout
 * matching the finance.js reference implementation.
 * Uses deferred server-side data loading with streaming via TanStack Router.
 * Seed is driven by URL search params for shareability.
 */

import {
  createFileRoute,
  defer,
  Await,
  useNavigate,
} from '@tanstack/react-router'
import { useState, Suspense } from 'react'
import { Panel, Button, ButtonGroup, Loader } from 'rsuite'
import {
  EfxChartsLayout,
  EfxChart,
  EFX_CHART_TEMPLATES,
} from '../components/EfxChart'
import { EfxLayout, LayoutItem } from '../components/EfxLayout'
import { getEfxChartsData } from '../serverActions/efxChartsActions'

export const Route = createFileRoute('/efx-charts')({
  // Validate and parse search params with defaults
  validateSearch: (search: Record<string, unknown>) => ({
    seed: Number(search.seed) || 42,
  }),

  // Loader re-runs automatically when these deps change
  loaderDeps: ({ search }) => ({
    seed: search.seed,
  }),

  // Deferred data loading with seed from search params
  loader: async ({ deps }) => {
    return {
      dataPromise: defer(getEfxChartsData({ data: { seed: deps.seed } })),
    }
  },

  component: EfxChartsDemo,
})

/**
 * Finance Dashboard Demo
 */
function EfxChartsDemo() {
  // Get deferred data promise from loader
  const { dataPromise } = Route.useLoaderData()
  const { seed } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>(
    'left'
  )

  const efxChartTemplate = EFX_CHART_TEMPLATES.finance

  // Handle randomize - just update URL, loader handles the rest
  const handleRandomize = () => {
    navigate({
      search: { seed: Math.floor(Math.random() * 100000) },
    })
  }

  const handleChartReady = (chart: import('echarts').ECharts) => {
    console.log('EfxChartsLayout ready:', chart)
  }

  const handleEvents = {
    click: (params: Record<string, unknown>) => {
      console.log('Chart clicked:', params)
    },
  }

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
            Matrix-based ECharts layout with responsive design
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
          <h2>Finances Efx Charts</h2>
        </LayoutItem>

        {/* Chart Content Area - with Suspense for deferred data */}
        <LayoutItem area="content">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader size="lg" content="Loading charts..." vertical />
              </div>
            }
          >
            <Await promise={dataPromise}>
              {(data) => (
                <EfxChartsLayout
                  template={efxChartTemplate}
                  sidebarPosition={sidebarPosition}
                  gap={20}
                  onChartReady={handleChartReady}
                  onEvents={handleEvents}
                >
                  {/* Header Section */}
                  <EfxChart
                    id="section_header_1"
                    type="line"
                    title={{
                      text: 'Header Section',
                      textStyle: { fontSize: 14 },
                    }}
                    data={data.header}
                    xAxis={{ type: 'time' }}
                    series={{ symbol: 'none' }}
                    padding="0,0,0,0"
                  />

                  {/* Sidebar Section */}
                  <EfxChart
                    id="section_sidebar_1"
                    type="bar"
                    title={{
                      text: 'Sidebar Section',
                      textStyle: { fontSize: 14 },
                    }}
                    data={data.sidebar}
                    xAxis={{
                      type: 'value',
                      axisLabel: { hideOverlap: true },
                    }}
                    yAxis={{
                      type: 'time',
                      axisLabel: { hideOverlap: true },
                    }}
                  />

                  {/* Main Content Area */}
                  <EfxChart
                    id="section_main_content_area_1"
                    type="line"
                    title={{
                      text: 'Main Content Area',
                      textStyle: { fontSize: 14 },
                    }}
                    data={data.main}
                    xAxis={{ type: 'time' }}
                    series={{ symbol: 'none' }}
                  />

                  {/* Footer Section */}
                  <EfxChart
                    id="section_footer_1"
                    type="bar"
                    title={{
                      text: 'Footer Section',
                      textStyle: { fontSize: 14 },
                    }}
                    data={data.footer}
                    xAxis={{ type: 'time' }}
                    yAxis={{ splitNumber: 2 }}
                  />
                </EfxChartsLayout>
              )}
            </Await>
          </Suspense>
        </LayoutItem>
      </EfxLayout>
    </div>
  )
}

export default EfxChartsDemo
