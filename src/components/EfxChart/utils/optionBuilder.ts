/**
 * Option Builder Utility
 *
 * Builds ECharts options from EfxChart props.
 */

import type { EChartsCoreOption } from "../core"
import type { EfxChartProps, EfxTitleOption, SectionCoordMap } from "../types"
import { parsePadding } from "./paddingParser"
import {
	type ContainerSize,
	coordsToPercentages,
	coordsToPercentagesWithGap,
	type GapConfig,
} from "./templateParser"

/**
 * ECharts MediaUnit type for responsive media queries
 */
export interface EfxMediaUnit {
	query?: {
		minWidth?: number
		maxWidth?: number
		minHeight?: number
		maxHeight?: number
		minAspectRatio?: number
		maxAspectRatio?: number
	}
	option: Record<string, unknown>
}

/**
 * Build title configuration from EfxChart title prop
 */
function buildTitle(
	title: EfxTitleOption | undefined,
): { text: string; subtext?: string; textStyle: object } | undefined {
	if (!title) return undefined

	if (typeof title === "string") {
		return {
			text: title,
			textStyle: { color: "#aaa", fontSize: 14 },
		}
	}

	return {
		text: title.text,
		subtext: title.subtext,
		textStyle: {
			fontSize: title.textStyle?.fontSize ?? 14,
			color: title.textStyle?.color ?? "#aaa",
			fontWeight: title.textStyle?.fontWeight ?? "normal",
		},
	}
}

// Note: Percentage-based positioning is no longer used.
// The matrix coordinate system (finance.js pattern) uses pixel-based internal padding
// and coord-based positioning in media queries.

/**
 * Default reserved height for title area (in pixels)
 * Only applied when user doesn't specify top padding
 * Finance.js uses grid.top: 30-50, title.top: 5-15
 */
const DEFAULT_TITLE_RESERVED_HEIGHT = 30

/**
 * Estimated title text height in pixels (fontSize 14 + line height)
 * Used to vertically center title within the title area
 */
const TITLE_TEXT_HEIGHT = 20

/**
 * Default internal grid padding (in pixels) - finance.js pattern
 */
const DEFAULT_GRID_PADDING = 10

/**
 * Build grid configuration for a section - FINANCE.JS PATTERN
 * Uses matrix coordinate system with pixel-based internal padding
 * Position comes from coord in media queries, NOT from left/right/top/bottom here
 */
function buildGrid(
	sectionId: string,
	props: EfxChartProps,
	padding:
		| { top: number; right: number; bottom: number; left: number }
		| undefined,
	hasTitle: boolean,
	gap?: GapConfig,
): object {
	// Internal padding in PIXELS (within matrix cell) - finance.js pattern
	const topPadding =
		padding?.top ??
		(hasTitle ? DEFAULT_TITLE_RESERVED_HEIGHT + 20 : DEFAULT_GRID_PADDING)
	const bottomPadding = padding?.bottom ?? DEFAULT_GRID_PADDING
	const leftPadding = padding?.left ?? DEFAULT_GRID_PADDING
	const rightPadding = padding?.right ?? DEFAULT_GRID_PADDING

	// Outer bounds for gaps (space between matrix cells) - FINANCE.JS PATTERN
	// Finance.js uses values like { top: 30, left: 20, bottom: 20, right: 20 }
	// Always include outerBounds for proper spacing
	const gapX = gap?.x ?? 0
	const gapY = gap?.y ?? 0
	const outerTop = gapY > 0 ? gapY / 2 : 20
	const outerBottom = gapY > 0 ? gapY / 2 : 20
	const outerLeft = gapX > 0 ? gapX / 2 : 20
	const outerRight = gapX > 0 ? gapX / 2 : 20

	return {
		id: sectionId,
		// Matrix coordinate system - position set by coord in media queries
		coordinateSystem: "matrix",
		// Per-grid tooltip for tooltip isolation (FINANCE.JS PATTERN)
		// axisPointer configured here (not on individual axes) to maintain isolation
		tooltip: {
			trigger: "axis",
			...(props.axisPointer && { axisPointer: props.axisPointer }),
		},
		// Internal padding in PIXELS (within the matrix cell)
		top: topPadding,
		bottom: bottomPadding,
		left: leftPadding,
		right: rightPadding,
		// Outer bounds for spacing between sections - ALWAYS included (finance.js pattern)
		outerBounds: {
			top: outerTop,
			bottom: outerBottom,
			left: outerLeft,
			right: outerRight,
		},
		// Optional styling props - only include if defined
		...(props.backgroundColor && { backgroundColor: props.backgroundColor }),
		...(props.borderColor && { borderColor: props.borderColor }),
		...(props.borderWidth && { borderWidth: props.borderWidth }),
		...((props.backgroundColor || props.borderColor) && { show: true }),
	}
}

/**
 * Build xAxis configuration - FINANCE.JS PATTERN with ID-based linking
 */
function buildXAxis(
	sectionId: string,
	props: EfxChartProps,
	invertAxis: boolean,
): object {
	const axis = invertAxis ? props.yAxis : props.xAxis

	return {
		id: sectionId,
		gridId: sectionId, // ID-based linking (finance.js pattern)
		type: axis?.type ?? "category",
		data: axis?.data,
		name: axis?.name,
		nameLocation: axis?.nameLocation,
		inverse: axis?.inverse,
		min: axis?.min,
		max: axis?.max,
		splitNumber: axis?.splitNumber,
		splitLine: axis?.splitLine ?? { show: false },
		axisLine: axis?.axisLine ?? { lineStyle: { color: "#666" } },
		axisLabel: {
			show: axis?.axisLabel?.show ?? true,
			hideOverlap: axis?.axisLabel?.hideOverlap ?? true,
			rotate: axis?.axisLabel?.rotate,
			formatter: axis?.axisLabel?.formatter,
		},
		axisTick: axis?.axisTick,
		...(axis?.axisPointer && { axisPointer: axis.axisPointer }),
	}
}

/**
 * Build yAxis configuration - FINANCE.JS PATTERN with ID-based linking
 */
function buildYAxis(
	sectionId: string,
	props: EfxChartProps,
	invertAxis: boolean,
): object {
	const axis = invertAxis ? props.xAxis : props.yAxis

	return {
		id: sectionId,
		gridId: sectionId, // ID-based linking (finance.js pattern)
		type: axis?.type ?? "value",
		data: axis?.data,
		name: axis?.name,
		nameLocation: axis?.nameLocation,
		inverse: axis?.inverse,
		min: axis?.min,
		max: axis?.max,
		splitNumber: axis?.splitNumber,
		splitLine: axis?.splitLine ?? { show: false },
		axisLine: axis?.axisLine ?? { lineStyle: { color: "#666" } },
		axisLabel: {
			show: axis?.axisLabel?.show ?? true,
			hideOverlap: axis?.axisLabel?.hideOverlap ?? true,
			rotate: axis?.axisLabel?.rotate,
			formatter: axis?.axisLabel?.formatter,
		},
		axisTick: axis?.axisTick,
		...(axis?.axisPointer && { axisPointer: axis.axisPointer }),
	}
}

/**
 * Transform data for chart type
 * Extracts values from objects for category-based charts
 */
function transformData(data: unknown, chartType: string | undefined): unknown {
	if (!data || !Array.isArray(data)) return data

	// For line/bar with category axis, extract values from objects
	if (chartType === "line" || chartType === "bar" || chartType === "area") {
		// Check if data is array of objects with value property
		if (
			data.length > 0 &&
			typeof data[0] === "object" &&
			data[0] !== null &&
			"value" in data[0]
		) {
			return data.map((d: { value: unknown }) => d.value)
		}
	}

	return data
}

/**
 * Build series configuration - FINANCE.JS PATTERN with ID-based linking
 */
function buildSeries(sectionId: string, props: EfxChartProps): object {
	// Transform data based on chart type
	const transformedData = transformData(props.data, props.type)

	const baseConfig = {
		id: sectionId,
		xAxisId: sectionId, // ID-based linking (finance.js pattern)
		yAxisId: sectionId, // ID-based linking (finance.js pattern)
		data: transformedData,
		animation: props.animation ?? true,
		animationDuration: props.animationDuration ?? 1000,
		animationEasing: props.animationEasing ?? "cubicOut",
		emphasis: props.emphasis,
		...props.series,
	}

	switch (props.type) {
		case "line":
			return {
				type: "line",
				smooth: props.series?.smooth ?? false,
				symbol: props.series?.symbol ?? "circle",
				symbolSize: props.series?.symbolSize ?? 4,
				lineStyle: props.series?.lineStyle,
				areaStyle: props.series?.areaStyle,
				...baseConfig,
			}

		case "bar":
			return {
				type: "bar",
				barWidth: props.series?.barWidth,
				barMaxWidth: props.series?.barMaxWidth,
				barGap: props.series?.barGap,
				itemStyle: props.series?.itemStyle,
				...baseConfig,
			}

		case "scatter":
			return {
				type: "scatter",
				symbol: props.series?.symbol ?? "circle",
				symbolSize: props.series?.symbolSize ?? 10,
				itemStyle: props.series?.itemStyle,
				...baseConfig,
			}

		case "area":
			return {
				type: "line",
				smooth: props.series?.smooth ?? false,
				symbol: props.series?.symbol ?? "none",
				areaStyle: props.series?.areaStyle ?? { opacity: 0.5 },
				lineStyle: props.series?.lineStyle,
				...baseConfig,
			}

		case "pie": {
			return {
				type: "pie",
				id: sectionId,
				center: props.series?.center ?? ["50%", "50%"],
				radius: props.series?.radius ?? "60%",
				roseType: props.series?.roseType,
				itemStyle: props.series?.itemStyle,
				label: props.series?.label,
				data: props.data,
				animation: props.animation ?? true,
				emphasis: props.emphasis,
			}
		}

		default:
			return {
				type: props.type ?? "line",
				...baseConfig,
			}
	}
}

// Loading opacity removed - no transparency during loading

/**
 * Build complete ECharts option from EfxChart children and layout
 */
export function buildEChartsOption(
	sections: EfxChartProps<string>[],
	sectionCoordMap: SectionCoordMap,
	columns: number,
	rows: number,
	gap?: GapConfig,
	containerSize?: ContainerSize,
	_sectionLoadingStates?: Record<string, boolean>,
): EChartsCoreOption {
	// Use gap-aware function if gap is provided and container has dimensions
	const hasGap = gap && (gap.x > 0 || gap.y > 0)
	const hasContainerSize =
		containerSize && containerSize.width > 0 && containerSize.height > 0

	const percentages =
		hasGap && hasContainerSize
			? coordsToPercentagesWithGap(
				sectionCoordMap,
				columns,
				rows,
				gap,
				containerSize,
			)
			: coordsToPercentages(sectionCoordMap, columns, rows)

	const grids: object[] = []
	const xAxes: object[] = []
	const yAxes: object[] = []
	const series: object[] = []
	const titles: object[] = []

	// Process each section
	for (const section of sections) {
		const sectionPercentages = percentages[section.section]

		if (!sectionPercentages) continue

		const invertAxis = section.invertAxis ?? false

		// Parse padding for this section
		const padding = parsePadding(section.padding)

		// Check if section has a title
		const hasTitle = !!section.title

		// Build grid with matrix coordinate system (finance.js pattern)
		grids.push(buildGrid(section.section, section, padding, hasTitle, gap))

		// Add title for this section - FINANCE.JS PATTERN
		// coordinateSystem: 'matrix', left: 'center', top: <pixels>
		const sectionTitle = buildTitle(section.title)
		if (sectionTitle) {
			const padding = parsePadding(section.padding)
			const hasChart = !!section.type

			// Calculate title top position in PIXELS (within matrix cell)
			let titleTop: number
			if (!hasChart) {
				titleTop = 15 // Title-only section
			} else {
				const titleAreaHeight =
					padding && padding.top > 0
						? padding.top
						: DEFAULT_TITLE_RESERVED_HEIGHT
				titleTop = Math.max(5, (titleAreaHeight - TITLE_TEXT_HEIGHT) / 2)
			}

			titles.push({
				...sectionTitle,
				id: `title_${section.section}`,
				coordinateSystem: "matrix",
				left: "center",
				top: titleTop,
				textStyle: sectionTitle.textStyle,
			})
		}

		// Only add axes and series if there's a chart type
		if (section.type) {
			// Build axes - ID-based linking (finance.js pattern)
			const xAxis = buildXAxis(section.section, section, invertAxis)
			const yAxis = buildYAxis(section.section, section, invertAxis)

			xAxes.push(xAxis)
			yAxes.push(yAxis)

			// Build series - ID-based linking (finance.js pattern)
			const seriesConfig = buildSeries(section.section, section)
			series.push(seriesConfig)
		}
	}

	// Matrix configuration - FINANCE.JS PATTERN
	// IMPORTANT: Initial data arrays must be EMPTY
	// The actual dimensions come from coord in media queries
	const matrixConfig = {
		x: { show: false, data: [] }, // Empty initially - filled by media queries
		y: { show: false, data: [] }, // Empty initially - filled by media queries
		body: { itemStyle: { borderColor: "none" } },
		backgroundStyle: { borderColor: "none" },
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	}

	// Note: media is NOT included here - it's added by EfxChartsLayout
	// using buildMediaDefinitions which includes the default + responsive layouts
	// FINANCE.JS PATTERN: Only matrix and tooltip: {} at root level - NO axisPointer
	const option: EChartsCoreOption = {
		backgroundColor: "transparent",
		matrix: matrixConfig,
		title: titles,
		grid: grids,
		xAxis: xAxes,
		yAxis: yAxes,
		series,
		tooltip: {}, // Empty - per-grid tooltips configured via grid.tooltip
	}

	return option
}

/**
 * Build media query definitions for responsive layouts - FINANCE.JS PATTERN
 * Uses coord-based positioning with matrix coordinate system
 *
 * IMPORTANT: Order matters!
 * - First: media with query (e.g., mobile)
 * - Last: default media (no query) - this is the fallback
 */
export function buildMediaDefinitions(
	mobileLayout: {
		sectionCoordMap: SectionCoordMap
		columns: number
		rows: number
	},
	desktopLayout: {
		sectionCoordMap: SectionCoordMap
		columns: number
		rows: number
	},
	sections: EfxChartProps<string>[],
	mobileMaxWidth = 500,
	_gap?: GapConfig,
	_containerSize?: ContainerSize,
): EfxMediaUnit[] {
	// Build coord-based grid options - FINANCE.JS PATTERN
	const buildGridCoords = (sectionCoordMap: SectionCoordMap) =>
		sections
			.filter((section) => sectionCoordMap[section.section])
			.map((section) => ({
				id: section.section,
				coord: sectionCoordMap[section.section],
			}))

	// Build coord-based title options
	const buildTitleCoords = (sectionCoordMap: SectionCoordMap) =>
		sections
			.filter((s) => s.title && sectionCoordMap[s.section])
			.map((section) => ({
				id: `title_${section.section}`,
				coord: sectionCoordMap[section.section],
			}))

	// FINANCE.JS PATTERN: mobile (with query) FIRST, default (no query) LAST
	return [
		// Mobile layout (with query) - FIRST
		{
			query: { maxWidth: mobileMaxWidth },
			option: {
				matrix: {
					x: { data: Array(mobileLayout.columns).fill(null) },
					y: { data: Array(mobileLayout.rows).fill(null) },
				},
				grid: buildGridCoords(mobileLayout.sectionCoordMap),
				title: buildTitleCoords(mobileLayout.sectionCoordMap),
			},
		},
		// Default layout (no query) - LAST (fallback/desktop)
		{
			option: {
				matrix: {
					x: { data: Array(desktopLayout.columns).fill(null) },
					y: { data: Array(desktopLayout.rows).fill(null) },
				},
				grid: buildGridCoords(desktopLayout.sectionCoordMap),
				title: buildTitleCoords(desktopLayout.sectionCoordMap),
			},
		},
	]
}
