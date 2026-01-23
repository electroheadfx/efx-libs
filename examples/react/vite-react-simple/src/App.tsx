import type { FC } from 'react'
import { Suspense } from 'react'
import {
  createTypedChart,
  EFX_CHART_TEMPLATES,
  EfxChartsLayout,
  generateTimeSeriesData,
} from '@efxlab/chart-react'
import { EfxLayout, LayoutItem } from '@efxlab/layout-react'

const financeTemplate = EFX_CHART_TEMPLATES.finance
const EfxChart = createTypedChart(financeTemplate)

const headerData = generateTimeSeriesData(50)
const sidebarData = generateTimeSeriesData(30)
const mainData = generateTimeSeriesData(80)
const footerData = generateTimeSeriesData(20)

export const App: FC = () => {
  return (
    <div style={{ height: '100vh', padding: 16, boxSizing: 'border-box' }}>
      <EfxLayout
        template={{
          areas: '"title" "content"',
          columns: ['1fr'],
          rows: ['auto', '1fr'],
          gap: 12,
          padding: 16,
        }}
        fillViewport
      >
        <LayoutItem area="title">
          <h1>Simple EfxChart + EfxLayout</h1>
          <p style={{ color: '#666', marginTop: 4 }}>
            Basic example showing a multi-section EfxChart dashboard inside an
            EfxLayout container.
          </p>
        </LayoutItem>

        <LayoutItem area="content">
          <Suspense fallback={<div>Loading chart...</div>}>
            <EfxChartsLayout template={financeTemplate} gap={16}>
              <EfxChart
                section="header"
                type="line"
                title={{ text: 'Revenue (Header)' }}
                data={headerData}
                xAxis={{ type: 'time' }}
                yAxis={{ splitNumber: 2 }}
              />

              <EfxChart
                section="sidebar"
                type="bar"
                title={{ text: 'Orders (Sidebar)' }}
                data={sidebarData}
                xAxis={{ type: 'value' }}
                yAxis={{ type: 'time' }}
              />

              <EfxChart
                section="main"
                type="line"
                title={{ text: 'Main Trend' }}
                data={mainData}
                xAxis={{ type: 'time' }}
              />

              <EfxChart
                section="footer"
                type="bar"
                title={{ text: 'Footer Summary' }}
                data={footerData}
                xAxis={{ type: 'time' }}
                yAxis={{ splitNumber: 2 }}
              />
            </EfxChartsLayout>
          </Suspense>
        </LayoutItem>
      </EfxLayout>
    </div>
  )
}
