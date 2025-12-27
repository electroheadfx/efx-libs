/**
 * EfxCharts - Matrix-based ECharts Dashboard Layout System
 *
 * A React component library for creating complex multi-chart dashboards
 * using ASCII templates and ECharts matrix coordinates.
 *
 * @example
 * ```tsx
 * import {
 *   EfxChartsLayout,
 *   EfxChart,
 *   FINANCE_LAYOUT,
 *   generateTimeSeriesData,
 * } from '@/components/EfxChart';
 *
 * function Dashboard() {
 *   return (
 *     <EfxChartsLayout
 *       template={FINANCE_LAYOUT}
 *       sidebarPosition="left"
 *       onChartReady={(chart) => console.log('Ready!')}
 *       onEvents={{
 *         click: (params) => console.log('Clicked:', params),
 *       }}
 *     >
 *       <EfxChart
 *         id="main"
 *         type="line"
 *         title="Revenue Trend"
 *         data={generateTimeSeriesData(24)}
 *         padding="50,20"
 *       />
 *       <EfxChart
 *         id="sidebar"
 *         type="bar"
 *         title="Categories"
 *         data={generateCategoryData(5)}
 *         invertAxis
 *       />
 *     </EfxChartsLayout>
 *   );
 * }
 * ```
 */

// ============================================================================
// Main Components
// ============================================================================

export { EfxChartsLayout } from "./EfxChartsLayout"
export { EfxChart, isEfxChart, extractChartProps } from "./EfxChart"

// ============================================================================
// Templates
// ============================================================================

export {
  FINANCE_LAYOUT,
  DASHBOARD_LAYOUT,
  COMPARISON_LAYOUT,
  GRID_2X2_LAYOUT,
  ANALYTICS_LAYOUT,
  MONITORING_LAYOUT,
  EFX_CHART_TEMPLATES,
  type EfxChartTemplateName,
  type SectionId,
} from "./templates"

// ============================================================================
// Core Hooks & Renderer (for advanced usage)
// ============================================================================

export {
  useEChartsInstance,
  useResizeObserver,
  EChartsRenderer,
  type EChartsType,
  type EChartsCoreOption,
} from "./core"

// ============================================================================
// Utilities
// ============================================================================

export {
  // Template parsing
  parseTemplateToLayout,
  parseLayoutTemplate,
  mirrorLayoutHorizontally,
  coordsToPercentages,
  // Padding parsing
  parsePadding,
  paddingToGridPosition,
  // Option building
  buildEChartsOption,
  buildMediaDefinitions,
  type EfxMediaUnit,
  // Data generators
  generateTimeSeriesData,
  generateCategoryData,
  generateScatterData,
  generatePieData,
  generateMultiSeriesData,
  generateCandlestickData,
} from "./utils"

// ============================================================================
// Types
// ============================================================================

export type {
  // Event types
  EChartsEventParams,
  EfxEventHandler,
  // Padding types
  EfxPadding,
  EfxParsedPadding,
  // Axis types
  EfxAxisOption,
  // Series types
  EfxSeriesOption,
  // Emphasis types
  EfxEmphasisOption,
  // Title types
  EfxTitleOption,
  // Chart types
  EfxChartType,
  // Layout types
  EfxLayoutTemplate,
  MatrixCoord,
  SectionCoordValue,
  SectionCoordMap,
  ParsedLayout,
  // Component props
  EfxChartProps,
  EfxChartsLayoutProps,
  // Hook types
  UseEChartsOptions,
  UseEChartsReturn,
  // Re-exports
  ECharts,
  EChartsOption,
} from "./types"
