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

export { EfxChart, extractChartProps, isEfxChart } from "./EfxChart";
export { EfxChartsLayout } from "./EfxChartsLayout";

// ============================================================================
// Templates
// ============================================================================

export {
	ANALYTICS_LAYOUT,
	COMPARISON_LAYOUT,
	DASHBOARD_LAYOUT,
	EFX_CHART_TEMPLATES,
	type EfxChartTemplateName,
	FINANCE_LAYOUT,
	GRID_2X2_LAYOUT,
	MONITORING_LAYOUT,
	type SectionId,
} from "./templates";

// ============================================================================
// Core Hooks & Renderer (for advanced usage)
// ============================================================================

export {
	type EChartsCoreOption,
	EChartsRenderer,
	type EChartsType,
	useEChartsInstance,
	useResizeObserver,
} from "./core";

// ============================================================================
// Utilities
// ============================================================================

export {
	// Option building
	buildEChartsOption,
	buildMediaDefinitions,
	coordsToPercentages,
	type EfxMediaUnit,
	generateCandlestickData,
	generateCategoryData,
	generateMultiSeriesData,
	generatePieData,
	generateScatterData,
	// Data generators
	generateTimeSeriesData,
	mirrorLayoutHorizontally,
	paddingToGridPosition,
	parseLayoutTemplate,
	// Padding parsing
	parsePadding,
	// Template parsing
	parseTemplateToLayout,
} from "./utils";

// ============================================================================
// Types
// ============================================================================

export type {
	// Re-exports
	ECharts,
	// Event types
	EChartsEventParams,
	EChartsOption,
	// Axis types
	EfxAxisOption,
	// Component props
	EfxChartProps,
	EfxChartsLayoutProps,
	// Chart types
	EfxChartType,
	// Emphasis types
	EfxEmphasisOption,
	EfxEventHandler,
	// Layout types
	EfxLayoutTemplate,
	// Padding types
	EfxPadding,
	EfxParsedPadding,
	// Series types
	EfxSeriesOption,
	// Title types
	EfxTitleOption,
	MatrixCoord,
	ParsedLayout,
	SectionCoordMap,
	SectionCoordValue,
	// Hook types
	UseEChartsOptions,
	UseEChartsReturn,
} from "./types";
