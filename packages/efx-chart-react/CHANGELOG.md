# @efxlab/chart-react

## 0.2.0

### Minor Changes

- 67eb9b1: Initial release of EfxChart and EfxLayout packages

  ## @efxlab/layout-core

  - Framework-agnostic types for CSS Grid layouts
  - Layout presets (analytics, report, comparison, monitoring)
  - Utility functions for padding and gap normalization

  ## @efxlab/layout-react

  - EfxLayout component for CSS Grid-based layouts
  - EfxGrid component for simple auto-layout grids
  - EfxResponsiveLayout for responsive breakpoint switching
  - useBreakpoint and useMediaQuery hooks

  ## @efxlab/chart-core

  - Framework-agnostic types for ECharts dashboards
  - ASCII-based layout templates (finance, dashboard, analytics, etc.)
  - Template parsing and option building utilities
  - Data generators for testing

  ## @efxlab/chart-react

  - EfxChartsLayout component for multi-chart dashboards
  - EfxChart declarative chart configuration
  - createTypedChart factory for type-safe section autocomplete
  - useStreamingData hook for progressive data loading
  - useEChartsInstance hook for ECharts lifecycle management

### Patch Changes

- Updated dependencies [67eb9b1]
  - @efxlab/chart-core@0.2.0
