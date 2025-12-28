/**
 * EfxCharts Finance Dashboard
 *
 * Demonstrates the EfxCharts component with the finance layout
 * matching the finance.js reference implementation.
 */

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Panel, Button, ButtonGroup } from 'rsuite'
import {
  EfxChartsLayout,
  EfxChart,
  EFX_CHART_TEMPLATES,
} from '../components/EfxChart'
import { EfxLayout, LayoutItem } from '../components/EfxLayout'

export const Route = createFileRoute('/efx-charts')({
  component: EfxChartsDemo,
})

/**
 * Finance Dashboard Demo
 */
function EfxChartsDemo() {
  const [seed, setSeed] = useState(42)
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>(
    'left'
  )

  const efxChartTemplate = EFX_CHART_TEMPLATES.finance

  // Generate finance data based on seed
  const data = useMemo(
    () => ({
      header: generateSingleSeriesData(100, false, seed),
      sidebar: generateSingleSeriesData(10, true, seed + 100),
      main: generateSingleSeriesData(100, false, seed + 200),
      footer: generateSingleSeriesData(10, false, seed + 300),
    }),
    [seed]
  )

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
            <Button
              appearance="primary"
              onClick={() => setSeed(Math.floor(Math.random() * 100000))}
            >
              🎲 Randomize
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

        {/* Chart Content Area */}
        <LayoutItem area="content">
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
              title={{ text: 'Header Section', textStyle: { fontSize: 14 } }}
              data={data.header}
              xAxis={{ type: 'time' }}
              series={{ symbol: 'none' }}
              padding="0,0,0,0"
            />

            {/* Sidebar Section */}
            <EfxChart
              id="section_sidebar_1"
              type="bar"
              title={{ text: 'Sidebar Section', textStyle: { fontSize: 14 } }}
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
              title={{ text: 'Footer Section', textStyle: { fontSize: 14 } }}
              data={data.footer}
              xAxis={{ type: 'time' }}
              yAxis={{ splitNumber: 2 }}
            />
          </EfxChartsLayout>
        </LayoutItem>
      </EfxLayout>
    </div>
  )
}

/**
 * Generate time-based series data matching finance.js generateSingleSeriesData
 */
function generateSingleSeriesData(
  dayCount: number,
  inverseXY: boolean,
  seed: number
): Array<[string | number, string | number]> {
  const dayStart = new Date('2025-05-05T00:00:00.000Z')
  const timeStart = dayStart.getTime()
  const sevenDay = 7 * 1000 * 3600 * 24
  const seriesData: Array<[string | number, string | number]> = []

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
    const val = Math.max(0, (lastVal += delta))
    const xTime = timeStart + idx * sevenDay
    const year = new Date(xTime).getFullYear()
    const month = String(new Date(xTime).getMonth() + 1).padStart(2, '0')
    const day = String(new Date(xTime).getDate()).padStart(2, '0')
    const dataXVal = `${year}-${month}-${day}`
    const item: [string | number, string | number] = [dataXVal, val]
    if (inverseXY) {
      item.reverse()
    }
    seriesData.push(item)
  }
  return seriesData
}

export default EfxChartsDemo
