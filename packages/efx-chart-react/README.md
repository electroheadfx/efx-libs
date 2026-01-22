# @efx/chart-react

React components for building ECharts-based multi-chart dashboards with declarative ASCII templates.

## Installation

```bash
npm install @efx/chart-react echarts
# or
pnpm add @efx/chart-react echarts
```

## Peer Dependencies

- `react` ^18.0.0 || ^19.0.0
- `echarts` ^5.0.0 || ^6.0.0

## Quick Start

```tsx
import {
  EfxChartsLayout,
  EfxChart,
  FINANCE_LAYOUT,
  generateTimeSeriesData,
} from '@efx/chart-react'

function Dashboard() {
  return (
    <EfxChartsLayout
      template={FINANCE_LAYOUT}
      sidebarPosition="left"
      gap={20}
      onChartReady={(chart) => console.log('Ready!')}
    >
      <EfxChart
        section="header"
        type="line"
        title="Revenue Trend"
        data={generateTimeSeriesData(30)}
        xAxis={{ type: 'time' }}
      />
      <EfxChart
        section="sidebar"
        type="bar"
        title="Categories"
        data={[
          { name: 'A', value: 100 },
          { name: 'B', value: 200 },
        ]}
        invertAxis
      />
      <EfxChart
        section="main"
        type="line"
        title="Main Chart"
        data={generateTimeSeriesData(90)}
      />
      <EfxChart
        section="footer"
        type="bar"
        title="Summary"
        data={generateTimeSeriesData(12)}
      />
    </EfxChartsLayout>
  )
}
```

## Components

### EfxChartsLayout

Container that renders a single ECharts instance with multiple chart grids.

```tsx
<EfxChartsLayout
  template={FINANCE_LAYOUT}   // ASCII layout template
  sidebarPosition="left"      // 'left' | 'right'
  gap={20}                    // Gap between sections (px)
  gapX={20}                   // Horizontal gap override
  gapY={10}                   // Vertical gap override
  renderer="canvas"           // 'canvas' | 'svg'
  theme="dark"                // ECharts theme name
  onChartReady={(chart) => {}}
  onEvents={{
    click: (params, chart) => {},
    mouseover: (params, chart) => {},
  }}
>
  {/* EfxChart children */}
</EfxChartsLayout>
```

### EfxChart

Declarative chart section configuration (doesn't render anything directly).

```tsx
<EfxChart
  section="main"              // Section ID from template
  type="line"                 // Chart type
  title="My Chart"            // Section title
  data={[...]}                // Chart data
  xAxis={{ type: 'time' }}    // X-axis config
  yAxis={{ type: 'value' }}   // Y-axis config
  series={{ smooth: true }}   // Series options
  padding="50,20"             // Internal padding
  axisPointer={{              // Crosshair config
    type: 'cross',
    snap: true,
  }}
/>
```

### createTypedChart

Factory function for type-safe section autocomplete:

```tsx
import { createTypedChart, FINANCE_LAYOUT } from '@efx/chart-react'

const EfxChart = createTypedChart(FINANCE_LAYOUT)

// Now section prop has autocomplete:
<EfxChart section="header" />  // TS autocomplete: "header" | "sidebar" | "main" | "footer"
```

## Available Templates

```tsx
import {
  FINANCE_LAYOUT,      // header, sidebar, main, footer
  DASHBOARD_LAYOUT,    // header, main, sidebar, footer
  COMPARISON_LAYOUT,   // title, left, right, summary
  GRID_2X2_LAYOUT,     // tl, tr, bl, br (quadrants)
  ANALYTICS_LAYOUT,    // kpi1-4, main, side
  MONITORING_LAYOUT,   // chart1-6 (3x2 grid)
} from '@efx/chart-react'
```

## Streaming Data Support

For progressive data loading with visual feedback:

```tsx
import { useStreamingData, EfxChartsLayout } from '@efx/chart-react'

function StreamingDashboard({ loaderData }) {
  const { chartData, sectionLoadingStates } = useStreamingData({
    loaderData,
    sections: ['header', 'sidebar', 'main', 'footer'],
  })

  return (
    <EfxChartsLayout
      template={FINANCE_LAYOUT}
      loadingStrategy="streaming"
      sectionLoadingStates={sectionLoadingStates}
    >
      <EfxChart section="header" data={chartData.header} />
      <EfxChart section="main" data={chartData.main} />
      {/* ... */}
    </EfxChartsLayout>
  )
}
```

## Core Hooks

### useEChartsInstance

Low-level hook for ECharts lifecycle management:

```tsx
import { useEChartsInstance } from '@efx/chart-react'

const { getEchartsInstance, instanceRef } = useEChartsInstance(containerRef, {
  option: chartOption,
  events: { click: handleClick },
  onReady: (chart) => console.log('Ready'),
  theme: 'dark',
  renderer: 'canvas',
  autoResize: true,
})
```

### useResizeObserver

Observe container size changes:

```tsx
import { useResizeObserver } from '@efx/chart-react'

useResizeObserver(containerRef, {
  onResize: (entry) => console.log(entry.contentRect),
  debounceMs: 100,
})
```

## EChartsRenderer

Standalone ECharts renderer component:

```tsx
import { EChartsRenderer } from '@efx/chart-react'

<EChartsRenderer
  option={chartOption}
  theme="dark"
  style={{ height: 400 }}
  onReady={(chart) => {}}
/>
```

## Data Generators

Utility functions for generating sample data:

```tsx
import {
  generateTimeSeriesData,
  generateCategoryData,
  generateScatterData,
  generatePieData,
  generateCandlestickData,
} from '@efx/chart-react'
```

## Related Packages

- **@efx/chart-core** - Framework-agnostic types and utilities
- **@efx/layout-react** - CSS Grid layout components (works great with EfxChart)

## License

MIT
