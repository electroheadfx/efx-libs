/**
 * Option Builder Utility
 *
 * Builds ECharts options from EfxChart props.
 */

import type { EChartsCoreOption } from "../core"
import type {
  EfxChartProps,
  EfxTitleOption,
  SectionCoordMap,
} from "../types"
import { parsePadding } from "./paddingParser"
import {
  coordsToPercentages,
  coordsToPercentagesWithGap,
  type GapConfig,
  type ContainerSize,
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

/**
 * Default reference container size for converting pixel padding to percentages
 * This allows responsive padding that scales with container size
 */
const REFERENCE_CONTAINER_SIZE = 600

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
 * Apply padding to grid percentages by converting pixel values to percentage offsets
 * This creates internal margins within each section
 * 
 * IMPORTANT: User-provided top padding is treated as the TOTAL offset from section top
 * (matching finance.js behavior where grid.top: 50 includes space for title at top: 15)
 * If no user top padding is specified, a default title reserve is applied
 */
function applyPaddingToPercentages(
  percentages: { left: string; right: string; top: string; bottom: string },
  padding: { top: number; right: number; bottom: number; left: number } | undefined,
  hasTitle: boolean,
): { left: string; right: string; top: string; bottom: string } {
  // Convert pixel padding to percentage offsets (relative to reference container)
  const leftOffset = padding ? (padding.left / REFERENCE_CONTAINER_SIZE) * 100 : 0
  const rightOffset = padding ? (padding.right / REFERENCE_CONTAINER_SIZE) * 100 : 0
  const bottomOffset = padding ? (padding.bottom / REFERENCE_CONTAINER_SIZE) * 100 : 0

  // For top: User padding is the TOTAL offset (like finance.js grid.top: 50)
  // Only apply default title reserve if user didn't specify top padding
  let topOffset: number
  if (padding && padding.top > 0) {
    // User specified top padding - use it directly as total offset
    topOffset = (padding.top / REFERENCE_CONTAINER_SIZE) * 100
  } else if (hasTitle) {
    // No user top padding but has title - apply default reserve
    topOffset = (DEFAULT_TITLE_RESERVED_HEIGHT / REFERENCE_CONTAINER_SIZE) * 100
  } else {
    // No title and no user padding - no offset
    topOffset = 0
  }

  // Apply offsets to percentages (adding to positions = moving inward)
  const left = parseFloat(percentages.left) + leftOffset
  const right = parseFloat(percentages.right) + rightOffset
  const top = parseFloat(percentages.top) + topOffset
  const bottom = parseFloat(percentages.bottom) + bottomOffset

  return {
    left: `${left}%`,
    right: `${right}%`,
    top: `${top}%`,
    bottom: `${bottom}%`,
  }
}

/**
 * Build grid configuration for a section
 */
function buildGrid(
  sectionId: string,
  percentages: { left: string; right: string; top: string; bottom: string },
  props: EfxChartProps,
  padding: { top: number; right: number; bottom: number; left: number } | undefined,
  hasTitle: boolean,
): object {
  // Apply padding to create internal margins (includes reserved title height if hasTitle)
  const paddedPercentages = applyPaddingToPercentages(percentages, padding, hasTitle)

  return {
    id: sectionId,
    left: paddedPercentages.left,
    right: paddedPercentages.right,
    top: paddedPercentages.top,
    bottom: paddedPercentages.bottom,
    containLabel: true, // Auto-adjust for axis labels
    // Native ECharts grid styling
    backgroundColor: props.backgroundColor,
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
    shadowBlur: props.shadowBlur,
    shadowColor: props.shadowColor,
    shadowOffsetX: props.shadowOffsetX,
    shadowOffsetY: props.shadowOffsetY,
    show: !!props.backgroundColor || !!props.borderColor,
  }
}

/**
 * Build xAxis configuration
 */
function buildXAxis(
  props: EfxChartProps,
  gridIndex: number,
  invertAxis: boolean,
): object {
  const axis = invertAxis ? props.yAxis : props.xAxis

  return {
    gridIndex,
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
  }
}

/**
 * Build yAxis configuration
 */
function buildYAxis(
  props: EfxChartProps,
  gridIndex: number,
  invertAxis: boolean,
): object {
  const axis = invertAxis ? props.xAxis : props.yAxis

  return {
    gridIndex,
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
  }
}

/**
 * Transform data for chart type
 * Extracts values from objects for category-based charts
 */
function transformData(
  data: unknown,
  chartType: string | undefined,
): unknown {
  if (!data || !Array.isArray(data)) return data

  // For line/bar with category axis, extract values from objects
  if (chartType === "line" || chartType === "bar" || chartType === "area") {
    // Check if data is array of objects with value property
    if (data.length > 0 && typeof data[0] === "object" && data[0] !== null && "value" in data[0]) {
      return data.map((d: { value: unknown }) => d.value)
    }
  }

  return data
}

/**
 * Build series configuration
 */
function buildSeries(
  props: EfxChartProps,
  xAxisIndex: number,
  yAxisIndex: number,
  gridPercentages?: { left: string; right: string; top: string; bottom: string },
): object {
  // Transform data based on chart type
  const transformedData = transformData(props.data, props.type)

  const baseConfig = {
    xAxisIndex,
    yAxisIndex,
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
      // Calculate pie center relative to grid area if no custom center provided
      let pieCenter = props.series?.center
      if (!pieCenter && gridPercentages) {
        // Parse grid percentages
        const left = parseFloat(gridPercentages.left)
        const right = parseFloat(gridPercentages.right)
        const top = parseFloat(gridPercentages.top)
        const bottom = parseFloat(gridPercentages.bottom)

        // Calculate center of the grid area
        const centerX = left + (100 - left - right) / 2
        const centerY = top + (100 - top - bottom) / 2
        pieCenter = [`${centerX}%`, `${centerY}%`]
      }

      return {
        type: "pie",
        center: pieCenter ?? ["50%", "50%"],
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

/**
 * Build complete ECharts option from EfxChart children and layout
 */
export function buildEChartsOption(
  sections: EfxChartProps[],
  sectionCoordMap: SectionCoordMap,
  columns: number,
  rows: number,
  gap?: GapConfig,
  containerSize?: ContainerSize,
): EChartsCoreOption {
  // Use gap-aware function if gap is provided and container has dimensions
  const hasGap = gap && (gap.x > 0 || gap.y > 0)
  const hasContainerSize = containerSize && containerSize.width > 0 && containerSize.height > 0

  const percentages = hasGap && hasContainerSize
    ? coordsToPercentagesWithGap(sectionCoordMap, columns, rows, gap, containerSize)
    : coordsToPercentages(sectionCoordMap, columns, rows)

  const grids: object[] = []
  const xAxes: object[] = []
  const yAxes: object[] = []
  const series: object[] = []
  const titles: object[] = []

  // Track grid index separately since ALL sections get a grid
  let gridIndex = 0
  // Track axis index separately since only chart sections get axes
  let axisIndex = 0

  // Process each section
  for (const section of sections) {
    const sectionPercentages = percentages[section.id]

    if (!sectionPercentages) continue

    const invertAxis = section.invertAxis ?? false
    const currentGridIndex = gridIndex
    gridIndex++

    // Parse padding for this section
    const padding = parsePadding(section.padding)

    // Check if section has a title
    const hasTitle = !!section.title

    // Build grid with internal padding (includes reserved title height if hasTitle)
    grids.push(buildGrid(section.id, sectionPercentages, section, padding, hasTitle))

    // Add title for this section - replicating finance.js behavior
    // Finance.js uses: coordinateSystem: 'matrix', left: 'center', top: 15
    // Without matrix extension: position title at section center point
    const sectionTitle = buildTitle(section.title)
    if (sectionTitle) {
      // Get section boundaries as percentages from edges
      const sectionLeft = parseFloat(sectionPercentages.left)
      const sectionRight = parseFloat(sectionPercentages.right)
      const sectionTop = parseFloat(sectionPercentages.top)

      // Calculate section center X position (like finance.js left: 'center')
      const sectionWidth = 100 - sectionLeft - sectionRight
      const sectionCenterX = sectionLeft + sectionWidth / 2

      // Calculate title positioning
      const padding = parsePadding(section.padding)
      const hasChart = !!section.type

      // For title-only sections (no chart): center title in the section
      // For chart sections: center title in the title area above the chart
      let titleTop: number
      if (!hasChart) {
        // Title-only section: center title vertically in the entire section
        const sectionHeight = 100 - sectionTop - parseFloat(sectionPercentages.bottom)
        const titleCenterY = sectionTop + sectionHeight / 2 - (TITLE_TEXT_HEIGHT / REFERENCE_CONTAINER_SIZE) * 100 / 2
        titleTop = titleCenterY
      } else {
        // Chart section: center title in the title area (top padding)
        const titleAreaHeight = padding && padding.top > 0
          ? padding.top
          : DEFAULT_TITLE_RESERVED_HEIGHT
        const titleTopOffset = Math.max(5, (titleAreaHeight - TITLE_TEXT_HEIGHT) / 2)
        const titleTopOffsetPercent = (titleTopOffset / REFERENCE_CONTAINER_SIZE) * 100
        titleTop = sectionTop + titleTopOffsetPercent
      }

      // Position title at section center with textAlign: 'center'
      // This centers the text around the center point
      titles.push({
        ...sectionTitle,
        left: `${sectionCenterX}%`,
        top: `${titleTop}%`,
        textAlign: 'center',
      })
    }

    // Only add axes and series if there's a chart type
    if (section.type) {
      const currentAxisIndex = axisIndex
      axisIndex++

      // Build axes - gridIndex points to the grid array position
      xAxes.push(buildXAxis(section, currentGridIndex, invertAxis))
      yAxes.push(buildYAxis(section, currentGridIndex, invertAxis))

      // Build series - axisIndex points to the axis array position
      // Pass grid percentages for pie chart positioning
      series.push(buildSeries(section, currentAxisIndex, currentAxisIndex, sectionPercentages))
    }
  }

  const option: EChartsCoreOption = {
    backgroundColor: "transparent",
    title: titles,
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },
  }

  return option
}

/**
 * Build media query definitions for responsive layouts
 */
export function buildMediaDefinitions(
  mobileLayout: { sectionCoordMap: SectionCoordMap; columns: number; rows: number },
  desktopLayout: { sectionCoordMap: SectionCoordMap; columns: number; rows: number },
  sections: EfxChartProps[],
  mobileMaxWidth = 500,
  gap?: GapConfig,
  containerSize?: ContainerSize,
): EfxMediaUnit[] {
  // Use gap-aware function if gap is provided and container has dimensions
  const hasGap = gap && (gap.x > 0 || gap.y > 0)
  const hasContainerSize = containerSize && containerSize.width > 0 && containerSize.height > 0

  const mobilePercentages = hasGap && hasContainerSize
    ? coordsToPercentagesWithGap(
      mobileLayout.sectionCoordMap,
      mobileLayout.columns,
      mobileLayout.rows,
      gap,
      containerSize
    )
    : coordsToPercentages(
      mobileLayout.sectionCoordMap,
      mobileLayout.columns,
      mobileLayout.rows,
    )

  const desktopPercentages = hasGap && hasContainerSize
    ? coordsToPercentagesWithGap(
      desktopLayout.sectionCoordMap,
      desktopLayout.columns,
      desktopLayout.rows,
      gap,
      containerSize
    )
    : coordsToPercentages(
      desktopLayout.sectionCoordMap,
      desktopLayout.columns,
      desktopLayout.rows,
    )

  // Build grid options for each section with valid percentages - MUST apply padding
  const buildGridOptions = (
    percentages: Record<string, { left: string; right: string; top: string; bottom: string }>,
  ) =>
    sections
      .filter((section) => percentages[section.id])
      .map((section) => {
        const p = percentages[section.id]
        const padding = parsePadding(section.padding)
        const hasTitle = !!section.title

        // Apply padding (same logic as buildGrid)
        const paddedPercentages = applyPaddingToPercentages(
          { left: p.left, right: p.right, top: p.top, bottom: p.bottom },
          padding,
          hasTitle
        )

        return {
          id: section.id,
          left: paddedPercentages.left,
          right: paddedPercentages.right,
          top: paddedPercentages.top,
          bottom: paddedPercentages.bottom,
        }
      })

  // Build title options for sections with titles - position at section center
  const buildTitleOptions = (
    percentages: Record<string, { left: string; right: string; top: string; bottom: string }>,
  ) =>
    sections
      .filter((s) => s.title && percentages[s.id])
      .map((section) => {
        const p = percentages[section.id]
        const sectionLeft = parseFloat(p.left)
        const sectionRight = parseFloat(p.right)
        const sectionTop = parseFloat(p.top)

        // Calculate section center X position
        const sectionWidth = 100 - sectionLeft - sectionRight
        const sectionCenterX = sectionLeft + sectionWidth / 2

        // Calculate title positioning for responsive layouts
        const padding = parsePadding(section.padding)
        const hasChart = !!section.type

        let titleTop: number
        if (!hasChart) {
          // Title-only section: center in section
          const sectionHeight = 100 - sectionTop - parseFloat(p.bottom)
          const titleCenterY = sectionTop + sectionHeight / 2 - (TITLE_TEXT_HEIGHT / REFERENCE_CONTAINER_SIZE) * 100 / 2
          titleTop = titleCenterY
        } else {
          // Chart section: center in title area
          const titleAreaHeight = padding && padding.top > 0
            ? padding.top
            : DEFAULT_TITLE_RESERVED_HEIGHT
          const titleTopOffset = Math.max(5, (titleAreaHeight - TITLE_TEXT_HEIGHT) / 2)
          const titleTopOffsetPercent = (titleTopOffset / REFERENCE_CONTAINER_SIZE) * 100
          titleTop = sectionTop + titleTopOffsetPercent
        }

        // Position title at section center
        return {
          left: `${sectionCenterX}%`,
          top: `${titleTop}%`,
          textAlign: 'center',
        }
      })

  return [
    {
      query: { maxWidth: mobileMaxWidth },
      option: {
        grid: buildGridOptions(mobilePercentages),
        title: buildTitleOptions(mobilePercentages),
      },
    },
    {
      query: { minWidth: mobileMaxWidth + 1 },
      option: {
        grid: buildGridOptions(desktopPercentages),
        title: buildTitleOptions(desktopPercentages),
      },
    },
  ]
}
