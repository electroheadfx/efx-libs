# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server on port 3000
pnpm build        # Build for production (creates .output/)
pnpm preview      # Preview production build
pnpm test         # Run Vitest tests
pnpm lint         # Lint with Biome
pnpm format       # Format code with Biome
pnpm check        # Run Biome check (includes lint + format validation)
```

## Architecture Overview

This is a TanStack Start multi-chart dashboard with two distinct ECharts architecture patterns:

### Legacy Chart Components (`src/components/charts/`)

Direct `echarts-for-react` integration with composed chart patterns:
- `MultiGridChart` - 4 charts in 2x2 grid within single ECharts instance
- `ComboChart` - Line + Bar + Scatter in single chart
- `DualAxisChart` - Two Y-axes for different scales

### New EfxCharts Pattern (`src/components/EfxChart/`)

Declarative matrix-based layout system using React component composition:

```
EfxChartsLayout (single ECharts instance)
└── EfxChart (section config - renders nothing, used declaratively)
```

**Key files:**
- `EfxChartsLayout.tsx` - Main layout component that builds ECharts option from children
- `EfxChart.tsx` - Config-only component (doesn't render, passes props to parent)
- `templates.ts` - Pre-defined ASCII layout templates
- `types.ts` - Full TypeScript definitions for ECharts options

**Layout Templates** (`templates.ts`):
Templates use ASCII art syntax for grid definitions:
```tsx
const template = {
  sections: ['header', 'sidebar', 'main', 'footer'] as const,
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

**Server Actions** (`src/serverActions/`):
SSR data generation via `createServerFn` with seeded random data for reproducibility.

## Routing

TanStack Router with file-based routing in `src/routes/`:
- `src/routes/__root.tsx` - Root layout with ThemeProvider
- `src/routes/efx-charts.tsx` - EfxCharts demo with deferred data loading
- `src/routes/basic-echarts.tsx` - Direct ECharts demos
- `src/routes/layout-echarts.tsx` - Layout system demos

## SSR Pattern

ECharts requires lazy loading in SSR environments:
```tsx
import { lazy, Suspense } from 'react'

const ReactECharts = lazy(() => import('echarts-for-react'))
const EfxChartsLayout = lazy(() => import('@/components/EfxChart/EfxChartsLayout'))
```

## Theme System

`ThemeProvider` (`src/providers/ThemeProvider.tsx`) manages:
- RSuite theme (light/dark/high-contrast)
- ECharts theme mapping
- Tailwind class mapping via `bg-rs-*`, `text-rs-*` utilities

## Data Generation

Seeded random data via `createServerFn` in `efxChartsActions.ts`:
- Seed driven by URL search params for shareability
- Deferred loading with `<Await>` for streaming SSR

## Linting

Biome is configured - run `pnpm check` before committing. Biome handles both linting and formatting.
