# @efx/layout-core

Framework-agnostic core types, utilities, and presets for CSS Grid-based dashboard layouts.

## Installation

```bash
npm install @efx/layout-core
# or
pnpm add @efx/layout-core
```

## Overview

This package provides the foundation for the EfxLayout system - a flexible CSS Grid-based layout system for building dashboard UIs. It contains:

- **Types**: TypeScript definitions for layout templates, padding, breakpoints
- **Utilities**: Helper functions for padding normalization and gap calculations
- **Presets**: Pre-defined layout templates for common dashboard patterns

## Usage

```typescript
import {
  // Types
  type LayoutTemplate,
  type LayoutPadding,
  type Breakpoint,
  type ResponsiveTemplates,
  
  // Utilities
  buildPaddingStyle,
  normalizeGap,
  normalizePadding,
  
  // Presets
  LAYOUT_PRESETS,
  RESPONSIVE_LAYOUTS,
} from '@efx/layout-core'
```

## Types

### LayoutTemplate

Defines a CSS Grid layout:

```typescript
interface LayoutTemplate {
  areas: string           // CSS Grid template areas
  columns?: string[]      // Column sizes (e.g., ['1fr', '300px'])
  rows?: string[]         // Row sizes (e.g., ['80px', '1fr', '60px'])
  gap?: number | string   // Gap between cells
  padding?: LayoutPadding | number | string
}
```

### LayoutPadding

Flexible padding configuration:

```typescript
interface LayoutPadding {
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
}
```

### Breakpoint

```typescript
type Breakpoint = 'mobile' | 'tablet' | 'desktop'
```

## Presets

### LAYOUT_PRESETS

Pre-defined layouts for common dashboard patterns:

```typescript
import { LAYOUT_PRESETS } from '@efx/layout-core'

// Available presets:
LAYOUT_PRESETS.analytics    // KPI row + main + sidebar
LAYOUT_PRESETS.report       // Header + main + sidebar + footer
LAYOUT_PRESETS.comparison   // Side-by-side comparison
LAYOUT_PRESETS.monitoring   // 5 KPIs + 4 charts grid
LAYOUT_PRESETS.pageWithTitle    // Title + content
LAYOUT_PRESETS.pageWithControls // Title + controls + content
```

### RESPONSIVE_LAYOUTS

Responsive variants with mobile/tablet/desktop breakpoints:

```typescript
import { RESPONSIVE_LAYOUTS } from '@efx/layout-core'

RESPONSIVE_LAYOUTS.analytics   // Mobile: stacked, Desktop: grid
RESPONSIVE_LAYOUTS.pageWithTitle
```

## Utilities

### buildPaddingStyle

Convert padding config to CSS string:

```typescript
buildPaddingStyle(16)                    // "16px"
buildPaddingStyle("1rem")                // "1rem"
buildPaddingStyle({ top: 10, left: 20 }) // "10px 0 0 20px"
```

### normalizeGap

Convert gap to CSS string:

```typescript
normalizeGap(16)      // "16px"
normalizeGap("1rem")  // "1rem"
normalizeGap()        // "16px" (default)
```

## Related Packages

- **@efx/layout-react** - React components for EfxLayout

## License

MIT
