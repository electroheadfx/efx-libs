# @efx/chart-core

Framework-agnostic core types, utilities, and templates for ECharts-based multi-chart dashboards.

## Installation

```bash
npm install @efx/chart-core
# or
pnpm add @efx/chart-core
```

## Peer Dependencies

- `echarts` ^5.0.0 || ^6.0.0

## Overview

This package provides the foundation for the EfxChart system - a declarative approach to building multi-chart ECharts dashboards using ASCII-based layout templates. It contains:

- **Types**: Full TypeScript definitions for ECharts options and chart configuration
- **Templates**: Pre-defined ASCII layout templates for common dashboard patterns
- **Utilities**: Template parsing, option building, and data generation helpers

## Templates

ASCII-based layout templates define how charts are positioned:

```typescript
import { FINANCE_LAYOUT, EFX_CHART_TEMPLATES } from '@efx/chart-core'

// FINANCE_LAYOUT structure:
{
  name: 'finance',
  sections: ['header', 'sidebar', 'main', 'footer'],
  mobile: `
    | header  |
    | sidebar |
    | main    |
    | footer  |
  `,
  desktop: `
    | header  | header  | header  | header  |
    | sidebar | main    | main    | main    |
    | sidebar | footer  | footer  | footer  |
  `,
}
```

### Available Templates

```typescript
import {
  FINANCE_LAYOUT,      // Header + sidebar + main + footer
  DASHBOARD_LAYOUT,    // Standard dashboard
  COMPARISON_LAYOUT,   // Side-by-side comparison
  GRID_2X2_LAYOUT,     // 4 equal quadrants
  ANALYTICS_LAYOUT,    // KPIs + main + sidebar
  MONITORING_LAYOUT,   // 3x2 chart grid
  EFX_CHART_TEMPLATES, // All templates as object
} from '@efx/chart-core'
```

## Types

### EfxLayoutTemplate

```typescript
interface EfxLayoutTemplate {
  name: string
  sections: readonly string[]  // Section IDs
  mobile: string               // ASCII template for mobile
  desktop: string              // ASCII template for desktop
  tablet?: string              // Optional tablet layout
}
```

### EfxChartSectionConfig

Configuration for a chart section:

```typescript
interface EfxChartSectionConfig {
  section: string              // Section ID from template
  title?: string | TitleConfig
  type?: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'candlestick'
  data?: unknown[]
  xAxis?: AxisConfig
  yAxis?: AxisConfig
  series?: SeriesConfig
  padding?: number | string | PaddingConfig
  // ... full ECharts options exposure
}
```

### Type Helpers

```typescript
import type { ExtractSections, SectionId } from '@efx/chart-core'

// Extract section names as union type
type FinanceSections = ExtractSections<typeof FINANCE_LAYOUT>
// => 'header' | 'sidebar' | 'main' | 'footer'
```

## Utilities

### Template Parsing

```typescript
import { parseLayoutTemplate, parseTemplateToLayout } from '@efx/chart-core'

// Parse full template for all breakpoints
const layouts = parseLayoutTemplate(FINANCE_LAYOUT)
// => { mobile: ParsedLayout, desktop: ParsedLayout }

// Parse single ASCII template
const parsed = parseTemplateToLayout(template.desktop)
// => { columns: 4, rows: 3, sectionCoordMap: { header: [[0,3], [0,0]], ... } }
```

### Option Building

```typescript
import { buildEChartsOption, buildMediaDefinitions } from '@efx/chart-core'

// Build ECharts option from section configs
const option = buildEChartsOption(sections, sectionCoordMap, columns, rows)

// Build responsive media queries
const media = buildMediaDefinitions(mobileLayout, desktopLayout, sections)
```

### Data Generators

Sample data generators for demos and testing:

```typescript
import {
  generateTimeSeriesData,
  generateCategoryData,
  generateScatterData,
  generatePieData,
  generateMultiSeriesData,
  generateCandlestickData,
} from '@efx/chart-core'

const timeSeries = generateTimeSeriesData(30)    // 30 days of data
const categories = generateCategoryData(5)       // 5 categories
const scatter = generateScatterData(100)         // 100 points
```

### Padding Utilities

```typescript
import { parsePadding, paddingToGridPosition } from '@efx/chart-core'

// Parse flexible padding formats
parsePadding(10)           // { top: 10, right: 10, bottom: 10, left: 10 }
parsePadding('20,10')      // { top: 10, right: 20, bottom: 10, left: 20 }
parsePadding('10,20,30,40') // { top: 10, right: 20, bottom: 30, left: 40 }
```

## Related Packages

- **@efx/chart-react** - React components for EfxChart

## License

MIT
