import type { FC } from 'react'
import { Suspense, use, useState } from 'react'
import {
  createTypedChart,
  EFX_CHART_TEMPLATES,
  EfxChartsLayout,
  generateTimeSeriesData,
} from '@efxlab/chart-react'
import { EfxLayout, LayoutItem } from '@efxlab/layout-react'

type TimeSeriesPoint = [number, number]

interface EfxChartsStreamingData {
  header: TimeSeriesPoint[]
  sidebar: TimeSeriesPoint[]
  main: TimeSeriesPoint[]
  footer: TimeSeriesPoint[]
}

function createDeferredChartData(
  delayMs = 1500
): Promise<EfxChartsStreamingData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        header: generateTimeSeriesData(120),
        sidebar: generateTimeSeriesData(40),
        main: generateTimeSeriesData(200),
        footer: generateTimeSeriesData(30),
      })
    }, delayMs)
  })
}

const financeTemplate = EFX_CHART_TEMPLATES.finance
const EfxChart = createTypedChart(financeTemplate)

export const App: FC = () => {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000))
  const [dataPromise, setDataPromise] = useState<
    Promise<EfxChartsStreamingData>
  >(() => createDeferredChartData())

  const handleRandomize = () => {
    setSeed(Math.floor(Math.random() * 100000))
    setDataPromise(createDeferredChartData())
  }

  return (
    <div style={{ height: '100vh', padding: 16, boxSizing: 'border-box' }}>
      <EfxLayout
        template={{
          areas: '"controls" "content"',
          columns: ['1fr'],
          rows: ['auto', '1fr'],
          gap: 12,
          padding: 16,
        }}
        fillViewport
      >
        <LayoutItem area="controls">
          <h1>Advanced EfxChart Streaming</h1>
          <p style={{ color: '#666', marginTop: 4 }}>
            React 19 <code>use()</code> + <code>Suspense</code> streaming a
            multi-section dashboard.
          </p>
          <button
            type="button"
            onClick={handleRandomize}
            style={{
              marginTop: 12,
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #0d6efd',
              background: '#0d6efd',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            🎲 Randomize data (seed: {seed})
          </button>
        </LayoutItem>

        <LayoutItem area="content">
          <Suspense fallback={<div>Streaming chart data...</div>}>
            <ChartsContent dataPromise={dataPromise} />
          </Suspense>
        </LayoutItem>
      </EfxLayout>
    </div>
  )
}

function ChartsContent({
  dataPromise,
}: {
  dataPromise: Promise<EfxChartsStreamingData>
}) {
  const chartData = use(dataPromise)

  const handleChartReady = (chart: import('echarts').ECharts) => {
    console.log('Advanced EfxChartsLayout ready:', chart)
  }

  const handleEvents = {
    click: (params: Record<string, unknown>) => {
      console.log('Advanced chart click:', params)
    },
  }

  return (
    <EfxChartsLayout
      template={financeTemplate}
      sidebarPosition="left"
      gap={20}
      onChartReady={handleChartReady}
      onEvents={handleEvents}
    >
      <EfxChart
        section="header"
        type="line"
        title={{ text: 'Header (Streaming Line)' }}
        data={chartData.header}
        xAxis={{ type: 'time' }}
        yAxis={{ splitNumber: 2 }}
      />
      <EfxChart
        section="sidebar"
        type="bar"
        title={{ text: 'Sidebar (Streaming Bars)' }}
        data={chartData.sidebar}
        xAxis={{ type: 'value' }}
        yAxis={{ type: 'time' }}
      />
      <EfxChart
        section="main"
        type="line"
        title={{ text: 'Main (High-Res Series)' }}
        data={chartData.main}
        xAxis={{ type: 'time' }}
        axisPointer={{ type: 'cross', label: { show: true }, snap: true }}
      />
      <EfxChart
        section="footer"
        type="bar"
        title={{ text: 'Footer (Summary)' }}
        data={chartData.footer}
        xAxis={{ type: 'time' }}
        yAxis={{ splitNumber: 2 }}
      />
    </EfxChartsLayout>
  )
}
