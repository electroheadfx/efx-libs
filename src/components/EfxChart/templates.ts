/**
 * Pre-defined ASCII Layout Templates
 *
 * Human-readable grid definitions for common dashboard patterns.
 */

import type { EfxLayoutTemplate } from "./types"

/**
 * Finance Dashboard Layout
 * Based on the original finance.js implementation
 * Title is handled separately via EfxLayout, not as a chart section
 *
 * Desktop: 4 columns × 9 rows
 * Mobile: 1 column × 9 rows
 */
export const FINANCE_LAYOUT = {
	name: "finance",
	sections: ["header", "sidebar", "main", "footer"],
	mobile: `
		| header  |
		| header  |
		| sidebar |
		| sidebar |
		| main    |
		| main    |
		| main    |
		| footer  |
		| footer  |
	`,
	desktop: `
		| header  | header  | header  | header  |
		| header  | header  | header  | header  |
		| sidebar | main    | main    | main    |
		| sidebar | main    | main    | main    |
		| sidebar | main    | main    | main    |
		| sidebar | main    | main    | main    |
		| sidebar | main    | main    | main    |
		| sidebar | footer  | footer  | footer  |
		| sidebar | footer  | footer  | footer  |
	`,
} as const satisfies EfxLayoutTemplate

/**
 * Standard Dashboard Layout
 * Header, main content, sidebar, and footer
 */
export const DASHBOARD_LAYOUT: EfxLayoutTemplate = {
	name: "dashboard",
	sections: ["header", "main", "sidebar", "footer"] as const,
	mobile: `
		| header  |
		| header  |
		| main    |
		| main    |
		| main    |
		| main    |
		| sidebar |
		| sidebar |
		| footer  |
		| footer  |
	`,
	desktop: `
		| header  | header  | header  | header  |
		| header  | header  | header  | header  |
		| main    | main    | main    | sidebar |
		| main    | main    | main    | sidebar |
		| main    | main    | main    | sidebar |
		| main    | main    | main    | sidebar |
		| main    | main    | main    | sidebar |
		| main    | main    | main    | sidebar |
		| footer  | footer  | footer  | footer  |
		| footer  | footer  | footer  | footer  |
	`,
}

/**
 * Comparison Layout
 * Side-by-side comparison with title and summary
 */
export const COMPARISON_LAYOUT: EfxLayoutTemplate = {
	name: "comparison",
	sections: ["title", "left", "right", "summary"] as const,
	mobile: `
		| title   |
		| left    |
		| left    |
		| left    |
		| right   |
		| right   |
		| right   |
		| summary |
		| summary |
		| summary |
	`,
	desktop: `
		| title   | title   | title   | title   |
		| title   | title   | title   | title   |
		| left    | left    | right   | right   |
		| left    | left    | right   | right   |
		| left    | left    | right   | right   |
		| left    | left    | right   | right   |
		| left    | left    | right   | right   |
		| summary | summary | summary | summary |
		| summary | summary | summary | summary |
		| summary | summary | summary | summary |
	`,
}

/**
 * 2x2 Equal Grid Layout
 * Four equal quadrants
 */
export const GRID_2X2_LAYOUT: EfxLayoutTemplate = {
	name: "grid2x2",
	sections: ["tl", "tr", "bl", "br"] as const,
	mobile: `
		| tl |
		| tl |
		| tr |
		| tr |
		| bl |
		| bl |
		| br |
		| br |
	`,
	desktop: `
		| tl | tl | tr | tr |
		| tl | tl | tr | tr |
		| tl | tl | tr | tr |
		| tl | tl | tr | tr |
		| bl | bl | br | br |
		| bl | bl | br | br |
		| bl | bl | br | br |
		| bl | bl | br | br |
	`,
}

/**
 * Analytics Dashboard Layout
 * KPI row with main content and sidebar
 */
export const ANALYTICS_LAYOUT: EfxLayoutTemplate = {
	name: "analytics",
	sections: ["kpi1", "kpi2", "kpi3", "kpi4", "main", "side"] as const,
	mobile: `
		| kpi1 |
		| kpi2 |
		| kpi3 |
		| kpi4 |
		| main |
		| main |
		| main |
		| main |
		| side |
		| side |
	`,
	desktop: `
		| kpi1 | kpi2 | kpi3 | kpi4 |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
		| main | main | main | side |
	`,
}

/**
 * Monitoring Layout
 * 3x2 grid for monitoring dashboards
 */
export const MONITORING_LAYOUT: EfxLayoutTemplate = {
	name: "monitoring",
	sections: [
		"chart1",
		"chart2",
		"chart3",
		"chart4",
		"chart5",
		"chart6",
	] as const,
	mobile: `
		| chart1 |
		| chart2 |
		| chart3 |
		| chart4 |
		| chart5 |
		| chart6 |
	`,
	desktop: `
		| chart1 | chart1 | chart2 | chart2 | chart3 | chart3 |
		| chart1 | chart1 | chart2 | chart2 | chart3 | chart3 |
		| chart1 | chart1 | chart2 | chart2 | chart3 | chart3 |
		| chart4 | chart4 | chart5 | chart5 | chart6 | chart6 |
		| chart4 | chart4 | chart5 | chart5 | chart6 | chart6 |
		| chart4 | chart4 | chart5 | chart5 | chart6 | chart6 |
	`,
}

/**
 * All pre-defined templates
 */
export const EFX_CHART_TEMPLATES = {
	finance: FINANCE_LAYOUT,
	dashboard: DASHBOARD_LAYOUT,
	comparison: COMPARISON_LAYOUT,
	grid2x2: GRID_2X2_LAYOUT,
	analytics: ANALYTICS_LAYOUT,
	monitoring: MONITORING_LAYOUT,
} as const

export type EfxChartTemplateName = keyof typeof EFX_CHART_TEMPLATES

/**
 * Type helper to extract section IDs from a template
 */
export type SectionId<T extends EfxLayoutTemplate> = T["sections"][number]
