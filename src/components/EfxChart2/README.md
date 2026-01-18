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

### Visual Feedback System

The streaming mode provides rich visual feedback during data loading:

#### Opacity-Based Dimming
- Loading sections are rendered with **15% opacity** on all visual elements
- Applies to: axis lines, axis ticks, axis labels, series lines/bars, area fills
- Non-loading sections maintain full opacity (100%)
- Smooth transition as sections load

#### Spinner Overlays
- **RSuite Loader** component positioned absolutely over each grid section
- Appears only when `sectionLoadingStates[section]` is `true`
- Centered within each section's bounds
- Automatically disappears when loading completes

#### Section Isolation
- Each section's loading state is independent
- No interference between sections
- Placeholders shown immediately while real data loads

### Loading State Management

The `useStreamingData` hook automatically manages:

1. **Promise Resolution** - Tracks each deferred promise independently
2. **State Updates** - Updates `sectionData` as promises resolve
3. **Loading Calculation** - Computes `sectionLoadingStates` from resolved data
4. **Placeholder Application** - Shows generated placeholders until real data arrives
5. **Load Time Tracking** - Captures timing metrics from server responses

```tsx
const {
  sectionData,          // Raw resolved data per section
  sectionLoadingStates,  // Boolean loading states
  chartData,            // Data with placeholders applied
  reset,                // Reset function for navigation
  allLoaded,            // Overall loading status
  loadTimes             // Performance metrics
} = useStreamingData({
  loaderData,           // Deferred promises from loader
  sections,             // Section names array
  placeholder,          // Auto-placeholder config
  onSectionLoad         // Completion callbacks
})
```

### Performance Benefits

- **Perceived Speed** - Users see placeholder charts immediately
- **Resource Efficiency** - Browser processes one section at a time
- **Better UX** - No full-page loading spinners
- **Progressive Enhancement** - Core layout appears instantly

### Error Handling

- Failed promises are caught and logged
- Sections with failed loads show placeholder data
- Other sections continue loading unaffected
- No full-dashboard failure cascade

## Advanced Streaming Patterns

### Conditional Section Rendering

Render sections only when loaded:

```tsx
<EfxChartsLayout
  template={template}
  loadingStrategy="streaming"
  sectionLoadingStates={sectionLoadingStates}
>
  {!sectionLoadingStates.header && (
    <EfxChart section="header" type="line" data={chartData.header} />
  )}
  <EfxChart section="main" type="line" data={chartData.main} />
</EfxChartsLayout>
```

### Custom Loading Indicators

Override default loaders per section:

```tsx
function CustomSectionLoader({ section, isLoading }: { 
  section: string; 
  isLoading: boolean 
}) {
  if (!isLoading) return null
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-2 text-sm">Loading {section}...</p>
      </div>
    </div>
  )
}
```

### Load Time Analytics

Track and display performance metrics:

```tsx
useEffect(() => {
  if (allLoaded) {
    const totalTime = Object.values(loadTimes)
      .reduce((sum, time) => sum + (time || 0), 0)
    console.log(`All sections loaded in ${totalTime}ms`)
    
    // Send to analytics
    analytics.track('dashboard_loaded', {
      total_load_time: totalTime,
      section_times: loadTimes
    })
  }
}, [allLoaded, loadTimes])
```

### Staggered Loading Sequences

Control loading order programmatically:

```tsx
const [loadSequence, setLoadSequence] = useState(['header'])

useEffect(() => {
  const timers = [
    setTimeout(() => setLoadSequence(prev => [...prev, 'sidebar']), 500),
    setTimeout(() => setLoadSequence(prev => [...prev, 'main']), 1000),
    setTimeout(() => setLoadSequence(prev => [...prev, 'footer']), 1500),
  ]
  
  return () => timers.forEach(clearTimeout)
}, [])

// In loader:
const loaderData = {
  header: defer(getHeaderData()),
  sidebar: loadSequence.includes('sidebar') ? defer(getSidebarData()) : null,
  main: loadSequence.includes('main') ? defer(getMainData()) : null,
  footer: loadSequence.includes('footer') ? defer(getFooterData()) : null,
}
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

## Architecture & Internals

### Streaming Data Flow

```
[TanStack Router Loader]
         ↓ (deferred promises)
[useStreamingData Hook]
         ↓
┌─────────────────────────────┐
│ sectionData (raw resolved)  │
│ sectionLoadingStates (bool) │
│ chartData (with placeholders)│
└─────────────────────────────┘
         ↓
[EfxChartsLayout Component]
         ↓ (opacity + loaders)
[Single ECharts Instance]
```

### Key Implementation Details

#### 1. Single ECharts Instance
Unlike traditional React charting libraries that create one chart per component, EfxChart2 uses a **single ECharts instance** with multiple grid sections. This approach:

- Reduces memory overhead
- Improves performance
- Enables coordinated interactions
- Maintains consistent theming

#### 2. Matrix Coordinate System
The layout uses ECharts' matrix coordinate system (inspired by finance.js):

- ASCII templates define logical grid positions
- Converted to matrix coordinates at runtime
- Responsive breakpoints adjust coordinates
- Single canvas renders all sections

#### 3. Streaming Loading States
The visual dimming effect works by:

1. **Option Builder** receives `sectionLoadingStates`
2. **Applies 15% opacity** to axis elements, series, and labels
3. **Preserves existing show/hide states** - only affects opacity
4. **ECharts renders** the dimmed visualization
5. **Spinner overlay** appears above the section
6. **As data resolves**, opacity returns to 100%

#### 4. Grid Position Tracking
For accurate loader placement:

1. **Chart ready callback** triggers position calculation
2. **ECharts internal API** accessed to get grid bounding boxes
3. **Positions stored** in component state
4. **Loaders absolutely positioned** using grid coordinates
5. **Updates on resize** to maintain alignment

### Performance Optimizations

#### Memoization Strategy
- `useMemo` for parsed templates and chart options
- `useCallback` for event handlers and resize callbacks
- Selective re-renders based on loading state changes

#### Debounced Resize Handling
- 50ms debounce on resize observer
- Prevents excessive re-rendering during window resizing
- Maintains responsive behavior without performance cost

#### Efficient State Updates
- Batched updates for multiple section resolutions
- Minimal DOM manipulation through ECharts' internal rendering
- CSS transforms for loader positioning

## File Structure

```
EfxChart2/
├── EfxChartsLayout.tsx      # Main layout component with streaming
├── EfxChart.tsx             # Chart section config component
├── templates.ts             # Pre-defined ASCII templates
├── types.ts                 # TypeScript definitions
├── index.ts                 # Public exports
├── core/
│   ├── EChartsRenderer.tsx  # Canvas/SVG rendering wrapper
│   ├── useEChartsInstance.ts # ECharts lifecycle management
│   └── useResizeObserver.ts # Container resize detection
├── hooks/
│   ├── useStreamingData.ts  # Streaming data management
│   └── index.ts
├── utils/
│   ├── optionBuilder.ts     # Builds ECharts options
│   ├── templateParser.ts    # Parses ASCII templates
│   ├── paddingParser.ts     # Padding utilities
│   ├── dataGenerators.ts    # Test data generators
│   └── index.ts
└── README.md               # This documentation
```

### Core Module Responsibilities

#### `core/`
- **EChartsRenderer**: Wrapper around ECharts init/update/destroy
- **useEChartsInstance**: React hook for ECharts lifecycle management
- **useResizeObserver**: Resize detection with debouncing

#### `hooks/`
- **useStreamingData**: Centralized streaming data state management

#### `utils/`
- **optionBuilder**: Transforms EfxChart props to ECharts options
- **templateParser**: Converts ASCII templates to coordinate maps
- **paddingParser**: Flexible padding format handling
- **dataGenerators**: Utility functions for test data

## Best Practices

### 1. Always Use `useStreamingData`
Even for simple cases, the hook provides consistent state management:

```tsx
// ❌ Manual approach
const [data, setData] = useState()
useEffect(() => { /* ... */ }, [])

// ✅ Hook approach
const { chartData } = useStreamingData({ loaderData, sections })
```

### 2. Reset on Navigation
Call `reset()` when navigating to prevent stale data:

```tsx
const navigate = useNavigate()
const { reset } = useStreamingData(options)

const handleNav = () => {
  reset()
  navigate({ to: '/other-route' })
}
```

### 3. Optimize Placeholder Counts
Match placeholder size to actual data for smoother transitions:

```tsx
placeholder: {
  type: 'timeseries',
  count: 50,  // Match typical dataset size
  overrides: {
    sidebar: { count: 10 },  // Smaller for categorical data
    footer: { count: 20 }
  }
}
```

### 4. Handle Errors Gracefully
Provide fallback UI for failed loads:

```tsx
{loadErrors.map(section => (
  <Alert key={section} type="error">
    Failed to load {section} data
  </Alert>
))}
```

### 5. Monitor Performance
Use `loadTimes` for performance insights:

```tsx
useEffect(() => {
  if (allLoaded) {
    const avgTime = Object.values(loadTimes)
      .filter(Boolean)
      .reduce((a, b) => a + b, 0) / Object.keys(loadTimes).length
    
    if (avgTime > 3000) {
      // Log slow loading sections
      console.warn('Slow dashboard load:', loadTimes)
    }
  }
}, [allLoaded, loadTimes])
```

## Migration Guide

### From EfxChart v1 to v2

#### Breaking Changes
- `EfxChart` component now requires explicit section prop
- Templates moved from props to separate `EFX_CHART_TEMPLATES` export
- Loading states now managed by `useStreamingData` hook

#### Migration Steps

1. **Update imports**:
```tsx
// Before
import { EfxChart } from '@/components/EfxChart'

// After
import { EFX_CHART_TEMPLATES, createTypedChart } from '@/components/EfxChart2'
```

2. **Wrap with layout**:
```tsx
// Before
<EfxChart type="line" data={data} />

// After
const EfxChart = createTypedChart(EFX_CHART_TEMPLATES.finance)
<EfxChartsLayout template={EFX_CHART_TEMPLATES.finance}>
  <EfxChart section="main" type="line" data={data} />
</EfxChartsLayout>
```

3. **Add streaming (optional)**:
```tsx
const { chartData, sectionLoadingStates } = useStreamingData({
  loaderData: Route.useLoaderData(),
  sections: ['main']
})

<EfxChartsLayout 
  template={template}
  loadingStrategy="streaming"
  sectionLoadingStates={sectionLoadingStates}
>
  <EfxChart section="main" data={chartData.main} />
</EfxChartsLayout>
```

## Troubleshooting

### Common Issues

#### 1. Loaders Not Appearing
Check that:
- `loadingStrategy="streaming"` is set
- `sectionLoadingStates` is passed correctly
- Grid positions are calculated (chart must be ready)

#### 2. Sections Not Dimming
Verify that:
- Section names in `sectionLoadingStates` match chart section props
- ECharts option includes opacity settings
- No CSS overrides affecting opacity

#### 3. Placeholders Not Showing
Ensure:
- `useStreamingData` `placeholder` config is provided
- Section data is `undefined` (not `null` or empty array)
- Custom placeholders aren't overriding auto-generation

#### 4. Performance Issues
Optimize by:
- Reducing placeholder data counts
- Adding `React.memo` to heavy components
- Using `useCallback` for event handlers
- Limiting resize observer frequency

### Debugging Tools

Enable verbose logging:
```tsx
// Add to useStreamingData options
onSectionLoad: (section, data) => {
  console.log(`[STREAMING] ${section} loaded`, {
    dataSize: Array.isArray(data) ? data.length : 'N/A',
    loadTime: data.loadTime
  })
}
```

Monitor ECharts internals:
```tsx
onChartReady: (chart) => {
  console.log('[ECHARTS] Grid count:', chart.getModel().getComponentCount('grid'))
}
```
