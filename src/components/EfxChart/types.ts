/**
 * EfxCharts Type Definitions
 *
 * TypeScript interfaces for the EfxCharts component library.
 * Provides full ECharts options exposure through strongly-typed props.
 */

import type { ECharts, EChartsOption } from "echarts"
import type { CSSProperties, ReactNode } from "react"

// ============================================================================
// Event Types
// ============================================================================

/**
 * ECharts event parameters - varies by event type
 */
export interface EChartsEventParams {
	componentType?: string
	seriesType?: string
	seriesIndex?: number
	seriesName?: string
	name?: string
	dataIndex?: number
	data?: unknown
	value?: unknown
	event?: MouseEvent
	[key: string]: unknown
}

/**
 * Event handler signature - same API as echarts-for-react
 */
export type EfxEventHandler = (
	params: EChartsEventParams,
	chart: ECharts,
) => void

// ============================================================================
// Padding Types
// ============================================================================

/**
 * Flexible padding format
 * - number: All sides (e.g., 10)
 * - string: "10" | "20,10" | "10,20,30,40"
 * - object: { top?, right?, bottom?, left? }
 */
export type EfxPadding =
	| number
	| string
	| { top?: number; right?: number; bottom?: number; left?: number }

/**
 * Parsed padding values
 */
export interface EfxParsedPadding {
	top: number
	right: number
	bottom: number
	left: number
}

// ============================================================================
// Axis Types
// ============================================================================

export interface EfxAxisOption {
	type?: "category" | "value" | "time" | "log"
	data?: (string | number)[]
	name?: string
	nameLocation?: "start" | "middle" | "end"
	inverse?: boolean
	min?: number | "dataMin"
	max?: number | "dataMax"
	splitNumber?: number
	splitLine?: {
		show?: boolean
		lineStyle?: { color?: string; type?: "solid" | "dashed" }
	}
	axisLine?: { show?: boolean; lineStyle?: { color?: string } }
	axisLabel?: {
		show?: boolean
		hideOverlap?: boolean
		rotate?: number
		formatter?: string | ((value: unknown) => string)
	}
	axisTick?: { show?: boolean }
	/** Axis pointer configuration (per-axis: line/shadow/none only, 'cross' is tooltip-level only) */
	axisPointer?: {
		show?: boolean
		type?: "line" | "shadow" | "none"
		label?: { show?: boolean }
	}
	[key: string]: unknown
}

// ============================================================================
// Series Types
// ============================================================================

export interface EfxSeriesOption {
	name?: string
	smooth?: boolean
	symbol?: string | "none" | "circle" | "rect" | "diamond"
	symbolSize?: number
	stack?: string

	// Line/Area
	areaStyle?: { color?: string; opacity?: number }
	lineStyle?: {
		color?: string
		width?: number
		type?: "solid" | "dashed" | "dotted"
	}

	// All series
	itemStyle?: {
		color?: string
		borderColor?: string
		borderWidth?: number
		borderRadius?: number | [number, number, number, number]
		opacity?: number
	}

	label?: {
		show?: boolean
		position?: "inside" | "outside" | "top" | "bottom" | "left" | "right"
		formatter?: string | ((params: unknown) => string)
		color?: string
		fontSize?: number
	}

	// Pie-specific
	center?: [string | number, string | number]
	radius?: string | number | [string | number, string | number]
	roseType?: "radius" | "area"

	// Bar-specific
	barWidth?: number | string
	barMaxWidth?: number | string
	barGap?: string

	[key: string]: unknown
}

// ============================================================================
// Emphasis Types
// ============================================================================

export interface EfxEmphasisOption {
	scale?: boolean
	scaleSize?: number
	focus?: "none" | "self" | "series" | "adjacency"
	blurScope?: "coordinateSystem" | "series" | "global"
	itemStyle?: EfxSeriesOption["itemStyle"]
	label?: EfxSeriesOption["label"]
	lineStyle?: EfxSeriesOption["lineStyle"]
}

// ============================================================================
// Title Types
// ============================================================================

export type EfxTitleOption =
	| string
	| {
		text: string
		subtext?: string
		textStyle?: { fontSize?: number; color?: string; fontWeight?: string }
	}

// ============================================================================
// Chart Types
// ============================================================================

export type EfxChartType =
	| "line"
	| "bar"
	| "pie"
	| "scatter"
	| "area"
	| "candlestick"
	| "heatmap"

// ============================================================================
// Layout Template Types
// ============================================================================

/**
 * ASCII-based layout template
 */
export interface EfxLayoutTemplate {
	/** Template name for identification */
	name: string
	/** Section IDs that can be used in this template */
	sections: readonly string[]
	/** Mobile layout (single column, pipe-delimited ASCII) */
	mobile: string
	/** Desktop layout (multi-column, pipe-delimited ASCII) */
	desktop: string
	/** Optional tablet layout */
	tablet?: string
}

/**
 * Matrix coordinate - single index or [start, end] range
 */
export type MatrixCoord = number | [number, number]

/**
 * Section coordinate value - [colCoord, rowCoord]
 */
export type SectionCoordValue = [MatrixCoord, MatrixCoord]

/**
 * Map of section IDs to their coordinates
 */
export type SectionCoordMap = Record<string, SectionCoordValue>

/**
 * Parsed layout for a specific breakpoint
 */
export interface ParsedLayout {
	columns: number
	rows: number
	sectionCoordMap: SectionCoordMap
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * EfxChart component props
 */
export interface EfxChartProps<TSection extends string = string> {
	// ===== REQUIRED =====

	/** Section ID - must match a section name in the layout template */
	section: TSection

	// ===== SECTION TITLE =====

	/** Section title displayed above the chart */
	title?: EfxTitleOption

	// ===== CHART TYPE & DATA =====

	/** Chart type */
	type?: EfxChartType

	/** Chart data */
	data?: unknown[]

	// ===== AXIS CONFIGURATION =====

	/** X-axis options */
	xAxis?: EfxAxisOption

	/** Y-axis options */
	yAxis?: EfxAxisOption

	/** Swap X/Y axes (for horizontal bar charts) */
	invertAxis?: boolean

	// ===== SERIES CONFIGURATION =====

	/** Series-specific options (merged with type defaults) */
	series?: Partial<EfxSeriesOption>

	// ===== PADDING =====

	/** Internal chart padding - flexible format */
	padding?: EfxPadding

	// ===== GRID STYLING (Native ECharts) =====

	/** Background color */
	backgroundColor?: string

	/** Border color */
	borderColor?: string

	/** Border width in pixels */
	borderWidth?: number

	/** Shadow blur radius */
	shadowBlur?: number

	/** Shadow color */
	shadowColor?: string

	/** Shadow X offset */
	shadowOffsetX?: number

	/** Shadow Y offset */
	shadowOffsetY?: number

	// ===== INTERACTION =====

	/** Emphasis state styling */
	emphasis?: EfxEmphasisOption

	/**
	 * Axis pointer (crosshair) configuration for this chart's grid
	 * Applied to grid.tooltip.axisPointer to maintain tooltip isolation
	 * - `type`: 'line' (x only), 'cross' (x and y), 'shadow', 'none'
	 * - `label`: { show: true } to display value labels on axes
	 * - `snap`: true to snap crosshair to data points (shows actual values)
	 */
	axisPointer?: {
		type?: "line" | "cross" | "shadow" | "none"
		snap?: boolean
		label?: { show?: boolean; precision?: number | "auto" }
		lineStyle?: {
			color?: string
			width?: number
			type?: "solid" | "dashed" | "dotted"
		}
		shadowStyle?: { color?: string; opacity?: number }
		crosshairStyle?: {
			color?: string
			width?: number
			type?: "solid" | "dashed" | "dotted"
		}
	}

	/**
	 * Tooltip configuration
	 * - `show`: false to disable tooltip for this section
	 * - `trigger`: 'item' | 'axis' (default from global)
	 * - `simple`: true for simplified format (series: value only, no redundant date/category)
	 */
	tooltip?: {
		show?: boolean
		trigger?: "item" | "axis"
		simple?: boolean
		formatter?: string | ((params: unknown) => string)
	}

	// ===== ANIMATION =====

	animation?: boolean
	animationType?: "expansion" | "scale"
	animationDuration?: number
	animationEasing?: string

	// ===== ADVANCED =====

	/** Raw ECharts option override (merged last) */
	echartsOption?: Partial<EChartsOption>

	/** React element injection (rendered as DOM overlay) */
	children?: ReactNode
}

/**
 * EfxChartsLayout component props
 */
export interface EfxChartsLayoutProps<
	TTemplate extends EfxLayoutTemplate = EfxLayoutTemplate,
> {
	/** Layout template (ASCII-based) */
	template: TTemplate

	/** Sidebar position for templates with sidebar sections */
	sidebarPosition?: "left" | "right"

	// ===== GAP SPACING =====

	/** Uniform gap between all sections in pixels */
	gap?: number

	/** Horizontal gap between columns in pixels (overrides gap for x-axis) */
	gapX?: number

	/** Vertical gap between rows in pixels (overrides gap for y-axis) */
	gapY?: number

	/** Custom breakpoints for responsive behavior */
	breakpoints?: {
		mobile?: { maxWidth: number }
		tablet?: { minWidth: number; maxWidth: number }
	}

	/** Container styling */
	className?: string
	style?: CSSProperties

	/** EfxChart children */
	children: ReactNode

	// ===== EVENT HANDLING (Custom React Layer) =====

	/** Callback when chart instance is ready */
	onChartReady?: (instance: ECharts) => void

	/**
	 * Event handlers - same API as echarts-for-react onEvents
	 * Keys are ECharts event names, values are handler functions
	 */
	onEvents?: Record<string, EfxEventHandler>

	// ===== RENDERING OPTIONS =====

	/** Renderer type */
	renderer?: "canvas" | "svg"

	/** Theme name (must be registered with echarts.registerTheme) */
	theme?: string

	// ===== STREAMING OPTIONS =====

	/**
	 * Loading strategy for chart sections
	 * - 'simple': All data loads together (default)
	 * - 'streaming': Each section loads independently with visual feedback
	 */
	loadingStrategy?: "simple" | "streaming"

	/**
	 * Loading state for each section (streaming mode only)
	 * Map of section ID to boolean (true = loading, false = loaded)
	 */
	sectionLoadingStates?: Record<string, boolean>

	/**
	 * Spinner size for loading indicators (streaming mode only)
	 * @default 'md'
	 */
	spinnerSize?: 'xs' | 'sm' | 'md' | 'lg'
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Options for useEChartsInstance hook
 */
export interface UseEChartsOptions {
	/** ECharts option configuration */
	option: EChartsOption
	/** Event handlers (same API as echarts-for-react onEvents) */
	events?: Record<string, EfxEventHandler>
	/** Callback when chart instance is ready */
	onReady?: (chart: ECharts) => void
	/** Theme name (must be registered with echarts.registerTheme) */
	theme?: string
	/** Renderer type */
	renderer?: "canvas" | "svg"
	/** Whether to auto-resize on container size change */
	autoResize?: boolean
}

/**
 * Return type for useEChartsInstance hook
 */
export interface UseEChartsReturn {
	/** Get the ECharts instance */
	getEchartsInstance: () => ECharts | null
	/** Ref to the ECharts instance */
	instanceRef: React.MutableRefObject<ECharts | null>
}

// ============================================================================
// Re-exports for convenience
// ============================================================================

export type { ECharts, EChartsOption }

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Extract section IDs from a template as a union type
 */
export type ExtractSections<T extends EfxLayoutTemplate> =
	T["sections"][number]
