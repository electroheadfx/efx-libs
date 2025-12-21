# Implementation Plan: React Multi-Chart Library with ECharts 6

## Executive Summary

This implementation plan details the development of a configurable multi-chart React library using ECharts 6. The library will dynamically infer data types, support SSR via TanStack Start, integrate Tailwind CSS 4 for styling, and implement ECharts 6 dark mode with manual override controls using RSuite 6.

---

## 1. Technology Stack Confirmation

| Component | Version | Purpose |
|-----------|---------|---------|
| TanStack Start | ^1.132.0 | Full-stack React framework with SSR |
| ECharts | ^6.0.0 | Charting library |
| echarts-for-react | ^3.0.5 | React wrapper for ECharts |
| React | ^19.2.0 | UI framework |
| RSuite | ^6.1.1 | UI components (Panel for theme control) |
| Tailwind CSS | ^4.0.6 | Utility-first styling |
| TypeScript | ^5.7.2 | Type safety |

---

## 2. Architecture Overview

### 2.1 Directory Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── core/
│   │   │   ├── ChartContainer.tsx       # Base chart wrapper with theme support
│   │   │   └── ChartGrid.tsx            # Matrix grid layout manager
│   │   ├── types/
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── ScatterChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   ├── HeatmapChart.tsx
│   │   │   ├── ViolinChart.tsx          # Custom series
│   │   │   ├── LineRangeChart.tsx       # Custom series
│   │   │   ├── BarRangeChart.tsx        # Custom series
│   │   │   └── index.ts
│   │   ├── composed/
│   │   │   └── MatrixChart.tsx          # ECharts-only matrix layout
│   │   └── index.ts
│   ├── controls/
│   │   └── ThemeControlPanel.tsx        # RSuite Panel for theme toggle
│   ├── layout/
│   │   ├── DashboardGrid.tsx            # Simple auto-grid layout
│   │   ├── DashboardLayout.tsx          # CSS Grid template layout
│   │   ├── ResponsiveDashboardLayout.tsx # Responsive breakpoint layout
│   │   ├── LayoutItem.tsx               # Grid area positioning
│   │   ├── ChartDashboard.tsx           # Main dashboard container
│   │   └── index.ts
│   ├── ui/
│   │   ├── KPICard.tsx                  # RSuite-based KPI card
│   │   ├── StatsList.tsx                # Stats list component
│   │   ├── ActivityFeed.tsx             # Activity feed component
│   │   └── index.ts
│   └── Header.tsx
├── data/
│   ├── demo.punk-songs.ts
│   ├── demo.sales-data.ts               # Sales time-series data
│   ├── demo.distribution-data.ts        # Statistical distribution data
│   ├── demo.categorical-data.ts         # Category comparison data
│   ├── demo.correlation-data.ts         # Scatter/correlation data
│   └── index.ts
├── providers/
│   └── ThemeProvider.tsx                # RSuite CustomProvider + Theme context
├── hooks/
│   ├── useAppTheme.ts                   # Alias export from ThemeProvider
│   ├── useDataTypeInference.ts          # Data type inference hook
│   ├── useChartOptions.ts               # ECharts options builder hook
│   ├── useMediaQuery.ts                 # Responsive breakpoint detection
│   └── useMatrixLayout.ts               # Simple template → mediaDefinitions hook
├── lib/
│   ├── chartConfig.ts                   # Chart configuration utilities
│   ├── dataTypeInference.ts             # Data type inference engine
│   ├── layoutPresets.ts                 # Pre-built dashboard layout templates
│   ├── matrixLayoutBuilder.ts           # Simple template → mediaDefinitions converter
│   ├── matrixLayoutPresets.ts           # Pre-built matrix layout templates
│   ├── customSeries/
│   │   └── index.ts                     # Custom series registration
│   ├── optionGenerators/
│   │   ├── lineGenerator.ts
│   │   ├── barGenerator.ts
│   │   ├── pieGenerator.ts
│   │   └── index.ts
│   └── themes/
│       └── echartsThemes.ts             # Custom ECharts theme configs
├── styles/
│   └── styles.css                       # Main styles with RSuite + Tailwind
├── types/
│   ├── chart.types.ts                   # Chart configuration types
│   ├── data.types.ts                    # Data structure types
│   ├── theme.types.ts                   # Theme types
│   └── matrixLayout.types.ts            # Matrix layout builder types
└── routes/
    └── index.tsx                        # Main route with SSR charts
```

### 2.2 Component Hierarchy

```
App (Route: /)
└── ThemeProvider (wraps RSuite CustomProvider)
    └── ChartDashboard
        ├── Sidebar
        │   └── ThemeControlPanel (RSuite Panel + Radio/Toggle)
        └── Main Content
            └── ChartGrid
                ├── ChartContainer (uses useAppTheme)
                │   └── LineChart
                ├── ChartContainer
                │   └── BarChart
                └── ChartContainer
                    └── PieChart
```

### 2.3 Theme Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ThemeProvider                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RSuite CustomProvider                        │  │
│  │  theme={theme} // 'light' | 'dark' | 'high-contrast'     │  │
│  │                                                           │  │
│  │  Automatically:                                           │  │
│  │  - Adds .rs-theme-dark or .rs-theme-high-contrast to body│  │
│  │  - Updates all RSuite CSS variables                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              ThemeContext (custom)                        │  │
│  │  - Manages theme source (system/manual)                   │  │
│  │  - Tracks registered ECharts instances                    │  │
│  │  - Syncs echartsTheme with RSuite theme                   │  │
│  │  - Calls chart.setTheme() on theme changes                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Features Implementation

### 3.1 Data Type Inference System

**Location:** `src/lib/dataTypeInference.ts`

#### Supported Data Types

| Type | Detection Pattern | Chart Mapping |
|------|-------------------|---------------|
| `time-series` | Date/timestamp keys, sequential numeric values | Line, Area |
| `categorical` | String keys, numeric values | Bar, Column, Pie |
| `numerical-pair` | Two numeric columns | Scatter |
| `hierarchical` | Nested objects with children | Treemap, Sunburst |
| `multi-dimensional` | Multiple numeric dimensions | Radar, Parallel |
| `distribution` | Single numeric array | Histogram, Boxplot |

#### Inference Algorithm

```typescript
interface InferenceResult {
  dataType: DataType;
  confidence: number;
  suggestedChartTypes: ChartType[];
  columnTypes: Map<string, ColumnType>;
  xAxisKey?: string;
  yAxisKey?: string;
  seriesKeys?: string[];
}

function inferDataType(data: unknown[]): InferenceResult {
  // 1. Analyze first N records (N=100 or all if smaller)
  // 2. Detect column types (string, number, date, boolean)
  // 3. Identify patterns (time-series, categorical, etc.)
  // 4. Calculate confidence score based on consistency
  // 5. Return inference result with suggested chart types
}
```

#### Column Type Detection

```typescript
type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'mixed';

function detectColumnType(values: unknown[]): ColumnType {
  // Analyze value patterns
  // Check for date patterns (ISO, timestamp, common formats)
  // Detect numeric strings vs actual numbers
  // Return most common type with threshold
}
```

### 3.2 Automatic Chart Option Generation

**Location:** `src/lib/optionGenerators/`

Each chart type will have a dedicated option generator:

```typescript
interface ChartOptionGenerator<T = unknown> {
  (data: T[], config: ChartConfig, inference: InferenceResult): EChartsOption;
}

// Example: Line Chart Generator
export const generateLineOptions: ChartOptionGenerator = (data, config, inference) => {
  const xAxisKey = inference.xAxisKey || Object.keys(data[0])[0];
  const yAxisKeys = inference.seriesKeys || [Object.keys(data[0])[1]];
  
  return {
    grid: { top: 60, right: 60, bottom: 60, left: 60 },
    xAxis: {
      type: inference.columnTypes.get(xAxisKey) === 'date' ? 'time' : 'category',
      data: data.map(d => d[xAxisKey]),
    },
    yAxis: { type: 'value' },
    series: yAxisKeys.map(key => ({
      name: key,
      type: 'line',
      data: data.map(d => d[key]),
      smooth: config.smooth ?? true,
    })),
    tooltip: { trigger: 'axis' },
    legend: yAxisKeys.length > 1 ? { show: true } : { show: false },
  };
};
```

### 3.3 Theme System with RSuite CustomProvider Integration

**Location:** `src/providers/ThemeProvider.tsx` and `src/hooks/useAppTheme.ts`

Rather than manually adding event listeners for system dark mode detection, we leverage **RSuite's built-in `CustomProvider` theme context system**. This provides:

- Centralized theme management via React context
- Three built-in themes: `light`, `dark`, `high-contrast`
- Automatic CSS variable updates
- Consistent styling across RSuite components and custom components

#### RSuite Theme Architecture

RSuite's `CustomProvider` adds a global className to the `<body>` element:
- Light theme: No additional class (default)
- Dark theme: `.rs-theme-dark`
- High contrast: `.rs-theme-high-contrast`

#### Theme Context Structure

```typescript
// src/types/theme.types.ts
export type AppTheme = 'light' | 'dark' | 'high-contrast';
export type ThemeSource = 'system' | 'manual';

export interface ThemeContextValue {
  theme: AppTheme;
  themeSource: ThemeSource;
  setTheme: (theme: AppTheme) => void;
  setThemeSource: (source: ThemeSource) => void;
  echartsTheme: 'default' | 'dark'; // Mapped theme for ECharts
  chartInstances: Map<string, EChartsInstance>;
  registerChart: (id: string, instance: EChartsInstance) => void;
  unregisterChart: (id: string) => void;
}
```

#### Theme Provider Implementation

```typescript
// src/providers/ThemeProvider.tsx
import { CustomProvider } from 'rsuite';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AppTheme, ThemeSource, ThemeContextValue } from '@/types/theme.types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Map RSuite themes to ECharts themes
function mapToEChartsTheme(theme: AppTheme): 'default' | 'dark' {
  return theme === 'light' ? 'default' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeSource, setThemeSource] = useState<ThemeSource>('system');
  const [manualTheme, setManualTheme] = useState<AppTheme>('light');
  const [systemTheme, setSystemTheme] = useState<AppTheme>('light');
  const [chartInstances] = useState(() => new Map<string, EChartsInstance>());

  // Detect system preference (only for determining initial/system theme)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute active theme based on source
  const theme = themeSource === 'system' ? systemTheme : manualTheme;
  const echartsTheme = mapToEChartsTheme(theme);

  // Update all registered ECharts instances when theme changes
  useEffect(() => {
    for (const chart of chartInstances.values()) {
      chart.setTheme(echartsTheme);
    }
  }, [echartsTheme, chartInstances]);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setManualTheme(newTheme);
    setThemeSource('manual');
  }, []);

  const registerChart = useCallback((id: string, instance: EChartsInstance) => {
    chartInstances.set(id, instance);
    // Apply current theme to newly registered chart
    instance.setTheme(echartsTheme);
  }, [chartInstances, echartsTheme]);

  const unregisterChart = useCallback((id: string) => {
    chartInstances.delete(id);
  }, [chartInstances]);

  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme,
    themeSource,
    setTheme,
    setThemeSource,
    echartsTheme,
    chartInstances,
    registerChart,
    unregisterChart,
  }), [theme, themeSource, setTheme, setThemeSource, echartsTheme, chartInstances, registerChart, unregisterChart]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* RSuite CustomProvider handles theme classes on body */}
      <CustomProvider theme={theme}>
        {children}
      </CustomProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
```

#### RSuite CSS Variables Integration

RSuite provides comprehensive CSS variables that automatically update based on theme. Key variables for chart integration:

| Variable | Light Value | Dark Value | Usage |
|----------|-------------|------------|-------|
| `--rs-body` | `#fff` | `#0f131a` | Background color |
| `--rs-text-primary` | `#272c36` | `#e9ebf0` | Text color |
| `--rs-text-secondary` | `#575757` | `#a4a9b3` | Secondary text |
| `--rs-border-primary` | `#e5e5ea` | `#3c3f43` | Border color |
| `--rs-bg-card` | `#fff` | `#1a1d24` | Card backgrounds |
| `--rs-primary-500` | `#3498ff` | `#3498ff` | Primary accent |

#### Tailwind CSS Integration with RSuite Variables

Extend Tailwind to use RSuite CSS variables for consistent theming:

```css
/* src/styles.css */
@import 'rsuite/dist/rsuite.css';
@import 'tailwindcss';

/* Bridge RSuite CSS variables to Tailwind-like utilities */
@layer utilities {
  .bg-rs-body { background-color: var(--rs-body); }
  .bg-rs-card { background-color: var(--rs-bg-card); }
  .text-rs-primary { color: var(--rs-text-primary); }
  .text-rs-secondary { color: var(--rs-text-secondary); }
  .border-rs-primary { border-color: var(--rs-border-primary); }
}
```

#### ECharts Theme Synchronization

ECharts 6 supports dynamic theme switching via the `setTheme` API. The theme is synchronized automatically:

```typescript
// Map RSuite theme to ECharts theme
// light -> 'default' (ECharts default theme)
// dark, high-contrast -> 'dark' (ECharts dark theme)

// When theme changes, all registered chart instances are updated:
for (const chart of chartInstances.values()) {
  chart.setTheme(echartsTheme); // 'default' or 'dark'
}
```

### 3.4 RSuite Theme Control Panel

**Location:** `src/components/controls/ThemeControlPanel.tsx`

The control panel uses RSuite's `Panel` component and integrates with our `useAppTheme` hook to provide:
- Toggle between system automatic and manual theme selection
- Choice between light, dark, and high-contrast modes
- Visual indication of current theme and source

```typescript
import { Panel, Toggle, RadioGroup, Radio, Stack, Text } from 'rsuite';
import { Sun, Moon, Monitor, Contrast } from 'lucide-react';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/types/theme.types';

export function ThemeControlPanel() {
  const { theme, themeSource, setTheme, setThemeSource } = useAppTheme();

  const handleSystemToggle = (checked: boolean) => {
    setThemeSource(checked ? 'system' : 'manual');
  };

  const handleThemeChange = (value: AppTheme) => {
    setTheme(value);
  };

  return (
    <Panel 
      header={
        <Stack spacing={8}>
          <span>Theme Settings</span>
        </Stack>
      }
      bordered 
      collapsible 
      defaultExpanded
      shaded
    >
      <Stack direction="column" spacing={16}>
        {/* System Theme Toggle */}
        <Stack justifyContent="space-between" alignItems="center">
          <Stack spacing={8}>
            <Monitor size={16} />
            <Text>Use System Theme</Text>
          </Stack>
          <Toggle 
            checked={themeSource === 'system'}
            onChange={handleSystemToggle}
          />
        </Stack>
        
        {/* Manual Theme Selection */}
        {themeSource === 'manual' && (
          <RadioGroup 
            name="theme-select"
            value={theme}
            onChange={handleThemeChange}
          >
            <Stack direction="column" spacing={8}>
              <Radio value="light">
                <Stack spacing={8}>
                  <Sun size={16} />
                  <span>Light</span>
                </Stack>
              </Radio>
              <Radio value="dark">
                <Stack spacing={8}>
                  <Moon size={16} />
                  <span>Dark</span>
                </Stack>
              </Radio>
              <Radio value="high-contrast">
                <Stack spacing={8}>
                  <Contrast size={16} />
                  <span>High Contrast</span>
                </Stack>
              </Radio>
            </Stack>
          </RadioGroup>
        )}
        
        {/* Current Theme Display */}
        <Text muted size="sm">
          Active: {theme} ({themeSource === 'system' ? 'auto' : 'manual'})
        </Text>
      </Stack>
    </Panel>
  );
}
```

### 3.5 Matrix Grid Layout (ECharts 6)

**Location:** `src/components/charts/core/ChartGrid.tsx`

The matrix coordinate system in ECharts 6 allows composing multiple charts in a grid layout:

```typescript
interface ChartGridConfig {
  rows: number;
  cols: number;
  gap: number;
  charts: ChartCellConfig[];
}

interface ChartCellConfig {
  row: number;    // 0-indexed row position
  col: number;    // 0-indexed column position
  rowSpan?: number;
  colSpan?: number;
  chartType: ChartType;
  data: unknown[];
  options?: Partial<ChartOptions>;
}

// Generate matrix grid ECharts option
function generateMatrixGridOption(config: ChartGridConfig): EChartsOption {
  const { rows, cols, gap, charts } = config;
  const cellWidth = (100 - gap * (cols + 1)) / cols;
  const cellHeight = (100 - gap * (rows + 1)) / rows;
  
  const grids = [];
  const xAxes = [];
  const yAxes = [];
  const series = [];
  
  charts.forEach((chart, index) => {
    const left = `${gap + chart.col * (cellWidth + gap)}%`;
    const top = `${gap + chart.row * (cellHeight + gap)}%`;
    const width = `${cellWidth * (chart.colSpan || 1) + gap * ((chart.colSpan || 1) - 1)}%`;
    const height = `${cellHeight * (chart.rowSpan || 1) + gap * ((chart.rowSpan || 1) - 1)}%`;
    
    grids.push({ left, top, width, height, containLabel: true });
    xAxes.push({ gridIndex: index, ...generateXAxis(chart) });
    yAxes.push({ gridIndex: index, ...generateYAxis(chart) });
    series.push(...generateSeries(chart, index));
  });
  
  return { grid: grids, xAxis: xAxes, yAxis: yAxes, series };
}
```

### 3.6 SSR Implementation with TanStack Start

**Location:** `src/routes/index.tsx`

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ChartDashboard } from '@/components/layout/ChartDashboard';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { getSalesData, getDistributionData, getCategoricalData, getCorrelationData } from '@/data';

// Server function for data fetching
export const getChartData = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Fetch all chart data on server
  const [salesData, distributionData, categoricalData, correlationData] = await Promise.all([
    getSalesData(),
    getDistributionData(),
    getCategoricalData(),
    getCorrelationData(),
  ]);
  
  return {
    salesData,
    distributionData,
    categoricalData,
    correlationData,
  };
});

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => await getChartData(),
});

function HomePage() {
  const chartData = Route.useLoaderData();
  
  return (
    <ThemeProvider>
      <ChartDashboard data={chartData} />
    </ThemeProvider>
  );
}
```

#### SSR Considerations for Theme

- **Initial Theme**: On server render, default to `'light'` theme to avoid hydration mismatch
- **Hydration**: After hydration, detect system preference and update theme
- **Persistence**: Store user's manual theme preference in localStorage

```typescript
// In ThemeProvider, handle SSR gracefully:
const [systemTheme, setSystemTheme] = useState<AppTheme>('light'); // SSR-safe default

useEffect(() => {
  // Only detect system preference on client
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
  
  // ... listener setup
}, []);
```
```

---

## 4. Chart Types Implementation

### 4.1 Supported Chart Types

| Chart Type | Data Requirements | Use Case |
|------------|-------------------|----------|
| Line | Time-series or sequential | Trends over time |
| Bar/Column | Categorical + numeric | Category comparison |
| Pie/Donut | Categorical + numeric | Part-to-whole |
| Scatter | Two numeric dimensions | Correlation analysis |
| Radar | Multi-dimensional | Multi-metric comparison |
| Heatmap | Matrix data | Density visualization |
| Area | Time-series | Volume trends |
| Histogram | Single numeric | Distribution |

### 4.2 Chart Component Interface

```typescript
interface ChartProps<T = unknown> {
  data: T[];
  config?: ChartConfig;
  className?: string;
  style?: React.CSSProperties;
  onChartReady?: (instance: EChartsInstance) => void;
}

interface ChartConfig {
  title?: string;
  subtitle?: string;
  xAxisKey?: string;
  yAxisKey?: string | string[];
  seriesKeys?: string[];
  smooth?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
  aspectRatio?: number;
}
```

### 4.3 Base Chart Container

```typescript
// src/components/charts/core/ChartContainer.tsx
import { useRef, useEffect, useId } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { EChartsInstance } from '@/types/theme.types';

interface ChartContainerProps {
  option: EChartsOption;
  className?: string;
  style?: React.CSSProperties;
  notMerge?: boolean;
  lazyUpdate?: boolean;
  onChartReady?: (instance: EChartsInstance) => void;
}

export function ChartContainer({
  option,
  className,
  style,
  notMerge = false,
  lazyUpdate = true,
  onChartReady,
}: ChartContainerProps) {
  const { echartsTheme, registerChart, unregisterChart } = useAppTheme();
  const chartRef = useRef<ReactECharts>(null);
  const chartId = useId();
  
  useEffect(() => {
    const instance = chartRef.current?.getEchartsInstance();
    if (instance) {
      registerChart(chartId, instance);
      onChartReady?.(instance);
    }
    return () => unregisterChart(chartId);
  }, [chartId, registerChart, unregisterChart, onChartReady]);
  
  return (
    <div className={`w-full h-full ${className ?? ''}`} style={style}>
      <ReactECharts
        ref={chartRef}
        option={option}
        theme={echartsTheme}
        notMerge={notMerge}
        lazyUpdate={lazyUpdate}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}
```

**Key Features:**
- Uses `useId()` for unique chart registration (React 18+)
- Registers with theme provider on mount for dynamic theme updates
- Receives `echartsTheme` from context (already mapped from RSuite theme)
- Cleans up registration on unmount

---

## 5. Demo Data Specifications

### 5.1 Sales Time-Series Data

**Location:** `src/data/demo.sales-data.ts`

```typescript
export interface SalesDataPoint {
  date: string;      // ISO date format
  revenue: number;
  orders: number;
  avgOrderValue: number;
  region?: string;
}

// 365 days of sales data for multiple regions
export const getSalesData = createServerFn({
  method: 'GET',
}).handler(async (): Promise<SalesDataPoint[]> => {
  // Generate realistic sales data
});
```

### 5.2 Distribution Data

**Location:** `src/data/demo.distribution-data.ts`

```typescript
export interface DistributionDataPoint {
  value: number;
  category?: string;
}

// Customer age distribution, order value distribution
export const getDistributionData = createServerFn({
  method: 'GET',
}).handler(async () => ({
  ageDistribution: [...],
  orderValueDistribution: [...],
}));
```

### 5.3 Categorical Data

**Location:** `src/data/demo.categorical-data.ts`

```typescript
export interface CategoryDataPoint {
  category: string;
  value: number;
  subCategory?: string;
}

// Product categories, regional sales
export const getCategoricalData = createServerFn({
  method: 'GET',
}).handler(async () => ({
  productCategories: [...],
  regionalSales: [...],
}));
```

### 5.4 Correlation Data

**Location:** `src/data/demo.correlation-data.ts`

```typescript
export interface CorrelationDataPoint {
  x: number;
  y: number;
  size?: number;
  category?: string;
}

// Price vs. sales, ad spend vs. revenue
export const getCorrelationData = createServerFn({
  method: 'GET',
}).handler(async () => ({
  priceVsSales: [...],
  adSpendVsRevenue: [...],
}));
```

---

## 6. Tailwind CSS Integration

### 6.1 Chart Component Styling

```typescript
// Tailwind utility classes for chart components
const chartStyles = {
  container: 'relative w-full rounded-xl overflow-hidden shadow-lg',
  header: 'absolute top-4 left-4 z-10',
  title: 'text-lg font-semibold text-slate-800 dark:text-slate-200',
  subtitle: 'text-sm text-slate-500 dark:text-slate-400',
  loading: 'absolute inset-0 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80',
  error: 'absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20',
};
```

### 6.2 Dashboard Layout

```typescript
// Grid layout for chart dashboard
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  {charts.map(chart => (
    <div 
      key={chart.id}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl shadow-lg',
        'border border-slate-200 dark:border-slate-700',
        'aspect-[4/3] min-h-[300px]',
        chart.fullWidth && 'md:col-span-2 lg:col-span-3',
      )}
    >
      <ChartContainer {...chart} />
    </div>
  ))}
</div>
```

### 6.3 Theme-Aware Styling

```typescript
// Dark mode responsive styles
const themeStyles = {
  light: {
    background: 'bg-slate-50',
    card: 'bg-white border-slate-200',
    text: 'text-slate-800',
    muted: 'text-slate-500',
  },
  dark: {
    background: 'bg-slate-900',
    card: 'bg-slate-800 border-slate-700',
    text: 'text-slate-100',
    muted: 'text-slate-400',
  },
};
```

---

## 7. Type Definitions

### 7.1 Core Chart Types

**Location:** `src/types/chart.types.ts`

```typescript
export type ChartType = 
  | 'line' 
  | 'bar' 
  | 'pie' 
  | 'scatter' 
  | 'radar' 
  | 'heatmap' 
  | 'area'
  | 'histogram';

export type DataType = 
  | 'time-series' 
  | 'categorical' 
  | 'numerical-pair' 
  | 'hierarchical' 
  | 'multi-dimensional' 
  | 'distribution';

export interface ChartDefinition {
  id: string;
  type: ChartType;
  title: string;
  data: unknown[];
  config: ChartConfig;
}

export interface GridPosition {
  row: number;
  col: number;
  rowSpan?: number;
  colSpan?: number;
}

export interface MultiChartConfig {
  rows: number;
  cols: number;
  gap: number;
  charts: (ChartDefinition & GridPosition)[];
}
```

### 7.2 Theme Types

**Location:** `src/types/theme.types.ts`

```typescript
import type { ECharts } from 'echarts';

// RSuite supported themes
export type AppTheme = 'light' | 'dark' | 'high-contrast';

// Theme source - automatic from system or manual override
export type ThemeSource = 'system' | 'manual';

// ECharts theme names (mapped from AppTheme)
export type EChartsThemeName = 'default' | 'dark';

// Type alias for ECharts instance
export type EChartsInstance = ECharts;

// Theme context value provided by ThemeProvider
export interface ThemeContextValue {
  // Current active theme (resolved from system or manual)
  theme: AppTheme;
  
  // Whether theme is from system preference or manual selection
  themeSource: ThemeSource;
  
  // Set theme manually (switches to manual mode)
  setTheme: (theme: AppTheme) => void;
  
  // Switch between system and manual modes
  setThemeSource: (source: ThemeSource) => void;
  
  // Mapped theme for ECharts (light->'default', dark/high-contrast->'dark')
  echartsTheme: EChartsThemeName;
  
  // Registry of ECharts instances for theme synchronization
  chartInstances: Map<string, EChartsInstance>;
  
  // Register a chart instance for theme updates
  registerChart: (id: string, instance: EChartsInstance) => void;
  
  // Unregister a chart instance (cleanup)
  unregisterChart: (id: string) => void;
}

// Theme state for persistence
export interface ThemeState {
  source: ThemeSource;
  manualTheme: AppTheme;
}
```

---

## 8. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

1. **Setup TypeScript types**
   - Define all chart and data types
   - Create inference result interfaces
   
2. **Implement data type inference engine**
   - Column type detection
   - Pattern matching for time-series, categorical, etc.
   - Confidence scoring
   
3. **Create theme system**
   - Theme context provider
   - System dark mode hook
   - Chart instance registration

### Phase 2: Chart Components (Week 2)

1. **Base chart container**
   - ReactECharts wrapper with theme support
   - Loading and error states
   
2. **Individual chart types**
   - Line chart with option generator
   - Bar chart with option generator
   - Pie chart with option generator
   - Scatter chart with option generator
   
3. **Option generators**
   - Type-safe option building
   - Inference-based configuration

### Phase 3: Composition & Layout (Week 3)

1. **Matrix grid layout**
   - Grid positioning calculations
   - Multi-chart composition
   
2. **Chart dashboard layout**
   - Responsive grid with Tailwind
   - Sidebar with theme controls
   
3. **RSuite theme panel**
   - System/manual toggle
   - Theme button group

### Phase 4: SSR & Demo Data (Week 4)

1. **SSR implementation**
   - Server functions for data fetching
   - Route loader configuration
   
2. **Demo data generation**
   - Sales time-series data
   - Distribution data
   - Categorical data
   - Correlation data
   
3. **Index route replacement**
   - Full SSR dashboard
   - All chart types demonstrated

### Phase 5: Testing & Polish (Week 5)

1. **Testing**
   - Data type inference tests
   - Chart rendering tests
   - Theme switching tests
   
2. **Documentation**
   - Component usage examples
   - Configuration options
   
3. **Performance optimization**
   - Lazy loading
   - Memoization

---

## 9. Verification Checklist

### Functional Requirements

- [ ] Accept arbitrary data input from users
- [ ] Dynamically infer data types from provided data
- [ ] Automatically apply appropriate typing for correct ECharts rendering
- [ ] Integrate seamlessly with React applications
- [ ] Support Tailwind CSS for styling components
- [ ] SSR mode for data fetching on server
- [ ] Replace `/index.tsx` with SSR-enabled implementation
- [ ] ECharts 6 theme system with `setTheme` API
- [ ] System dark mode detection using `matchMedia`
- [ ] Manual theme override via RSuite Panel in sidebar
- [ ] Matrix grid layout for chart composition
- [ ] All chart types composable in desired layout

### RSuite Theme Integration Requirements

- [ ] Use RSuite `CustomProvider` for theme management (not manual event listeners)
- [ ] Support all three RSuite themes: `light`, `dark`, `high-contrast`
- [ ] Theme provider wraps entire application
- [ ] RSuite CSS variables used for consistent styling
- [ ] Theme control panel uses RSuite `Panel`, `Toggle`, `RadioGroup` components
- [ ] ECharts theme synchronized with RSuite theme
- [ ] System preference detection with manual override capability

### ECharts Custom Series Requirements

- [ ] Install and register `@echarts-x/custom-violin`
- [ ] Install and register `@echarts-x/custom-contour`
- [ ] Install and register `@echarts-x/custom-bar-range`
- [ ] Install and register `@echarts-x/custom-line-range`
- [ ] Install and register `@echarts-x/custom-stage`
- [ ] Install and register `@echarts-x/custom-segmented-doughnut`
- [ ] Install and register `@echarts-x/custom-liquid-fill`
- [ ] Custom series usable via `type: 'custom'` + `renderItem: '<name>'`

### Matrix Composition Requirements

- [ ] Matrix coordinate system for responsive grid layout
- [ ] Multiple grids composable in single ECharts instance
- [ ] Media queries for responsive layouts (mobile/desktop)
- [ ] Section-based composition pattern
- [ ] React components that generate section configurations
- [ ] Mixed series types in one chart (line, bar, custom, etc.)
- [ ] Grid-series binding via `gridId`, `xAxisId`, `yAxisId`
- [ ] **Simplified MediaDefinitions Builder** with ASCII template syntax
- [ ] `useMatrixLayout` hook for easy template-to-mediaDefinitions conversion
- [ ] Matrix layout presets (dashboard, comparison, grid2x2, grid3x3)

### Dashboard Layout Requirements

- [ ] `DashboardGrid` - Simple auto-layout with columns prop
- [ ] `DashboardLayout` - CSS Grid template-areas syntax
- [ ] `ResponsiveDashboardLayout` - Breakpoint-based templates
- [ ] `LayoutItem` - Grid area positioning component
- [ ] `KPICard` - RSuite-based KPI component
- [ ] Layout presets for common patterns (analytics, report, comparison, monitoring)
- [ ] `useMediaQuery` hook for responsive detection
- [ ] Mix ECharts and non-chart React components in same layout
- [ ] RSuite Panel/Card integration in layouts

### Technical Requirements

- [ ] Type-safe TypeScript implementation
- [ ] echarts-for-react integration
- [ ] ECharts 6 features (setTheme, matrix coordinate system, custom series)
- [ ] RSuite 6 `CustomProvider` and CSS variables
- [ ] Tailwind CSS 4 styling with RSuite variable bridges
- [ ] TanStack Start SSR with loaders
- [ ] Demo data in `src/data/` directory

### Quality Requirements

- [ ] Clean, maintainable code structure
- [ ] Comprehensive type definitions
- [ ] Responsive design
- [ ] Accessible components (high-contrast theme support)
- [ ] Performance optimized
- [ ] SSR hydration handled correctly (no theme flash)

---

## 10. API Reference

### ChartContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `option` | `EChartsOption` | required | ECharts configuration object |
| `className` | `string` | - | Additional CSS classes for wrapper |
| `style` | `CSSProperties` | - | Inline styles for wrapper |
| `notMerge` | `boolean` | `false` | Replace options instead of merge |
| `lazyUpdate` | `boolean` | `true` | Lazy option updates for performance |
| `onChartReady` | `(instance: EChartsInstance) => void` | - | Callback when chart is ready |

**Note:** Chart ID is auto-generated using `useId()`. Chart registration with the theme provider is handled internally.

### useDataTypeInference Hook

```typescript
const inference = useDataTypeInference(data);
// Returns: InferenceResult
```

### useAppTheme Hook

```typescript
const { 
  theme,           // 'light' | 'dark' | 'high-contrast'
  themeSource,     // 'system' | 'manual'
  setTheme,        // (theme: AppTheme) => void
  setThemeSource,  // (source: ThemeSource) => void
  echartsTheme,    // 'default' | 'dark'
  registerChart,   // (id: string, instance: EChartsInstance) => void
  unregisterChart  // (id: string) => void
} = useAppTheme();
```

### ThemeControlPanel Component

Self-contained component using `useAppTheme` hook internally. No props required.

```typescript
import { ThemeControlPanel } from '@/components/controls/ThemeControlPanel';

// Usage in sidebar
<ThemeControlPanel />
```

**Features:**
- Toggle between system and manual theme modes
- RadioGroup for light/dark/high-contrast selection (when in manual mode)
- Current theme display
- Uses RSuite `Panel`, `Toggle`, `RadioGroup`, `Radio`, `Stack`, `Text` components

### ThemeProvider Component

Root-level provider that wraps RSuite's `CustomProvider`.

```typescript
import { ThemeProvider } from '@/providers/ThemeProvider';

// In route component
function App() {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

**Features:**
- Wraps RSuite `CustomProvider` with dynamic theme prop
- Manages system preference detection
- Provides theme context to all children
- Automatically syncs ECharts instances with theme changes

---

## 11. CSS Integration

### RSuite CSS Setup

Import RSuite styles before Tailwind to allow proper cascading:

```css
/* src/styles.css */

/* RSuite base styles (includes all theme CSS variables) */
@import 'rsuite/dist/rsuite.css';

/* Tailwind CSS */
@import 'tailwindcss';

/* Custom utilities bridging RSuite variables */
@layer utilities {
  /* Background utilities using RSuite variables */
  .bg-rs-body { background-color: var(--rs-body); }
  .bg-rs-card { background-color: var(--rs-bg-card); }
  .bg-rs-overlay { background-color: var(--rs-bg-overlay); }
  .bg-rs-well { background-color: var(--rs-bg-well); }
  
  /* Text utilities using RSuite variables */
  .text-rs-primary { color: var(--rs-text-primary); }
  .text-rs-secondary { color: var(--rs-text-secondary); }
  .text-rs-tertiary { color: var(--rs-text-tertiary); }
  .text-rs-heading { color: var(--rs-text-heading); }
  .text-rs-link { color: var(--rs-text-link); }
  
  /* Border utilities using RSuite variables */
  .border-rs-primary { border-color: var(--rs-border-primary); }
  .border-rs-secondary { border-color: var(--rs-border-secondary); }
  
  /* Shadow utilities using RSuite variables */
  .shadow-rs-sm { box-shadow: var(--rs-shadow-sm); }
  .shadow-rs-md { box-shadow: var(--rs-shadow-md); }
  .shadow-rs-lg { box-shadow: var(--rs-shadow-lg); }
}
```

### Theme-Responsive Styling

RSuite automatically updates CSS variables when theme changes. Components using these variables will automatically respond:

```tsx
// This component automatically adapts to theme changes
function ChartCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-rs-card border border-rs-primary rounded-lg shadow-rs-md p-4">
      <div className="text-rs-heading font-semibold mb-2">Chart Title</div>
      <div className="text-rs-secondary text-sm">Subtitle</div>
      {children}
    </div>
  );
}
```

---

## 12. Dependencies Configuration

All required packages are already in `package.json`, plus the new custom series packages:

**Existing:**
- `echarts: ^6.0.0` ✓
- `echarts-for-react: ^3.0.5` ✓
- `rsuite: ^6.1.1` ✓
- `tailwindcss: ^4.0.6` ✓
- `@tanstack/react-start: ^1.132.0` ✓

**New - ECharts Custom Series (to be added):**
```bash
pnpm add @echarts-x/custom-violin @echarts-x/custom-contour @echarts-x/custom-bar-range @echarts-x/custom-line-range @echarts-x/custom-stage @echarts-x/custom-segmented-doughnut @echarts-x/custom-liquid-fill
```

| Package | Description | Use Case |
|---------|-------------|----------|
| `@echarts-x/custom-violin` | Violin chart for distribution | Statistical analysis |
| `@echarts-x/custom-contour` | Contour/density chart | Heat distribution |
| `@echarts-x/custom-bar-range` | Bar with min/max range | Range comparison |
| `@echarts-x/custom-line-range` | Line with confidence interval | Trend with uncertainty |
| `@echarts-x/custom-stage` | Stage/funnel progression | Sleep stages, workflows |
| `@echarts-x/custom-segmented-doughnut` | Segmented doughnut | Multi-level proportions |
| `@echarts-x/custom-liquid-fill` | Liquid fill gauge | Progress indicators |

---

## 13. ECharts Custom Series Integration

### 13.1 Custom Series Registration

**Location:** `src/lib/customSeries/index.ts`

ECharts 6 supports reusable custom series that can be registered and used via `renderItem`. The custom series packages use `echarts.use()` for registration:

```typescript
// src/lib/customSeries/index.ts
import * as echarts from 'echarts';

// Import custom series installers
import violinInstaller from '@echarts-x/custom-violin';
import contourInstaller from '@echarts-x/custom-contour';
import barRangeInstaller from '@echarts-x/custom-bar-range';
import lineRangeInstaller from '@echarts-x/custom-line-range';
import stageInstaller from '@echarts-x/custom-stage';
import segmentedDoughnutInstaller from '@echarts-x/custom-segmented-doughnut';
import liquidFillInstaller from '@echarts-x/custom-liquid-fill';

// Register all custom series
export function registerCustomSeries() {
  echarts.use(violinInstaller);
  echarts.use(contourInstaller);
  echarts.use(barRangeInstaller);
  echarts.use(lineRangeInstaller);
  echarts.use(stageInstaller);
  echarts.use(segmentedDoughnutInstaller);
  echarts.use(liquidFillInstaller);
}

// Export available custom series types
export const CUSTOM_SERIES_TYPES = [
  'violin',
  'contour', 
  'barRange',
  'lineRange',
  'stage',
  'segmentedDoughnut',
  'liquidFill',
] as const;

export type CustomSeriesType = typeof CUSTOM_SERIES_TYPES[number];
```

### 13.2 Using Custom Series in Components

```typescript
// src/components/charts/types/ViolinChart.tsx
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useAppTheme } from '@/providers/ThemeProvider';

interface ViolinChartProps {
  data: number[][];
  categories: string[];
  title?: string;
}

export function ViolinChart({ data, categories, title }: ViolinChartProps) {
  const { echartsTheme } = useAppTheme();
  
  const option: EChartsOption = {
    title: title ? { text: title } : undefined,
    xAxis: {
      type: 'category',
      data: categories,
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      type: 'custom',
      renderItem: 'violin', // Registered custom renderItem
      coordinateSystem: 'cartesian2d',
      data: data.map((values, idx) => ({
        name: categories[idx],
        value: values,
      })),
    }],
  };
  
  return <ReactECharts option={option} theme={echartsTheme} />;
}
```

### 13.3 Available Custom Series

| Series Type | renderItem Value | Data Format | Description |
|-------------|------------------|-------------|-------------|
| Violin | `'violin'` | `number[][]` (arrays of values per category) | Distribution visualization |
| Contour | `'contour'` | `[x, y, density][]` | 2D density visualization |
| Bar Range | `'barRange'` | `[category, min, max][]` | Bar with min/max bounds |
| Line Range | `'lineRange'` | `[x, yLow, yHigh][]` | Line with confidence interval |
| Stage | `'stage'` | `[start, end, category][]` | Stage/timeline progression |
| Segmented Doughnut | `'segmentedDoughnut'` | Hierarchical segments | Multi-level pie/doughnut |
| Liquid Fill | `'liquidFill'` | `number` (0-1) | Animated fill gauge |

---

## 14. Dashboard Layout System

The dashboard system provides **three layout abstraction levels** that support both ECharts visualizations AND non-chart React components (like RSuite Cards for KPIs) in a unified grid.

### 14.1 Layout System Overview

| Component | Complexity | Best For | Supports React Components |
|-----------|------------|----------|---------------------------|
| `DashboardGrid` | Low | Quick equal grids | ✅ Yes |
| `DashboardLayout` | Medium | CSS-Grid style templates | ✅ Yes |
| `MatrixChart` | High | Full responsive ECharts-only | ❌ ECharts only |

### 14.1.1 Two-Level Architecture Diagram

The following diagram shows how CSS Layout (Level 1) can contain both ECharts instances and React components, while ECharts Matrix (Level 2) is used optionally for multi-chart canvases:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LEVEL 1: CSS Layout System                               │
│              (DashboardGrid / DashboardLayout / Responsive)                 │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ LayoutItem   │  │ LayoutItem   │  │ LayoutItem   │  │ LayoutItem   │    │
│  │              │  │              │  │              │  │              │    │
│  │  KPICard     │  │  KPICard     │  │  KPICard     │  │  KPICard     │    │
│  │  (RSuite)    │  │  (RSuite)    │  │  (RSuite)    │  │  (RSuite)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────┐  ┌────────────────────┐   │
│  │ LayoutItem (Main Content Area)              │  │ LayoutItem         │   │
│  │                                             │  │                    │   │
│  │  ╔═══════════════════════════════════════╗  │  │   RSuite Panel     │   │
│  │  ║  OPTION A: Single ECharts Instance    ║  │  │   (Sidebar)        │   │
│  │  ║  ┌─────────────┬─────────────────────┐║  │  │                    │   │
│  │  ║  │ Grid 1      │ Grid 2              │║  │  │   - Stats List     │   │
│  │  ║  │ LineChart   │ BarChart            │║  │  │   - Activity Feed  │   │
│  │  ║  │             │                     │║  │  │   - Any React      │   │
│  │  ║  ├─────────────┴─────────────────────┤║  │  │     Component      │   │
│  │  ║  │ Grid 3                            │║  │  │                    │   │
│  │  ║  │ ViolinChart (custom series)       │║  │  │                    │   │
│  │  ║  └───────────────────────────────────┘║  │  │                    │   │
│  │  ║  (All charts share one canvas,       ║  │  │                    │   │
│  │  ║   can have linked tooltips/zoom)     ║  │  │                    │   │
│  │  ╚═══════════════════════════════════════╝  │  │                    │   │
│  │                                             │  │                    │   │
│  └─────────────────────────────────────────────┘  └────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ LayoutItem (Footer Charts)                                          │   │
│  │                                                                      │   │
│  │  ╔═════════════════════╗  ╔═════════════════════╗  ╔═══════════════╗│   │
│  │  ║ OPTION B:           ║  ║ OPTION B:           ║  ║ OPTION B:     ║│   │
│  │  ║ ECharts Instance 1  ║  ║ ECharts Instance 2  ║  ║ ECharts 3     ║│   │
│  │  ║ ┌─────────────────┐ ║  ║ ┌─────────────────┐ ║  ║ ┌───────────┐ ║│   │
│  │  ║ │    PieChart     │ ║  ║ │   ScatterChart  │ ║  ║ │  Gauge    │ ║│   │
│  │  ║ └─────────────────┘ ║  ║ └─────────────────┘ ║  ║ └───────────┘ ║│   │
│  │  ╚═════════════════════╝  ╚═════════════════════╝  ╚═══════════════╝│   │
│  │  (Separate instances,                                               │   │
│  │   independent interactions)                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Legend:**
- **Level 1 (CSS Layout)**: `DashboardGrid`, `DashboardLayout`, `ResponsiveDashboardLayout`
  - Can contain: ECharts instances, RSuite components, any React component
- **Level 2 (ECharts Matrix)**: Single ECharts canvas with multiple grids
  - Used when: Charts need linked interactions (shared tooltip, synchronized zoom)
  - Configured via: `mediaDefinitions` or simplified ASCII templates (`useMatrixLayout`)

**When to Use Each Approach:**

| Approach | Use When | Benefits | Trade-offs |
|----------|----------|----------|------------|
| **Option A**: Single ECharts with matrix | Charts need linked interactions | Shared canvas, coordinated behaviors | All must be ECharts, complex config |
| **Option B**: Multiple ECharts instances | Charts are independent | Simpler setup, mix any components | No shared interactions |

### 14.2 DashboardGrid - Simple Auto Layout

**Location:** `src/components/layout/DashboardGrid.tsx`

The simplest option - auto-arranges items in a grid. Supports both charts and React components.

```typescript
// src/components/layout/DashboardGrid.tsx
import { Children, ReactNode, isValidElement } from 'react';

interface DashboardGridProps {
  children: ReactNode;
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number | string;
  rowHeight?: number | string;
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 2,
  gap = 16,
  rowHeight = 'auto',
  className,
}: DashboardGridProps) {
  // Responsive columns
  const colClass = typeof columns === 'number'
    ? `grid-cols-${columns}`
    : `grid-cols-1 sm:grid-cols-${columns.sm ?? 1} md:grid-cols-${columns.md ?? 2} lg:grid-cols-${columns.lg ?? 3}`;
  
  return (
    <div 
      className={`grid ${colClass} ${className ?? ''}`}
      style={{ gap, gridAutoRows: rowHeight }}
    >
      {Children.map(children, (child) => (
        <div className="min-h-[200px]">
          {child}
        </div>
      ))}
    </div>
  );
}
```

**Usage - Mixing Charts and KPI Cards:**

```typescript
import { DashboardGrid } from '@/components/layout/DashboardGrid';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { KPICard } from '@/components/ui/KPICard';

function Dashboard() {
  return (
    <DashboardGrid columns={{ sm: 1, md: 2, lg: 4 }} gap={16}>
      {/* KPI Cards (RSuite-based) */}
      <KPICard title="Revenue" value="$1.2M" change="+12%" />
      <KPICard title="Users" value="45,231" change="+8%" />
      <KPICard title="Orders" value="1,234" change="-3%" />
      <KPICard title="Conversion" value="3.2%" change="+0.5%" />
      
      {/* Charts */}
      <LineChart data={salesData} title="Sales Trend" />
      <BarChart data={categoryData} title="By Category" />
      <PieChart data={shareData} title="Market Share" />
    </DashboardGrid>
  );
}
```

### 14.3 DashboardLayout - CSS Grid Template Style

**Location:** `src/components/layout/DashboardLayout.tsx`

Medium complexity - uses CSS Grid template areas for precise positioning. Supports both charts and React components.

```typescript
// src/components/layout/DashboardLayout.tsx
import { ReactNode, Children, isValidElement, cloneElement } from 'react';

interface LayoutTemplate {
  areas: string;           // CSS grid-template-areas string
  columns?: string[];      // Column sizes (e.g., ['200px', '1fr', '1fr'])
  rows?: string[];         // Row sizes (e.g., ['80px', '1fr', '60px'])
  gap?: number | string;
}

interface DashboardLayoutProps {
  template: LayoutTemplate;
  children: ReactNode;
  className?: string;
}

interface LayoutItemProps {
  area: string;            // Grid area name
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ template, children, className }: DashboardLayoutProps) {
  const gridStyle = {
    display: 'grid',
    gridTemplateAreas: template.areas,
    gridTemplateColumns: template.columns?.join(' ') ?? '1fr',
    gridTemplateRows: template.rows?.join(' ') ?? 'auto',
    gap: template.gap ?? 16,
  };
  
  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
}

export function LayoutItem({ area, children, className }: LayoutItemProps) {
  return (
    <div style={{ gridArea: area }} className={className}>
      {children}
    </div>
  );
}
```

**Usage - Complex Dashboard with KPIs and Charts:**

```typescript
import { DashboardLayout, LayoutItem } from '@/components/layout/DashboardLayout';
import { LineChart, BarChart, ViolinChart } from '@/components/charts';
import { KPICard, KPIRow } from '@/components/ui/KPICard';
import { Panel } from 'rsuite';

function AnalyticsDashboard() {
  const template = {
    areas: `
      "kpi1    kpi2    kpi3    kpi4"
      "main    main    main    sidebar"
      "main    main    main    sidebar"
      "chart1  chart1  chart2  chart2"
      "footer  footer  footer  footer"
    `,
    columns: ['1fr', '1fr', '1fr', '300px'],
    rows: ['100px', '1fr', '1fr', '300px', '60px'],
    gap: 16,
  };
  
  return (
    <DashboardLayout template={template} className="h-screen p-4 bg-rs-body">
      {/* KPI Cards in top row */}
      <LayoutItem area="kpi1">
        <KPICard title="Revenue" value="$1.2M" change="+12%" icon={<DollarSign />} />
      </LayoutItem>
      <LayoutItem area="kpi2">
        <KPICard title="Users" value="45,231" change="+8%" icon={<Users />} />
      </LayoutItem>
      <LayoutItem area="kpi3">
        <KPICard title="Orders" value="1,234" change="-3%" icon={<ShoppingCart />} />
      </LayoutItem>
      <LayoutItem area="kpi4">
        <KPICard title="Conversion" value="3.2%" change="+0.5%" icon={<TrendingUp />} />
      </LayoutItem>
      
      {/* Main chart area */}
      <LayoutItem area="main" className="bg-rs-card rounded-lg shadow-rs-md">
        <LineChart data={salesData} title="Revenue Over Time" />
      </LayoutItem>
      
      {/* Sidebar with RSuite Panel */}
      <LayoutItem area="sidebar">
        <Panel header="Quick Stats" bordered shaded className="h-full">
          <StatsList data={statsData} />
        </Panel>
      </LayoutItem>
      
      {/* Bottom charts */}
      <LayoutItem area="chart1" className="bg-rs-card rounded-lg shadow-rs-md">
        <BarChart data={categoryData} title="Sales by Category" />
      </LayoutItem>
      <LayoutItem area="chart2" className="bg-rs-card rounded-lg shadow-rs-md">
        <ViolinChart data={distributionData} title="Distribution" />
      </LayoutItem>
      
      {/* Footer */}
      <LayoutItem area="footer" className="flex items-center justify-between text-rs-secondary">
        <span>Last updated: 5 minutes ago</span>
        <span>Data source: Analytics API</span>
      </LayoutItem>
    </DashboardLayout>
  );
}
```

### 14.4 KPICard Component (RSuite-based)

**Location:** `src/components/ui/KPICard.tsx`

```typescript
import { Panel, Stack, Text } from 'rsuite';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  subtitle?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  subtitle,
}: KPICardProps) {
  // Auto-detect change type from string
  const detectedType = changeType === 'neutral' && change
    ? change.startsWith('+') ? 'positive' 
      : change.startsWith('-') ? 'negative' 
      : 'neutral'
    : changeType;
  
  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-rs-secondary',
  }[detectedType];
  
  const ChangeIcon = detectedType === 'positive' ? TrendingUp 
    : detectedType === 'negative' ? TrendingDown 
    : null;
  
  return (
    <Panel 
      bordered 
      shaded 
      className="h-full bg-rs-card hover:shadow-rs-lg transition-shadow"
    >
      <Stack direction="column" spacing={8}>
        <Stack justifyContent="space-between" alignItems="center">
          <Text size="sm" className="text-rs-secondary">{title}</Text>
          {icon && <span className="text-rs-tertiary">{icon}</span>}
        </Stack>
        
        <Text size="2xl" weight="bold" className="text-rs-heading">
          {value}
        </Text>
        
        {change && (
          <Stack spacing={4} alignItems="center">
            {ChangeIcon && <ChangeIcon size={14} className={changeColor} />}
            <Text size="sm" className={changeColor}>{change}</Text>
            {subtitle && (
              <Text size="xs" className="text-rs-tertiary">vs last period</Text>
            )}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
```

### 14.5 Responsive DashboardLayout with Breakpoints

**Location:** `src/components/layout/ResponsiveDashboardLayout.tsx`

For layouts that need to change at different breakpoints:

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DashboardLayout, LayoutItem } from './DashboardLayout';
import { ReactNode } from 'react';

interface ResponsiveTemplate {
  sm?: LayoutTemplate;  // < 640px
  md?: LayoutTemplate;  // 640px - 1024px
  lg: LayoutTemplate;   // > 1024px (default)
}

interface ResponsiveDashboardLayoutProps {
  templates: ResponsiveTemplate;
  children: ReactNode;
  className?: string;
}

export function ResponsiveDashboardLayout({ 
  templates, 
  children, 
  className 
}: ResponsiveDashboardLayoutProps) {
  const isSmall = useMediaQuery('(max-width: 639px)');
  const isMedium = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  
  const activeTemplate = isSmall && templates.sm 
    ? templates.sm 
    : isMedium && templates.md 
    ? templates.md 
    : templates.lg;
  
  return (
    <DashboardLayout template={activeTemplate} className={className}>
      {children}
    </DashboardLayout>
  );
}
```

**Usage with responsive templates:**

```typescript
const templates = {
  sm: {
    areas: `
      "kpi"
      "main"
      "sidebar"
      "chart"
    `,
    columns: ['1fr'],
    rows: ['100px', '300px', '200px', '300px'],
  },
  md: {
    areas: `
      "kpi     kpi"
      "main    sidebar"
      "chart   chart"
    `,
    columns: ['1fr', '300px'],
    rows: ['100px', '1fr', '300px'],
  },
  lg: {
    areas: `
      "kpi1  kpi2  kpi3  kpi4"
      "main  main  main  sidebar"
      "chart chart chart sidebar"
    `,
    columns: ['1fr', '1fr', '1fr', '300px'],
    rows: ['100px', '1fr', '300px'],
  },
};

<ResponsiveDashboardLayout templates={templates}>
  <LayoutItem area="kpi1"><KPICard ... /></LayoutItem>
  {/* Items automatically hide/show based on template */}
</ResponsiveDashboardLayout>
```

### 14.6 Layout Presets

**Location:** `src/lib/layoutPresets.ts`

Pre-built layout templates for common dashboard patterns:

```typescript
export const LAYOUT_PRESETS = {
  // Analytics dashboard: KPIs + main chart + sidebar
  analytics: {
    areas: `
      "kpi1  kpi2  kpi3  kpi4"
      "main  main  main  side"
      "main  main  main  side"
    `,
    columns: ['1fr', '1fr', '1fr', '280px'],
    rows: ['100px', '1fr', '1fr'],
    gap: 16,
  },
  
  // Report: Header + 2-column content
  report: {
    areas: `
      "header header"
      "left   right"
      "left   right"
      "footer footer"
    `,
    columns: ['1fr', '1fr'],
    rows: ['80px', '1fr', '1fr', '60px'],
    gap: 16,
  },
  
  // Comparison: Side-by-side charts
  comparison: {
    areas: `
      "title  title"
      "chart1 chart2"
      "chart1 chart2"
    `,
    columns: ['1fr', '1fr'],
    rows: ['60px', '1fr', '1fr'],
    gap: 24,
  },
  
  // Monitoring: KPI grid + large chart
  monitoring: {
    areas: `
      "kpi1 kpi2 kpi3 kpi4 kpi5 kpi6"
      "main main main main main main"
      "main main main main main main"
    `,
    columns: Array(6).fill('1fr'),
    rows: ['120px', '1fr', '1fr'],
    gap: 12,
  },
} as const;

export type LayoutPresetName = keyof typeof LAYOUT_PRESETS;
```

**Usage with presets:**

```typescript
import { DashboardLayout, LayoutItem } from '@/components/layout';
import { LAYOUT_PRESETS } from '@/lib/layoutPresets';

function QuickDashboard() {
  return (
    <DashboardLayout template={LAYOUT_PRESETS.analytics}>
      <LayoutItem area="kpi1"><KPICard title="Revenue" value="$1.2M" /></LayoutItem>
      <LayoutItem area="kpi2"><KPICard title="Users" value="45K" /></LayoutItem>
      <LayoutItem area="kpi3"><KPICard title="Orders" value="1.2K" /></LayoutItem>
      <LayoutItem area="kpi4"><KPICard title="Conv" value="3.2%" /></LayoutItem>
      <LayoutItem area="main"><LineChart data={data} /></LayoutItem>
      <LayoutItem area="side"><ActivityFeed items={activities} /></LayoutItem>
    </DashboardLayout>
  );
}
```

### 14.7 useMediaQuery Hook

**Location:** `src/hooks/useMediaQuery.ts`

```typescript
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // SSR-safe: only run on client
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
}

// Convenience hooks for common breakpoints
export function useIsMobile() {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
```

### 14.8 Summary - When to Use Each Layout

| Layout | Use When | Supports |
|--------|----------|----------|
| **DashboardGrid** | Quick prototypes, equal-sized items, simple grids | Charts + React components |
| **DashboardLayout** | Custom positioning, fixed sidebars, complex layouts | Charts + React components |
| **ResponsiveDashboardLayout** | Different layouts per breakpoint | Charts + React components |
| **Layout Presets** | Common patterns (analytics, report, etc.) | Charts + React components |
| **MatrixChart** | ECharts-only, need single canvas, shared tooltips | ECharts series only |

---

## 15. ECharts Matrix Coordinate System (Advanced)

For ECharts-only compositions where you need all charts on a single canvas with shared interactions.

### 15.1 Matrix Grid Layout Overview

ECharts 6 introduces the **matrix coordinate system** that allows composing multiple charts and components in a grid layout, similar to CSS Grid. This enables:

- **Multiple grids** in a single ECharts instance
- **Responsive layouts** via media queries
- **Section-based composition** for complex dashboards

### 15.2 React Component for Matrix Composition

**Location:** `src/components/charts/composed/MatrixChart.tsx`

```typescript
// src/components/charts/composed/MatrixChart.tsx
import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useAppTheme } from '@/providers/ThemeProvider';

// Section definition for each chart area
interface SectionDefinition {
  id: string;
  option: Partial<EChartsOption>;
}

// Matrix cell coordinates [col, row] or [[colStart, colEnd], [rowStart, rowEnd]]
type MatrixCoord = [number | [number, number], number | [number, number]];

// Media query definition for responsive layouts
interface MediaDefinition {
  query?: { maxWidth?: number; minWidth?: number };
  matrix: {
    x: { data: null[] };
    y: { data: null[] };
  };
  sectionCoordMap: Record<string, MatrixCoord>;
}

interface MatrixChartProps {
  sections: SectionDefinition[];
  mediaDefinitions: MediaDefinition[];
  className?: string;
  style?: React.CSSProperties;
}

export function MatrixChart({ 
  sections, 
  mediaDefinitions, 
  className, 
  style 
}: MatrixChartProps) {
  const { echartsTheme, registerChart, unregisterChart } = useAppTheme();
  
  const option = useMemo<EChartsOption>(() => {
    // Base matrix configuration
    const baseOption: EChartsOption = {
      matrix: {
        x: { show: false, data: [] },
        y: { show: false, data: [] },
        body: { itemStyle: { borderColor: 'none' } },
        backgroundStyle: { borderColor: 'none' },
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      tooltip: {},
      // Will be populated by assembleOption
      media: [],
    };
    
    // Assemble sections into ECharts option
    return assembleMatrixOption(baseOption, sections, mediaDefinitions);
  }, [sections, mediaDefinitions]);
  
  return (
    <div className={className} style={style}>
      <ReactECharts 
        option={option} 
        theme={echartsTheme}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Utility to assemble sections into matrix layout
function assembleMatrixOption(
  option: EChartsOption,
  sections: SectionDefinition[],
  mediaDefinitions: MediaDefinition[]
): EChartsOption {
  // Build media array for responsive matrix
  option.media = mediaDefinitions.map(({ query, matrix }) => ({
    query,
    option: { matrix },
  }));
  
  // Process each section
  sections.forEach((section) => {
    const sectionOption = section.option;
    const optionIdMapWillSetCoord: Record<string, string[]> = {};
    
    // Merge section components into main option
    Object.keys(sectionOption).forEach((componentType) => {
      const key = componentType as keyof EChartsOption;
      option[key] = normalizeToArray(option[key]);
      
      normalizeToArray(sectionOption[key]).forEach((component: any) => {
        // Ensure component has ID
        if (!component.id) {
          component.id = `${section.id}_${componentType}_${Date.now()}`;
        }
        
        (option[key] as any[]).push(component);
        
        // Track components that use matrix coordinate system
        if (component.coordinateSystem === 'matrix') {
          optionIdMapWillSetCoord[componentType] = 
            optionIdMapWillSetCoord[componentType] || [];
          optionIdMapWillSetCoord[componentType].push(component.id);
        }
      });
    });
    
    // Set coordinates in media definitions
    mediaDefinitions.forEach((mediaDef, mediaIdx) => {
      const coord = mediaDef.sectionCoordMap[section.id];
      if (!coord) return;
      
      const mediaOption = option.media![mediaIdx].option as any;
      
      Object.keys(optionIdMapWillSetCoord).forEach((componentType) => {
        optionIdMapWillSetCoord[componentType].forEach((id) => {
          mediaOption[componentType] = mediaOption[componentType] || [];
          mediaOption[componentType].push({ id, coord });
        });
      });
    });
  });
  
  return option;
}

function normalizeToArray<T>(value: T | T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : value != null ? [value] : [];
}
```

### 15.3 Usage Example - Dashboard with Multiple Charts

```typescript
// Example: Creating a responsive dashboard
import { MatrixChart } from '@/components/charts/composed/MatrixChart';

function Dashboard() {
  // Define sections (each containing chart configuration)
  const sections = [
    {
      id: 'header_chart',
      option: {
        title: { 
          coordinateSystem: 'matrix', 
          text: 'Sales Overview',
          left: 'center' 
        },
        grid: { 
          id: 'header_grid', 
          coordinateSystem: 'matrix',
          top: 40, bottom: 20, left: 40, right: 20 
        },
        xAxis: { type: 'time', gridId: 'header_grid' },
        yAxis: { type: 'value', gridId: 'header_grid' },
        series: { 
          type: 'line', 
          xAxisIndex: 0, 
          yAxisIndex: 0, 
          data: salesData 
        },
      },
    },
    {
      id: 'sidebar_chart',
      option: {
        title: { 
          coordinateSystem: 'matrix', 
          text: 'By Category' 
        },
        grid: { 
          id: 'sidebar_grid', 
          coordinateSystem: 'matrix',
          top: 40, bottom: 20, left: 40, right: 20 
        },
        xAxis: { type: 'value', gridId: 'sidebar_grid' },
        yAxis: { type: 'category', gridId: 'sidebar_grid', data: categories },
        series: { 
          type: 'bar', 
          xAxisIndex: 1, 
          yAxisIndex: 1, 
          data: categoryData 
        },
      },
    },
    {
      id: 'main_chart',
      option: {
        title: { 
          coordinateSystem: 'matrix', 
          text: 'Distribution Analysis' 
        },
        grid: { 
          id: 'main_grid', 
          coordinateSystem: 'matrix',
          top: 50, bottom: 30, left: 50, right: 30 
        },
        xAxis: { type: 'category', gridId: 'main_grid' },
        yAxis: { type: 'value', gridId: 'main_grid' },
        series: { 
          type: 'custom', 
          renderItem: 'violin', // Custom series!
          xAxisIndex: 2, 
          yAxisIndex: 2, 
          data: distributionData 
        },
      },
    },
  ];
  
  // Define responsive layouts
  const mediaDefinitions = [
    {
      // Mobile: stacked layout
      query: { maxWidth: 600 },
      matrix: {
        x: { data: [null] },           // 1 column
        y: { data: Array(6).fill(null) }, // 6 rows
      },
      sectionCoordMap: {
        header_chart: [0, [0, 1]],
        sidebar_chart: [0, [2, 3]],
        main_chart: [0, [4, 5]],
      },
    },
    {
      // Desktop: grid layout (default)
      matrix: {
        x: { data: Array(4).fill(null) }, // 4 columns
        y: { data: Array(6).fill(null) }, // 6 rows
      },
      sectionCoordMap: {
        header_chart: [[0, 3], [0, 1]],    // Full width, top
        sidebar_chart: [0, [2, 5]],         // Left column
        main_chart: [[1, 3], [2, 5]],       // Right 3 columns
      },
    },
  ];
  
  return (
    <MatrixChart
      sections={sections}
      mediaDefinitions={mediaDefinitions}
      className="w-full h-[800px]"
    />
  );
}
```

### 15.4 Key Concepts: Composing Series in One ECharts Instance

**YES** - You can compose multiple series of different types in a single ECharts instance:

1. **Multiple Grids**: Each grid is a separate coordinate space
2. **Grid-Series Binding**: Use `gridId`, `xAxisId`, `yAxisId` to bind series to grids
3. **Matrix Coordinates**: Use `coordinateSystem: 'matrix'` + `coord` for positioning
4. **Mixed Series Types**: Combine line, bar, pie, scatter, AND custom series in one chart
5. **React Component Approach**: Build reusable components that output section configurations

```typescript
// You can mix ANY series types:
const option = {
  grid: [
    { id: 'grid1', ... },
    { id: 'grid2', ... },
  ],
  xAxis: [
    { gridId: 'grid1', ... },
    { gridId: 'grid2', ... },
  ],
  yAxis: [
    { gridId: 'grid1', ... },
    { gridId: 'grid2', ... },
  ],
  series: [
    { type: 'line', xAxisIndex: 0, yAxisIndex: 0, ... },
    { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, ... },
    { type: 'custom', renderItem: 'violin', xAxisIndex: 0, yAxisIndex: 0, ... },
    { type: 'custom', renderItem: 'lineRange', xAxisIndex: 1, yAxisIndex: 1, ... },
    { type: 'pie', center: ['50%', '50%'], ... }, // Pie doesn't need grid
  ],
};
```

### 15.5 React Component Builder Pattern

You can create React components that generate chart configurations, then compose them:

```typescript
// Chart section builder components
function LineChartSection({ id, data, title }: SectionProps) {
  return {
    id,
    option: {
      title: { coordinateSystem: 'matrix', text: title },
      grid: { id: `${id}_grid`, coordinateSystem: 'matrix' },
      xAxis: { type: 'time', gridId: `${id}_grid` },
      yAxis: { type: 'value', gridId: `${id}_grid` },
      series: { type: 'line', data },
    },
  };
}

function ViolinChartSection({ id, data, categories, title }: SectionProps) {
  return {
    id,
    option: {
      title: { coordinateSystem: 'matrix', text: title },
      grid: { id: `${id}_grid`, coordinateSystem: 'matrix' },
      xAxis: { type: 'category', data: categories, gridId: `${id}_grid` },
      yAxis: { type: 'value', gridId: `${id}_grid` },
      series: { type: 'custom', renderItem: 'violin', data },
    },
  };
}

// Compose in dashboard
function Dashboard({ salesData, distributionData }) {
  const sections = [
    LineChartSection({ id: 'sales', data: salesData, title: 'Sales Trend' }),
    ViolinChartSection({ id: 'dist', data: distributionData, categories, title: 'Distribution' }),
  ];
  
  return <MatrixChart sections={sections} mediaDefinitions={layouts} />;
}
```

---

## 16. Simplified MediaDefinitions Builder (Abstraction Layer)

This abstraction layer converts high-level, intuitive layout configurations into the complex `mediaDefinitions` format required by ECharts' matrix coordinate system.

### 16.1 High-Level Layout API

**Location:** `src/lib/matrixLayoutBuilder.ts`

#### Simple Layout Definition

```typescript
// Instead of complex mediaDefinitions, use this simple format:
const simpleLayout: SimpleMatrixLayout = {
  sections: ['header', 'sidebar', 'main', 'footer'],
  
  // Responsive breakpoints
  breakpoints: {
    mobile: {
      maxWidth: 600,
      template: `
        | header  |
        | sidebar |
        | main    |
        | footer  |
      `,
    },
    tablet: {
      minWidth: 601,
      maxWidth: 1024,
      template: `
        | header  | header  |
        | sidebar | main    |
        | footer  | footer  |
      `,
    },
    desktop: {
      // No constraints = default
      template: `
        | header  | header  | header  | header  |
        | sidebar | main    | main    | main    |
        | sidebar | main    | main    | main    |
        | footer  | footer  | footer  | footer  |
      `,
    },
  },
};
```

### 16.2 Type Definitions

```typescript
// src/types/matrixLayout.types.ts

export interface SimpleMatrixLayout {
  sections: string[];  // Section IDs that must appear in templates
  breakpoints: Record<string, BreakpointConfig>;
  gap?: number;  // Optional gap between cells (in percentage)
}

export interface BreakpointConfig {
  minWidth?: number;
  maxWidth?: number;
  template: string;  // ASCII grid template
}

// Parsed template cell
export interface TemplateCell {
  sectionId: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

// Output: ECharts-compatible mediaDefinition
export interface MediaDefinition {
  query?: { minWidth?: number; maxWidth?: number };
  matrix: {
    x: { data: null[] };
    y: { data: null[] };
  };
  sectionCoordMap: Record<string, MatrixCoord>;
}

export type MatrixCoord = [
  number | [number, number],
  number | [number, number]
];
```

### 16.3 Template Parser

```typescript
// src/lib/matrixLayoutBuilder.ts

/**
 * Parse ASCII grid template into cell definitions.
 * 
 * Template format:
 * ```
 * | header  | header  |
 * | sidebar | main    |
 * | footer  | footer  |
 * ```
 * 
 * - Pipe `|` separates columns
 * - Each line is a row
 * - Repeated section names indicate spans
 */
function parseTemplate(template: string): {
  rows: number;
  cols: number;
  cells: Map<string, TemplateCell>;
} {
  const lines = template
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const grid: string[][] = lines.map(line => 
    line
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0)
  );
  
  const rows = grid.length;
  const cols = Math.max(...grid.map(row => row.length));
  
  // Find spans for each section
  const cells = new Map<string, TemplateCell>();
  const visited = new Set<string>();
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sectionId = grid[row]?.[col];
      if (!sectionId || visited.has(`${row},${col}`)) continue;
      
      // Find span extents
      let rowSpan = 1;
      let colSpan = 1;
      
      // Check column span
      while (col + colSpan < cols && grid[row][col + colSpan] === sectionId) {
        colSpan++;
      }
      
      // Check row span
      while (row + rowSpan < rows) {
        let fullRow = true;
        for (let c = col; c < col + colSpan; c++) {
          if (grid[row + rowSpan]?.[c] !== sectionId) {
            fullRow = false;
            break;
          }
        }
        if (!fullRow) break;
        rowSpan++;
      }
      
      // Mark cells as visited
      for (let r = row; r < row + rowSpan; r++) {
        for (let c = col; c < col + colSpan; c++) {
          visited.add(`${r},${c}`);
        }
      }
      
      // Store cell info (only first occurrence)
      if (!cells.has(sectionId)) {
        cells.set(sectionId, { sectionId, row, col, rowSpan, colSpan });
      }
    }
  }
  
  return { rows, cols, cells };
}
```

### 16.4 MediaDefinitions Generator

```typescript
/**
 * Convert simple layout config to ECharts mediaDefinitions.
 */
export function buildMediaDefinitions(
  layout: SimpleMatrixLayout
): MediaDefinition[] {
  const mediaDefinitions: MediaDefinition[] = [];
  
  // Sort breakpoints: specific queries first, default last
  const sortedBreakpoints = Object.entries(layout.breakpoints).sort(
    ([, a], [, b]) => {
      const aHasQuery = a.minWidth != null || a.maxWidth != null;
      const bHasQuery = b.minWidth != null || b.maxWidth != null;
      if (aHasQuery && !bHasQuery) return -1;
      if (!aHasQuery && bHasQuery) return 1;
      return 0;
    }
  );
  
  for (const [name, config] of sortedBreakpoints) {
    const { rows, cols, cells } = parseTemplate(config.template);
    
    // Build query
    const query: { minWidth?: number; maxWidth?: number } | undefined = 
      config.minWidth != null || config.maxWidth != null
        ? { minWidth: config.minWidth, maxWidth: config.maxWidth }
        : undefined;
    
    // Build sectionCoordMap
    const sectionCoordMap: Record<string, MatrixCoord> = {};
    
    for (const [sectionId, cell] of cells) {
      const colCoord: number | [number, number] = 
        cell.colSpan === 1 ? cell.col : [cell.col, cell.col + cell.colSpan - 1];
      const rowCoord: number | [number, number] = 
        cell.rowSpan === 1 ? cell.row : [cell.row, cell.row + cell.rowSpan - 1];
      
      sectionCoordMap[sectionId] = [colCoord, rowCoord];
    }
    
    mediaDefinitions.push({
      query,
      matrix: {
        x: { data: Array(cols).fill(null) },
        y: { data: Array(rows).fill(null) },
      },
      sectionCoordMap,
    });
  }
  
  return mediaDefinitions;
}
```

### 16.5 React Hook for Easy Usage

```typescript
// src/hooks/useMatrixLayout.ts
import { useMemo } from 'react';
import { buildMediaDefinitions } from '@/lib/matrixLayoutBuilder';
import type { SimpleMatrixLayout, MediaDefinition } from '@/types/matrixLayout.types';

export function useMatrixLayout(layout: SimpleMatrixLayout): MediaDefinition[] {
  return useMemo(() => buildMediaDefinitions(layout), [layout]);
}
```

### 16.6 Complete Usage Example

```typescript
import { MatrixChart } from '@/components/charts/composed/MatrixChart';
import { useMatrixLayout } from '@/hooks/useMatrixLayout';
import { LineChartSection, BarChartSection, ViolinChartSection } from '@/components/charts/sections';

function AnalyticsDashboard({ salesData, categoryData, distributionData }) {
  // Simple, readable layout definition
  const mediaDefinitions = useMatrixLayout({
    sections: ['header', 'trend', 'category', 'distribution', 'footer'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | header       |
          | trend        |
          | category     |
          | distribution |
          | footer       |
        `,
      },
      tablet: {
        minWidth: 601,
        maxWidth: 1024,
        template: `
          | header       | header       |
          | trend        | trend        |
          | category     | distribution |
          | footer       | footer       |
        `,
      },
      desktop: {
        template: `
          | header   | header       | header       | header       |
          | trend    | trend        | trend        | category     |
          | trend    | trend        | trend        | category     |
          | footer   | distribution | distribution | distribution |
        `,
      },
    },
  });
  
  // Define chart sections
  const sections = [
    {
      id: 'header',
      option: {
        title: { coordinateSystem: 'matrix', text: 'Sales Analytics Dashboard', left: 'center' },
      },
    },
    LineChartSection({ id: 'trend', data: salesData, title: 'Revenue Trend' }),
    BarChartSection({ id: 'category', data: categoryData, title: 'By Category' }),
    ViolinChartSection({ id: 'distribution', data: distributionData, title: 'Distribution' }),
    {
      id: 'footer',
      option: {
        title: { coordinateSystem: 'matrix', text: 'Updated: Real-time', textStyle: { fontSize: 12 } },
      },
    },
  ];
  
  return (
    <MatrixChart
      sections={sections}
      mediaDefinitions={mediaDefinitions}
      className="w-full h-screen"
    />
  );
}
```

### 16.7 Layout Presets for Matrix Charts

```typescript
// src/lib/matrixLayoutPresets.ts
import type { SimpleMatrixLayout } from '@/types/matrixLayout.types';

export const MATRIX_PRESETS = {
  // Dashboard: header + main content + sidebar
  dashboard: {
    sections: ['header', 'main', 'sidebar', 'footer'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | header  |
          | main    |
          | sidebar |
          | footer  |
        `,
      },
      desktop: {
        template: `
          | header  | header  | header  |
          | main    | main    | sidebar |
          | main    | main    | sidebar |
          | footer  | footer  | footer  |
        `,
      },
    },
  },
  
  // Comparison: side-by-side charts
  comparison: {
    sections: ['title', 'left', 'right', 'summary'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | title   |
          | left    |
          | right   |
          | summary |
        `,
      },
      desktop: {
        template: `
          | title   | title   |
          | left    | right   |
          | left    | right   |
          | summary | summary |
        `,
      },
    },
  },
  
  // Grid: equal cells
  grid2x2: {
    sections: ['tl', 'tr', 'bl', 'br'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | tl |
          | tr |
          | bl |
          | br |
        `,
      },
      desktop: {
        template: `
          | tl | tr |
          | bl | br |
        `,
      },
    },
  },
  
  grid3x3: {
    sections: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | a |
          | b |
          | c |
          | d |
          | e |
          | f |
          | g |
          | h |
          | i |
        `,
      },
      tablet: {
        minWidth: 601,
        maxWidth: 1024,
        template: `
          | a | b | c |
          | d | e | f |
          | g | h | i |
        `,
      },
      desktop: {
        template: `
          | a | b | c |
          | d | e | f |
          | g | h | i |
        `,
      },
    },
  },
} satisfies Record<string, SimpleMatrixLayout>;

export type MatrixPresetName = keyof typeof MATRIX_PRESETS;
```

### 16.8 Using Presets with Custom Overrides

```typescript
import { MATRIX_PRESETS } from '@/lib/matrixLayoutPresets';
import { useMatrixLayout } from '@/hooks/useMatrixLayout';

function QuickDashboard() {
  // Use preset directly
  const mediaDefinitions = useMatrixLayout(MATRIX_PRESETS.dashboard);
  
  // Or extend preset with custom breakpoints
  const customLayout = useMatrixLayout({
    ...MATRIX_PRESETS.dashboard,
    breakpoints: {
      ...MATRIX_PRESETS.dashboard.breakpoints,
      widescreen: {
        minWidth: 1920,
        template: `
          | header  | header  | header  | header  |
          | main    | main    | main    | sidebar |
          | main    | main    | main    | sidebar |
          | footer  | footer  | footer  | footer  |
        `,
      },
    },
  });
  
  return <MatrixChart sections={sections} mediaDefinitions={mediaDefinitions} />;
}
```

### 16.9 Comparison: Before and After

**BEFORE (Manual mediaDefinitions):**
```typescript
const mediaDefinitions = [
  {
    query: { maxWidth: 600 },
    matrix: {
      x: { data: [null] },
      y: { data: [null, null, null, null] },
    },
    sectionCoordMap: {
      header: [0, 0],
      main: [0, 1],
      sidebar: [0, 2],
      footer: [0, 3],
    },
  },
  {
    matrix: {
      x: { data: [null, null, null] },
      y: { data: [null, null, null, null] },
    },
    sectionCoordMap: {
      header: [[0, 2], 0],
      main: [[0, 1], [1, 2]],
      sidebar: [2, [1, 2]],
      footer: [[0, 2], 3],
    },
  },
];
```

**AFTER (Simple Template):**
```typescript
const mediaDefinitions = useMatrixLayout({
  sections: ['header', 'main', 'sidebar', 'footer'],
  breakpoints: {
    mobile: {
      maxWidth: 600,
      template: `
        | header  |
        | main    |
        | sidebar |
        | footer  |
      `,
    },
    desktop: {
      template: `
        | header  | header  | header  |
        | main    | main    | sidebar |
        | main    | main    | sidebar |
        | footer  | footer  | footer  |
      `,
    },
  },
});
```

**Benefits:**
- Visual representation of layout (ASCII grid)
- Auto-calculates spans and coordinates
- Type-safe with validation
- Easy to understand and modify
- Presets for common patterns

---

## 17. Known Considerations

1. **RSuite CustomProvider Theme Classes**: RSuite automatically adds `.rs-theme-dark` or `.rs-theme-high-contrast` class to `<body>` element. This triggers CSS variable updates across all RSuite components.

2. **ECharts 6 setTheme API**: This is a new feature in ECharts 6 for dynamic theme switching without disposing the chart instance. We map RSuite themes to ECharts themes:
   - `light` → `'default'`
   - `dark` → `'dark'`
   - `high-contrast` → `'dark'`

3. **SSR Hydration**: 
   - Default to `'light'` theme on server render to ensure consistent initial HTML
   - After hydration, detect system preference and update theme
   - Use `useEffect` for system preference detection (client-only)

4. **RSuite + Tailwind Integration**: 
   - Import RSuite CSS before Tailwind
   - Create utility classes that bridge RSuite CSS variables
   - RSuite variables auto-update on theme change, providing reactive styling

5. **Theme Persistence**: Consider storing user's manual theme preference in localStorage for returning visitors.

6. **High Contrast Mode**: RSuite's high-contrast theme provides better accessibility for users with visual impairments. It maps to ECharts' dark theme for charts.

7. **Custom Series Registration**: 
   - Custom series must be registered before chart initialization
   - Use `echarts.use(installer)` pattern from `@echarts-x/*` packages
   - Register once at app initialization (e.g., in ThemeProvider or app entry)

8. **Matrix Coordinate System**:
   - All components in matrix layout must have `coordinateSystem: 'matrix'`
   - Use unique `id` for each grid, axis, and series
   - Link series to grids via `gridId`, `xAxisId`, `yAxisId`
   - Media queries enable responsive layouts

9. **Composing Series in Single Instance**:
   - YES, you can mix line, bar, pie, scatter, AND custom series
   - Each grid is an independent coordinate space
   - Pie/gauge charts don't need grids (use `center` positioning)
   - Custom series use `type: 'custom'` + `renderItem: '<seriesName>'`

10. **Matrix Layout Performance**: Complex grid layouts with many charts should use virtual scrolling for large datasets.

11. **Type Inference Accuracy**: Edge cases in data may require manual configuration override.
