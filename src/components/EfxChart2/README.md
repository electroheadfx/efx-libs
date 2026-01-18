# EfxChart2 - Streaming Multi-Chart Dashboard

A React component library for creating complex multi-chart dashboards with **streaming data support**. Uses ASCII templates for layout definition and ECharts matrix coordinates for rendering.

## Features

- 📊 **Multi-chart layouts** - Define complex dashboard grids using ASCII templates
- 🚀 **Streaming data** - Each chart section loads independently with visual feedback
- 📱 **Responsive** - Mobile and desktop layouts with automatic switching
- 🎨 **Loading states** - Dimmed placeholders with spinner overlays during loading
- 🔧 **Type-safe** - Full TypeScript support with section name autocomplete

## Quick Start

### Basic Usage (No Streaming)

```tsx
import { lazy, Suspense } from 'react'
import { EFX_CHART_TEMPLATES, createTypedChart } from '@/components/EfxChart2'

const EfxChartsLayout = lazy(() => import('@/components/EfxChart2/EfxChartsLayout'))

function Dashboard() {
  const template = EFX_CHART_TEMPLATES.finance
  const EfxChart = createTypedChart(template)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EfxChartsLayout template={template} sidebarPosition="left" gap={20}>
        <EfxChart
          section="header"
          type="line"
          title={{ text: 'Revenue Trend' }}
          data={revenueData}
          xAxis={{ type: 'time' }}
        />
        <EfxChart
          section="sidebar"
          type="bar"
          title={{ text: 'Categories' }}
          data={categoryData}
          xAxis={{ type: 'value' }}
          yAxis={{ type: 'category' }}
        />
        <EfxChart
          section="main"
          type="line"
          title={{ text: 'Main Chart' }}
          data={mainData}
          xAxis={{ type: 'time' }}
        />
        <EfxChart
          section="footer"
          type="bar"
          title={{ text: 'Summary' }}
          data={summaryData}
        />
      </EfxChartsLayout>
    </Suspense>
  )
}
```

### Streaming Usage with `useStreamingData` Hook (Recommended)

The `useStreamingData` hook simplifies streaming data management by handling state, loading states, and placeholder generation automatically:

```tsx
import { createFileRoute, defer } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { lazy, Suspense } from 'react'
import {
  EFX_CHART_TEMPLATES,
  createTypedChart,
  useStreamingData,
} from '@/components/EfxChart2'

const EfxChartsLayout = lazy(() => import('@/components/EfxChart2/EfxChartsLayout'))

// 1. Define per-section server functions
const getHeaderData = createServerFn({ method: 'GET' })
  .handler(async () => {
    await delay(500)
    return { data: fetchHeaderData(), loadTime: 500 }
  })

// 2. Route loader uses defer() for each section
export const Route = createFileRoute('/dashboard')({
  loader: async () => ({
    header: defer(getHeaderData()),
    sidebar: defer(getSidebarData()),
    main: defer(getMainData()),
    footer: defer(getFooterData()),
  }),
  component: StreamingDashboard,
})

// Section names constant
const SECTIONS = ['header', 'sidebar', 'main', 'footer'] as const

// 3. Component uses useStreamingData hook
function StreamingDashboard() {
  const loaderData = Route.useLoaderData()

  // ✨ One hook handles everything!
  const { chartData, sectionLoadingStates, reset, loadTimes, allLoaded } =
    useStreamingData({
      loaderData,
      sections: SECTIONS,
      placeholder: {
        type: 'timeseries',  // 'timeseries' | 'category' | 'numeric'
        count: 50,           // Default data points
        overrides: {
          sidebar: { count: 10 },  // Smaller placeholder for sidebar
          footer: { count: 10 },
        },
      },
      onSectionLoad: (section, data) => {
        console.log(`${section} loaded in ${data.loadTime}ms`)
      },
    })

  const template = EFX_CHART_TEMPLATES.finance
  const EfxChart = createTypedChart(template)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EfxChartsLayout
        template={template}
        loadingStrategy="streaming"
        sectionLoadingStates={sectionLoadingStates}
        gap={20}
      >
        <EfxChart section="header" type="line" data={chartData.header} />
        <EfxChart section="sidebar" type="bar" data={chartData.sidebar} />
        <EfxChart section="main" type="line" data={chartData.main} />
        <EfxChart section="footer" type="bar" data={chartData.footer} />
      </EfxChartsLayout>
    </Suspense>
  )
}
```

### Before/After Comparison

| Before (Manual) | After (with Hook) |
|-----------------|-------------------|
| ~25 lines of boilerplate | ~15 lines with hook |
| Manual `useState` for section data | Auto-managed state |
| Manual `useEffect` for promise handling | Auto-handled promises |
| Manual loading state calculation | Auto-computed `sectionLoadingStates` |
| Manual placeholder data definition | Auto-generated placeholders |
| No reset function | Built-in `reset()` method |
| No load time tracking | Auto-extracted `loadTimes` |

### Streaming Usage (Manual - Legacy)

For manual control without the hook:

```tsx
import { createFileRoute, defer } from '@tanstack/react-router'
import { useState, useEffect, lazy, Suspense } from 'react'
import { EFX_CHART_TEMPLATES, createTypedChart } from '@/components/EfxChart2'

const EfxChartsLayout = lazy(() => import('@/components/EfxChart2/EfxChartsLayout'))

function StreamingDashboard() {
  const loaderData = Route.useLoaderData()
  const [sectionData, setSectionData] = useState({})

  // Listen to each deferred promise independently
  useEffect(() => {
    const sections = ['header', 'sidebar', 'main', 'footer']
    sections.forEach((section) => {
      loaderData[section].then((data) => {
        setSectionData((prev) => ({ ...prev, [section]: data }))
      })
    })
  }, [loaderData])

  // Calculate loading states
  const sectionLoadingStates = {
    header: !sectionData.header,
    sidebar: !sectionData.sidebar,
    main: !sectionData.main,
    footer: !sectionData.footer,
  }

  // ... render with manual placeholder handling
}
```

## Available Templates

| Template | Sections | Description |
|----------|----------|-------------|
| `finance` | header, sidebar, main, footer | Finance dashboard with sidebar |
| `dashboard` | header, main, sidebar, footer | Standard dashboard layout |
| `comparison` | title, left, right, summary | Side-by-side comparison |
| `grid2x2` | tl, tr, bl, br | Four equal quadrants |
| `analytics` | kpi1-4, main, side | KPI row with main content |
| `monitoring` | chart1-6 | 3x2 monitoring grid |

## API Reference

### EfxChartsLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `template` | `EfxLayoutTemplate` | required | Layout template defining sections |
| `children` | `ReactNode` | required | EfxChart components |
| `sidebarPosition` | `'left' \| 'right'` | `'left'` | Sidebar position (for applicable templates) |
| `gap` | `number` | `0` | Gap between chart sections in pixels |
| `loadingStrategy` | `'simple' \| 'streaming'` | `'simple'` | Enable streaming mode |
| `sectionLoadingStates` | `Record<string, boolean>` | - | Loading state per section |
| `onChartReady` | `(chart: ECharts) => void` | - | Callback when chart is ready |
| `onEvents` | `Record<string, EventHandler>` | - | ECharts event handlers |
| `theme` | `string` | - | ECharts theme name |
| `renderer` | `'canvas' \| 'svg'` | `'canvas'` | Render mode |
| `style` | `CSSProperties` | - | Container style |
| `className` | `string` | - | Container class |

### EfxChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `section` | `string` | required | Section ID from template |
| `type` | `'line' \| 'bar' \| 'scatter' \| 'pie' \| 'candlestick'` | - | Chart type |
| `title` | `EfxTitleOption` | - | Chart title configuration |
| `data` | `[string\|number, number][]` | - | Chart data |
| `xAxis` | `EfxAxisOption` | - | X-axis configuration |
| `yAxis` | `EfxAxisOption` | - | Y-axis configuration |
| `series` | `EfxSeriesOption` | - | Series configuration |
| `padding` | `string \| number \| object` | - | Inner padding (e.g., `"50,20"`) |
| `axisPointer` | `object` | - | Axis pointer (crosshair) config |

### useStreamingData Hook

Simplifies streaming data management for EfxChart2 components.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `loaderData` | `Record<string, Promise<T>>` | required | Deferred promises from TanStack Router loader |
| `sections` | `readonly string[]` | required | Section names to track |
| `placeholder` | `PlaceholderOptions` | - | Auto-generate placeholder configuration |
| `placeholder.type` | `'timeseries' \| 'category' \| 'numeric'` | `'timeseries'` | Placeholder data type |
| `placeholder.count` | `number` | `50` | Number of placeholder data points |
| `placeholder.overrides` | `Record<string, PlaceholderConfig>` | - | Per-section overrides |
| `customPlaceholders` | `Record<string, unknown>` | - | Custom placeholder data per section |
| `onSectionLoad` | `(section: string, data: T) => void` | - | Callback when a section loads |

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `sectionData` | `Record<string, T \| undefined>` | Raw resolved data per section |
| `sectionLoadingStates` | `Record<string, boolean>` | Loading state per section (`true` = loading) |
| `chartData` | `Record<string, TData>` | Data with placeholders applied (safe to render) |
| `reset` | `() => void` | Reset all section data (call on navigation) |
| `allLoaded` | `boolean` | `true` if all sections have loaded |
| `loadTimes` | `Record<string, number \| undefined>` | Load time per section (if data includes `loadTime`) |

#### Placeholder Types

| Type | Format | Example |
|------|--------|---------|
| `timeseries` | `['YYYY-MM-DD', value]` | `['2025-01-15', 100]` |
| `category` | `['Category N', value]` | `['Category 1', 100]` |
| `numeric` | `[index, value]` | `[0, 100]` |

## Creating Custom Templates

Define your own ASCII template:

```tsx
import type { EfxLayoutTemplate } from '@/components/EfxChart2'

const MY_TEMPLATE: EfxLayoutTemplate = {
  name: 'custom',
  sections: ['top', 'left', 'right', 'bottom'],
  mobile: `
    | top    |
    | top    |
    | left   |
    | left   |
    | right  |
    | right  |
    | bottom |
    | bottom |
  `,
  desktop: `
    | top    | top    | top    | top    |
    | top    | top    | top    | top    |
    | left   | left   | right  | right  |
    | left   | left   | right  | right  |
    | left   | left   | right  | right  |
    | left   | left   | right  | right  |
    | bottom | bottom | bottom | bottom |
    | bottom | bottom | bottom | bottom |
  `,
}
```

### Template Rules

1. Each row must have the same number of columns
2. Section names must match the `sections` array
3. Sections span multiple cells by repeating their name
4. Mobile layout uses 1 column, desktop uses multiple

## Loading States (Streaming Mode)

When `loadingStrategy="streaming"`:

1. **Dimmed elements** - Loading sections have 15% opacity on axes, labels, and series
2. **Spinner overlay** - RSuite Loader positioned over each loading section
3. **Progressive reveal** - Each section fades in as its data arrives

```tsx
<EfxChartsLayout
  template={template}
  loadingStrategy="streaming"
  sectionLoadingStates={{
    header: !headerLoaded,
    sidebar: !sidebarLoaded,
    main: !mainLoaded,
    footer: !footerLoaded,
  }}
>
  {/* Children */}
</EfxChartsLayout>
```

## SSR Compatibility

Always lazy-load `EfxChartsLayout` for SSR:

```tsx
const EfxChartsLayout = lazy(() => import('@/components/EfxChart2/EfxChartsLayout'))

// Wrap in Suspense
<Suspense fallback={<ChartLoadingFallback />}>
  <EfxChartsLayout {...props} />
</Suspense>
```

## File Structure

```
EfxChart2/
├── EfxChartsLayout.tsx   # Main layout component with streaming
├── EfxChart.tsx          # Chart section config component
├── templates.ts          # Pre-defined ASCII templates
├── types.ts              # TypeScript definitions
├── index.ts              # Public exports
├── core/
│   ├── EChartsRenderer.tsx
│   ├── useEChartsInstance.ts
│   └── useResizeObserver.ts
└── utils/
    ├── optionBuilder.ts  # Builds ECharts options
    ├── templateParser.ts # Parses ASCII templates
    ├── paddingParser.ts  # Padding utilities
    └── dataGenerators.ts # Test data generators
```

