# TanStack Start Multi-Charts Dashboard

A comprehensive data visualization platform built with TanStack Start, featuring advanced multi-chart ECharts compositions, responsive layouts, and real-time data updates.

## 🚀 Features

- **Multi-Chart ECharts Compositions** - Combine multiple visualization types within single ECharts instances
- **5 Domain-Specific Dashboards** - Sales Analytics, Performance Metrics, Financial Reports, Marketing, and Operations
- **Advanced Chart Types**
  - `MultiGridChart` - 4 charts in 2x2 grid within one ECharts instance
  - `ComboChart` - Line + Bar + Scatter in single chart
  - `DualAxisChart` - Two Y-axes for different scales
  - `SplitPanelChart` - 2 side-by-side grids
  - Custom series: Violin, Contour, Liquid Fill, and more
- **Responsive Layouts** - Desktop and mobile optimized with multiple layout presets per page
- **Dark/Light Theme** - Seamless theme switching with RSuite integration
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

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Run linting checks
pnpm lint         # Lint code
pnpm format       # Format code
pnpm test         # Run tests (Vitest)
```

## 📁 Project Structure

```
src/
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
│   └── index.tsx              # Home/navigation hub
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

## 🎨 Component Usage

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

## 📊 Dashboard Pages

### Sales Analytics (`/examples/sales-analytics`)

**Matrix Layout**: MultiGridChart with revenue/orders/categories + sidebar with DualAxisChart and ComboChart

**Detailed Layout**: ComboChart (Revenue + Orders + Profit scatter) + DualAxisChart for margin analysis

**Executive Layout**: DualAxisChart for revenue vs growth + ComboChart for category performance

### Performance Metrics (`/examples/performance`)

**Matrix Layout**: System overview with CPU/Memory/Disk/Network metrics in 4-grid layout

**Real-time Layout**: ComboChart showing CPU + Memory + Network events

**Historical Layout**: DualAxisChart for throughput vs error rate

### Financial Reports (`/examples/financial`)

**Matrix Layout**: P&L dashboard with revenue, profit, and category breakdowns

**Trends Layout**: DualAxisChart for revenue vs margin trends

**Summary Layout**: ComboChart for comprehensive P&L analysis

### Marketing (`/examples/marketing`)

**Matrix Layout**: Campaign metrics across channels and quarters

**Campaigns Layout**: Engagement analysis with Line + Bar + Scatter

**Funnel Layout**: Conversion funnel with volume + rate dual-axis

### Operations (`/examples/operations`)

**Matrix Layout**: Operations center with team performance and priority tracking

**Live Layout**: Real-time throughput, queue depth, and events

**Daily Layout**: Productivity vs error rate analysis

## 🎨 Theme System

The app supports light and dark themes using RSuite's theme system:

```tsx
import { useAppTheme } from '@/providers/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useAppTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
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
