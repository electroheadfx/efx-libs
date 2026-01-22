# TanStack Start Multi-Charts Dashboard

A comprehensive data visualization platform built with TanStack Start, featuring advanced multi-chart ECharts compositions, responsive layouts, and real-time data updates.

**This is a monorepo** containing both a demo application and **four published npm packages** for building chart-based dashboards:

- **[@efxlab/chart-core](https://www.npmjs.com/package/@efxlab/chart-core)** - Framework-agnostic chart utilities and types
- **[@efxlab/chart-react](https://www.npmjs.com/package/@efxlab/chart-react)** - React components for ECharts dashboards
- **[@efxlab/layout-core](https://www.npmjs.com/package/@efxlab/layout-core)** - Framework-agnostic layout utilities
- **[@efxlab/layout-react](https://www.npmjs.com/package/@efxlab/layout-react)** - React layout components

## 📦 Published Packages

### Using the packages in your project

```bash
# Install chart packages
npm install @efxlab/chart-core @efxlab/chart-react echarts

# Install layout packages  
npm install @efxlab/layout-core @efxlab/layout-react
```

**Quick Example:**

```tsx
import { EfxChartsLayout, EfxChart } from '@efxlab/chart-react'

const template = {
  areas: [['kpi', 'chart']],
  columns: ['1fr', '2fr'],
  rows: ['1fr'],
}

function Dashboard() {
  return (
    <EfxChartsLayout template={template}>
      <EfxChart
        id="kpi"
        title="Revenue"
        option={{
          series: [{ type: 'bar', data: [100, 200, 150] }]
        }}
      />
      <EfxChart
        id="chart"
        title="Trend"
        option={{
          xAxis: { type: 'category', data: ['A', 'B', 'C'] },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: [10, 20, 15] }]
        }}
      />
    </EfxChartsLayout>
  )
}
```

See individual package READMEs for detailed documentation:
- [packages/efx-chart-core/README.md](./packages/efx-chart-core/README.md)
- [packages/efx-chart-react/README.md](./packages/efx-chart-react/README.md)
- [packages/efx-layout-core/README.md](./packages/efx-layout-core/README.md)
- [packages/efx-layout-react/README.md](./packages/efx-layout-react/README.md)

---

## 🚀 Demo Application Features

- **Multi-Chart ECharts Compositions** - Combine multiple visualization types within single ECharts instances
- **3 ECharts Demo Pages** - Basic Charts, Layout Systems, and Navigation Hub
- **5 Domain-Specific Dashboards** - Sales Analytics, Performance Metrics, Financial Reports, Marketing, and Operations
- **Advanced Chart Types**
  - `MultiGridChart` - 4 charts in 2x2 grid within one ECharts instance
  - `ComboChart` - Line + Bar + Scatter in single chart
  - `DualAxisChart` - Two Y-axes for different scales
  - `SplitPanelChart` - 2 side-by-side grids
  - `MatrixChart` - Matrix coordinate system for multi-chart layouts
  - Custom series: Violin, Contour, Liquid Fill, and more
- **Advanced Layout Systems** - DashboardLayout, DashboardGrid, ResponsiveDashboardLayout
- **Responsive Layouts** - Desktop and mobile optimized with multiple layout presets per page
- **Dark/Light/High-Contrast Themes** - Seamless theme switching with RSuite integration
- **SSR-Safe Implementation** - Lazy loading patterns for ECharts in SSR environments
- **Seeded Random Data** - Reproducible data generation for demos
- **Type-Safe** - Full TypeScript support throughout

## 📦 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (SSR/SPA React meta-framework)
- **Router**: [TanStack Router](https://tanstack.com/router) (File-based routing)
- **Charts**: [Apache ECharts](https://echarts.apache.org/) (5.5.1) with custom series extensions
- **UI Components**: [RSuite](https://rsuitejs.com/) (5.77.3)
- **Styling**: Tailwind CSS + RSuite themes
- **Linting**: [Biome](https://biomejs.dev/)
- **Build Tool**: Vite 7.3.0

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tanstack-start-multi-charts

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

**Demo Application:**

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Run linting checks
pnpm lint         # Lint code
pnpm format       # Format code
pnpm test         # Run tests (Vitest)
```

**Package Management:**

```bash
pnpm build:packages        # Build all packages in ./packages/
pnpm clean:packages        # Clean all package dist folders

# Changesets workflow for versioning and publishing
pnpm changeset             # Create a new changeset
pnpm changeset:version     # Apply changesets and bump versions
pnpm changeset:publish     # Build and publish packages to npm
```

## 📁 Project Structure

This is a **pnpm monorepo** with the following structure:

```
packages/
├── efx-chart-core/        # @efxlab/chart-core - Framework-agnostic chart utilities
├── efx-chart-react/       # @efxlab/chart-react - React chart components
├── efx-layout-core/       # @efxlab/layout-core - Framework-agnostic layout utilities
└── efx-layout-react/      # @efxlab/layout-react - React layout components

src/                       # Demo application
├── components/
│   ├── charts/
│   │   ├── composed/          # Multi-chart ECharts components
│   │   │   ├── ComboChart.tsx         # Line + Bar + Scatter
│   │   │   ├── DualAxisChart.tsx      # Dual Y-axis
│   │   │   ├── MultiGridChart.tsx     # 4 charts in 2x2 grid
│   │   │   └── MatrixChart.tsx        # Matrix layout wrapper
│   │   ├── core/              # Base chart components
│   │   │   └── ChartContainer.tsx
│   │   └── types/             # Individual chart types
│   │       ├── LineChart.tsx
│   │       ├── BarChart.tsx
│   │       ├── PieChart.tsx
│   │       ├── ScatterChart.tsx
│   │       └── ViolinChart.tsx
│   ├── controls/              # UI controls
│   │   ├── ControlBar.tsx             # Unified top control bar
│   │   ├── LayoutNavigator.tsx        # Layout switcher
│   │   ├── RandomDataButton.tsx       # Data randomizer
│   │   └── ThemeControlPanel.tsx      # Theme toggle
│   ├── layout/                # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── DashboardGrid.tsx
│   │   ├── ResponsiveDashboardLayout.tsx
│   │   └── layoutPresets.ts
│   └── ui/                    # UI components
│       ├── KPICard.tsx                # Metric cards
│       ├── StatsList.tsx              # Stats display
│       └── NavigationCard.tsx
├── routes/
│   ├── examples/              # Dashboard pages
│   │   ├── sales-analytics.tsx        # Sales dashboard
│   │   ├── performance.tsx            # Performance metrics
│   │   ├── financial.tsx              # Financial reports
│   │   ├── marketing.tsx              # Marketing analytics
│   │   └── operations.tsx             # Operations center
│   ├── index.tsx              # Landing page (introduction)
│   ├── dashboard.tsx          # Dashboard navigation hub
│   ├── basic-echarts.tsx      # 12 chart types demo
│   └── layout-echarts.tsx     # 7 layout systems demo
├── lib/
│   ├── sampleDataGenerator.ts         # Seeded random data
│   ├── customSeries/                  # ECharts extensions
│   └── matrixLayoutBuilder.ts
├── providers/
│   └── ThemeProvider.tsx              # Theme context
├── hooks/
│   ├── useAppTheme.ts
│   ├── useDataTypeInference.ts
│   └── useMediaQuery.ts
└── types/                     # TypeScript definitions
    ├── chart.types.ts
    ├── data.types.ts
    └── theme.types.ts
```

### Working with the Monorepo

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build:packages

# Start demo app
pnpm dev

# Run package-specific commands
pnpm --filter @efxlab/chart-react build
pnpm --filter @efxlab/layout-core typecheck
```

## 🔄 SSR-Safe Implementation

### Lazy Loading Pattern

For SSR environments, ECharts must be lazy-loaded to avoid `window is not defined` errors:

```tsx
import { lazy, Suspense } from 'react'

// Lazy load ECharts components
const ReactECharts = lazy(() => import('echarts-for-react'))
const MatrixChart = lazy(() =>
  import('@/components/charts/composed/MatrixChart').then(m => ({ default: m.MatrixChart }))
)

// Usage with Suspense
function Chart() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </Suspense>
  )
}
```

### When to Use Each Pattern

| Pattern | Use Case | Example Page |
|---------|----------|-------------|
| Direct import | Client-side only pages, simpler setup | `/basic-echarts` |
| Lazy loading | SSR pages, better initial load performance | `/layout-echarts` |

---

## 🎯 Component Usage

### MultiGridChart - 4 Charts in One ECharts Instance

Combines 4 different chart types in a 2x2 grid within a single ECharts instance:

```tsx
import { MultiGridChart } from '@/components/charts';

<MultiGridChart
  lineData={[
    { date: '2024-01', value: 120 },
    { date: '2024-02', value: 150 },
  ]}
  areaData={[
    { date: '2024-01', value: 80 },
    { date: '2024-02', value: 95 },
  ]}
  barData={[
    { category: 'Product A', value: 200 },
    { category: 'Product B', value: 180 },
  ]}
  hBarData={[
    { category: 'Region 1', value: 300 },
    { category: 'Region 2', value: 250 },
  ]}
/>
```

**Layout**: 2x2 grid
- Top-left: Line chart
- Top-right: Area chart  
- Bottom-left: Vertical bar chart
- Bottom-right: Horizontal bar chart

### ComboChart - Multiple Series in One Chart

Combines line, bar, and scatter series sharing the same axes:

```tsx
import { ComboChart } from '@/components/charts';

<ComboChart
  lineData={revenueData}
  barData={orderData}
  scatterData={profitData}  // Optional
  lineName="Revenue Trend"
  barName="Order Volume"
  scatterName="Profit Points"
/>
```

**Use Cases**: 
- Trends + Volume comparison
- Multiple metrics on same timeline
- Event markers with scatter points

### DualAxisChart - Two Independent Y-Axes

Displays two datasets with different scales:

```tsx
import { DualAxisChart } from '@/components/charts';

<DualAxisChart
  primaryData={volumeData}
  secondaryData={percentageData}
  primaryName="Sales Volume"
  secondaryName="Growth Rate"
  primaryUnit="K"
  secondaryUnit="%"
/>
```

**Features**:
- Left Y-axis for primary metric (bars)
- Right Y-axis for secondary metric (line)
- Different units and scales
- Color-coded for clarity

### SplitPanelChart - Side-by-Side Comparison

Two charts side-by-side in one ECharts instance:

```tsx
import { SplitPanelChart } from '@/components/charts';

<SplitPanelChart
  leftLineData={seriesA}
  leftBarData={seriesB}
  rightScatterData={correlationData}
  leftLineName="Server A CPU"
  leftBarName="Server A Memory"
  rightScatterName="Latency vs Load"
/>
```

**Layout**: 50/50 split
- Left: Combo chart (line + bar)
- Right: Scatter plot for correlation

### ControlBar - Unified Dashboard Controls

Combines layout navigation, KPIs, theme toggle, and randomize button:

```tsx
import { ControlBar } from '@/components/controls';

const layouts = [
  { id: 'matrix', name: 'Matrix', description: '4-in-1 + sidebar' },
  { id: 'detailed', name: 'Detailed', description: 'Combo charts' },
];

const kpis = [
  { title: 'Revenue', value: '$1.2M', change: '+15%', changeType: 'positive' },
  { title: 'Orders', value: '3,420', change: '+8%', changeType: 'positive' },
];

<ControlBar
  layouts={layouts}
  currentLayoutIndex={currentIndex}
  onLayoutChange={setCurrentIndex}
  kpis={kpis}
  onThemeToggle={handleThemeToggle}
  isDark={theme === 'dark'}
  onRandomize={handleRandomize}
/>
```

## 📊 Demo Pages

### Page Structure

| Route | Page | Purpose |
|-------|------|--------|
| `/` | Landing Page | Introduction to the demo with links to all sections |
| `/basic-echarts` | Basic ECharts | 12 chart types showcase |
| `/layout-echarts` | Layout Systems | 7 layout system demos |
| `/dashboard` | Dashboard Hub | Navigation to 5 domain dashboards |
| `/examples/*` | Dashboard Examples | Domain-specific dashboards |

### Landing Page (`/`)

**Purpose**: Beautiful introduction page presenting the three main demo areas.

**Features**:
- Hero section with application overview
- Three showcase cards for demo pages (Basic ECharts, Layout Systems, Dashboard Hub)
- Quick statistics (12+ chart types, 7 layouts, 5 dashboards, 3 themes)
- Tech stack display
- Theme control panel

### Basic ECharts (`/basic-echarts`)

**Purpose**: Comprehensive showcase of 12 different chart types with direct ECharts integration.

**Chart Types Demonstrated**:
1. Line Chart - Time series trends
2. Area Chart - Volume over time
3. Bar Chart - Categorical comparison
4. Pie Chart - Market share
5. Donut Chart - Category distribution
6. Scatter Chart - Correlation analysis
7. Horizontal Bar - Regional performance
8. Stacked Area - Multi-series
9. Multi-Grid Chart - 4 charts in 2x2 layout (single ECharts instance)
10. Dual-Axis Chart - Different scales
11. Combo Chart - Line + Bar + Scatter
12. Radar Chart - Multi-dimensional comparison

**Implementation Pattern**:
- Direct `echarts-for-react` import (not lazy loaded)
- Self-contained data generation utilities
- Fixed height charts (`h-80` = 320px)
- RSuite Grid/Row/Col for layout

```tsx
import ReactECharts from 'echarts-for-react'

function DemoChartContainer({ option, title }: { option: EChartsOption; title: string }) {
  const { echartsTheme } = useAppTheme()
  return (
    <Panel bordered shaded header={title} className="bg-rs-bg-card">
      <div className="h-80">
        <ReactECharts
          option={option}
          theme={echartsTheme}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </Panel>
  )
}
```

#### Layout Systems (`/layout-echarts`)

**Purpose**: Showcase of 7 different layout systems for organizing charts and components.

**Layout Demos**:
1. **Analytics Layout** - KPI cards + Main chart + Sidebar (DashboardLayout)
2. **Report Layout** - Header + Main + Sidebar + Footer (DashboardLayout)
3. **Comparison Layout** - Side-by-side with title and summary (DashboardLayout)
4. **MatrixChart Layout** - Multiple charts in single ECharts instance (MatrixChart)
5. **Dynamic Proportions** - Customizable column ratios (DashboardLayout)
6. **DashboardGrid** - Auto-layout with flexible rows (DashboardGrid)
7. **Responsive Layout** - Breakpoint-based layout changes (ResponsiveDashboardLayout)

**Implementation Pattern**:
- SSR-safe lazy loading for ECharts
- Flexible height using flexbox + absolute positioning
- Multiple layout component systems

```tsx
// SSR-safe lazy loading
const ReactECharts = lazy(() => import('echarts-for-react'))
const MatrixChart = lazy(() => import('@/components/charts/composed/MatrixChart').then(m => ({ default: m.MatrixChart })))

// Flexible height chart wrapper
function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col border border-rs-border rounded-md bg-rs-bg-card p-4">
      <h3 className="text-lg font-semibold text-rs-heading mb-2 shrink-0">{title}</h3>
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  )
}
```

### Page Comparison

| Feature | Landing (`/`) | Basic ECharts | Layout ECharts | Dashboard Hub |
|---------|---------------|---------------|----------------|---------------|
| **Purpose** | Introduction | 12 chart types | 7 layout demos | Navigate dashboards |
| **ECharts** | None | Direct import | Lazy (SSR-safe) | None |
| **Layout** | Tailwind | RSuite Grid | DashboardLayout | Tailwind |
| **Route** | `/` | `/basic-echarts` | `/layout-echarts` | `/dashboard` |

### Dashboard Examples

### Sales Analytics (`/examples/sales-analytics`)

### Performance Metrics (`/examples/performance`)

### Financial Reports (`/examples/financial`)

### Marketing (`/examples/marketing`)

Campaign analytics with engagement metrics and audience demographics.

### Operations (`/examples/operations`)

Operational monitoring with throughput tracking and anomaly detection.

---

## 🏗️ Layout Systems API Reference

### DashboardLayout - CSS Grid Template Areas

**Location:** `src/components/layout/DashboardLayout.tsx`

Precise positioning using CSS Grid template areas. Best for complex, fixed layouts.

```tsx
import { DashboardLayout, LayoutItem, type LayoutTemplate } from '@/components/layout'

const template: LayoutTemplate = {
  areas: `
    "kpi1 kpi2 kpi3 kpi4"
    "main main main side"
    "main main main side"
  `,
  columns: ['1fr', '1fr', '1fr', '1fr'],  // Column sizes
  rows: ['100px', '1fr', '1fr'],           // Row sizes (use '1fr' for flexible)
  gap: 16,                                  // Gap in pixels
}

<DashboardLayout template={template}>
  <LayoutItem area="kpi1"><KPICard title="Revenue" value="$1.2M" change="+15%" /></LayoutItem>
  <LayoutItem area="main"><ChartPanel title="Revenue"><Chart /></ChartPanel></LayoutItem>
  <LayoutItem area="side"><ChartPanel title="Breakdown"><PieChart /></ChartPanel></LayoutItem>
</DashboardLayout>
```

**LayoutTemplate Props:**

| Prop | Type | Description |
|------|------|-------------|
| `areas` | `string` | CSS grid-template-areas string with quoted area names |
| `columns` | `string[]` | Column sizes (e.g., `['1fr', '300px', '1fr']`) |
| `rows` | `string[]` | Row sizes (e.g., `['100px', '1fr', '80px']`) - Use `1fr` for flexible heights |
| `gap` | `number` | Gap between items in pixels |

### DashboardGrid - Auto-Layout Grid

**Location:** `src/components/layout/DashboardGrid.tsx`

Simpler API for automatic grid layouts. Best for uniform item sizes.

```tsx
import { DashboardGrid } from '@/components/layout'

<DashboardGrid columns={3} gap={16} fillHeight>
  <ChartPanel title="Chart 1"><Chart1 /></ChartPanel>
  <ChartPanel title="Chart 2"><Chart2 /></ChartPanel>
  <ChartPanel title="Chart 3"><Chart3 /></ChartPanel>
</DashboardGrid>
```

**DashboardGrid Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `number \| { sm?: number; md?: number; lg?: number }` | `2` | Number of columns or responsive breakpoints |
| `gap` | `number \| string` | `16` | Gap between items |
| `rowHeight` | `number \| string` | `'auto'` | Fixed row height |
| `fillHeight` | `boolean` | `false` | When true, uses `1fr` rows to fill container height |
| `className` | `string` | `''` | Additional CSS classes |

### ResponsiveDashboardLayout - Breakpoint-Based Layouts

**Location:** `src/components/layout/ResponsiveDashboardLayout.tsx`

Automatically switches between layout templates based on screen size.

```tsx
import { ResponsiveDashboardLayout, LayoutItem } from '@/components/layout'

<ResponsiveDashboardLayout
  templates={{
    desktop: {
      areas: `"kpi1 kpi2" "main main"`,
      columns: ['1fr', '1fr'],
      rows: ['100px', '1fr'],
      gap: 16,
    },
    mobile: {
      areas: `"kpi1" "kpi2" "main"`,
      columns: ['1fr'],
      rows: ['80px', '80px', '1fr'],
      gap: 12,
    },
  }}
>
  <LayoutItem area="kpi1"><KPICard ... /></LayoutItem>
  <LayoutItem area="kpi2"><KPICard ... /></LayoutItem>
  <LayoutItem area="main"><Chart /></LayoutItem>
</ResponsiveDashboardLayout>
```

### MatrixChart - Multi-Chart ECharts Grid

**Location:** `src/components/charts/composed/MatrixChart.tsx`

Renders multiple charts in a single ECharts canvas instance using a matrix coordinate system.

```tsx
import { MatrixChart } from '@/components/charts/composed'
import { useMatrixLayout } from '@/hooks/useMatrixLayout'
import type { MatrixSection } from '@/types/matrixLayout.types'

const sections: MatrixSection[] = [
  { id: 'header', option: { title: { text: 'Overview', left: 'center' } } },
  { id: 'main', option: { xAxis: {...}, yAxis: {...}, series: [{type: 'line'}] } },
  { id: 'sidebar', option: { series: [{ type: 'pie', radius: '50%' }] } },
]

const layout = useMatrixLayout({
  sections: ['header', 'main', 'sidebar'],
  breakpoints: {
    desktop: {
      template: `
        | header  | header  | header  |
        | main    | main    | sidebar |
      `,
    },
  },
})

<Suspense fallback={<div>Loading...</div>}>
  <MatrixChart sections={sections} mediaDefinitions={layout} />
</Suspense>
```

---

## 📐 Height Management Best Practices

### Fixed Height

Simplest approach - predictable but doesn't fill available space.

```tsx
<div className="h-80"> {/* 320px fixed height */}
  <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
</div>
```

### Flexible Height

Fills available space using flexbox + absolute positioning.

```tsx
<div className="h-full w-full flex flex-col">
  <h3 className="shrink-0">Title</h3>
  <div className="flex-1 min-h-0 relative">
    <div className="absolute inset-0">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  </div>
</div>
```

**Key CSS patterns:**
- `flex-1 min-h-0` - Allows flex item to shrink below content size
- `relative` + `absolute inset-0` - Creates positioning context for chart
- Parent chain must have defined heights (`h-full`, `h-screen`, etc.)

### Grid with Flexible Rows

Use `1fr` units for rows that should fill available space.

```tsx
const template: LayoutTemplate = {
  areas: `"header" "main"`,
  columns: ['1fr'],
  rows: ['80px', '1fr'],  // Header fixed, main fills remaining
  gap: 16,
}
```

## 🎨 Theme Integration

The app supports light, dark, and high-contrast themes using RSuite's theme system:

```tsx
import { useAppTheme } from '@/providers/ThemeProvider'

function MyComponent() {
  const { theme, setTheme, echartsTheme } = useAppTheme()
  
  // theme: 'light' | 'dark' | 'high-contrast'
  // echartsTheme: 'default' | 'dark' (for ECharts)
  
  return (
    <ReactECharts option={option} theme={echartsTheme} />
  )
}
```

Themes apply to:
- RSuite components (automatic)
- ECharts (via theme prop)
- Tailwind utilities (via `bg-rs-body`, `text-rs-heading`, etc.)

## 🔢 Data Generation

Seeded random data ensures reproducible demos:

```tsx
import { generateSalesData, randomSeed } from '@/lib/sampleDataGenerator';

const [seed, setSeed] = useState(() => randomSeed());
const data = generateSalesData(12, seed); // 12 months of data

// Randomize button updates seed
const handleRandomize = () => setSeed(randomSeed());
```

**Available Generators**:
- `generateSalesData(count, seed)` - Time series data
- `generateScatterData(count, correlation, seed)` - X/Y scatter points
- `generateDashboardData(seed)` - Complete dashboard data with KPIs, stats, categories
- `randomSeed()` - Generates new random seed

## 🏗️ Architecture

### Multi-Chart Pattern

All composed charts follow this pattern:
1. Accept typed data props
2. Configure multiple `grid`, `xAxis`, `yAxis` arrays
3. Map series to correct grid/axis indices
4. Wrap in `ChartContainer` for theme support

```tsx
const option: EChartsOption = {
  grid: [
    { left: '7%', right: '53%', top: '12%', height: '35%' },  // Grid 0
    { left: '57%', right: '7%', top: '12%', height: '35%' }, // Grid 1
  ],
  xAxis: [
    { type: 'category', gridIndex: 0, data: dates },
    { type: 'category', gridIndex: 1, data: categories },
  ],
  yAxis: [
    { type: 'value', gridIndex: 0 },
    { type: 'value', gridIndex: 1 },
  ],
  series: [
    { type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: lineValues },
    { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: barValues },
  ],
};
```

### Responsive Layout System

Each dashboard page uses a consistent layout structure:

```tsx
// Top: Control bar (always visible)
<ControlBar ... />

// Main: Grid with dynamic columns based on layout
<div style={{ gridTemplateColumns: '2fr 1fr' }}>
  {/* Main chart area */}
  <div>...</div>
  
  {/* Sidebar with secondary charts */}
  <div>
    <Chart1 />
    <Chart2 />
    <StatsList />
  </div>
</div>
```

## 🧪 Testing

Tests use Vitest:

```bash
pnpm test        # Run tests
pnpm test:ui     # Run with UI
pnpm coverage    # Generate coverage report
```

## 🔧 Build & Deploy

### Production Build

```bash
pnpm build       # Creates .output/ directory
pnpm start       # Starts production server
```

### Build Output

```
.output/
├── public/              # Static assets
│   └── assets/          # CSS and JS bundles
└── server/              # SSR server files
```

## 📚 Key Dependencies

```json
{
  "@tanstack/react-router": "^2.0.0",
  "@tanstack/start": "^2.0.0",
  "echarts": "5.5.1",
  "echarts-for-react": "^3.0.2",
  "rsuite": "^5.77.3",
  "react": "^19.0.0",
  "vite": "^7.3.0"
}
```

## 🎓 Learn More

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Apache ECharts Docs](https://echarts.apache.org/handbook/en/get-started)
- [RSuite Components](https://rsuitejs.com/components/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 License

MIT
