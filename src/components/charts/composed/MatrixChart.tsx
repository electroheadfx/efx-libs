"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useEffect, useId, useRef } from "react";
import { useAppTheme } from "@/providers/ThemeProvider";
import type {
	MatrixChartProps,
	MatrixSection,
	MediaDefinition,
} from "@/types/matrixLayout.types";
import type { EChartsInstance } from "@/types/theme.types";

/**
 * MatrixChart - Combines multiple chart sections into a single ECharts instance
 * using percentage-based grid positioning.
 */
export function MatrixChart({
	sections,
	mediaDefinitions,
	className = "",
	style,
	onChartReady,
}: MatrixChartProps) {
	const chartId = useId();
	const { echartsTheme, registerChart, unregisterChart } = useAppTheme();
	const chartRef = useRef<ReactECharts | null>(null);

	// Build combined option from sections
	const option = buildMatrixOption(sections, mediaDefinitions);

	// Register/unregister chart with theme provider
	useEffect(() => {
		const instance = chartRef.current?.getEchartsInstance();
		if (instance) {
			registerChart(chartId, instance as unknown as EChartsInstance);
			onChartReady?.(instance);
		}

		return () => {
			unregisterChart(chartId);
		};
	}, [chartId, registerChart, unregisterChart, onChartReady]);

	return (
		<ReactECharts
			ref={chartRef}
			option={option}
			theme={echartsTheme}
			className={className}
			style={{ height: "100%", width: "100%", ...style }}
		/>
	);
}

/**
 * Calculate grid position as percentages based on section coordinates
 */
function calculateGridPosition(
	coords: [number | [number, number], number | [number, number]],
	totalCols: number,
	totalRows: number,
	gap = 2, // percentage gap
): { left: string; top: string; width: string; height: string } {
	const [colCoord, rowCoord] = coords;

	const colStart = Array.isArray(colCoord) ? colCoord[0] : colCoord;
	const colEnd = Array.isArray(colCoord) ? colCoord[1] : colCoord;
	const rowStart = Array.isArray(rowCoord) ? rowCoord[0] : rowCoord;
	const rowEnd = Array.isArray(rowCoord) ? rowCoord[1] : rowCoord;

	const colSpan = colEnd - colStart + 1;
	const rowSpan = rowEnd - rowStart + 1;

	const cellWidth = (100 - gap * (totalCols + 1)) / totalCols;
	const cellHeight = (100 - gap * (totalRows + 1)) / totalRows;

	const left = gap + colStart * (cellWidth + gap);
	const top = gap + rowStart * (cellHeight + gap);
	const width = colSpan * cellWidth + (colSpan - 1) * gap;
	const height = rowSpan * cellHeight + (rowSpan - 1) * gap;

	return {
		left: `${left}%`,
		top: `${top}%`,
		width: `${width}%`,
		height: `${height}%`,
	};
}

/**
 * Build combined ECharts option from sections and media definitions
 */
function buildMatrixOption(
	sections: MatrixSection[],
	mediaDefinitions: MediaDefinition[],
): EChartsOption {
	// Use the first (default) media definition for now
	const defaultMedia = mediaDefinitions[0];
	if (!defaultMedia) {
		return { title: { text: "No layout defined" } };
	}

	const totalCols = defaultMedia.matrix.x.data.length;
	const totalRows = defaultMedia.matrix.y.data.length;

	const grids: unknown[] = [];
	const xAxes: unknown[] = [];
	const yAxes: unknown[] = [];
	const series: unknown[] = [];
	const titles: unknown[] = [];

	let gridIndex = 0;

	for (const section of sections) {
		const coords = defaultMedia.sectionCoordMap[section.id];
		if (!coords) continue;

		const position = calculateGridPosition(coords, totalCols, totalRows);
		const opt = section.option;

		// Check if this section has chart data (needs grid) or is title-only
		const hasChartData = opt.xAxis || opt.yAxis || opt.series;

		// Handle title-only sections (like headers)
		if (opt.title && !hasChartData) {
			const titleArr = Array.isArray(opt.title) ? opt.title : [opt.title];
			for (const t of titleArr) {
				const centerX =
					Number.parseFloat(position.left) +
					Number.parseFloat(position.width) / 2;
				const centerY =
					Number.parseFloat(position.top) +
					Number.parseFloat(position.height) / 2;
				titles.push({
					...t,
					left: `${centerX}%`,
					top: `${centerY}%`,
					textAlign: "center",
					textVerticalAlign: "middle",
				});
			}
			continue; // Skip grid creation for title-only sections
		}

		// Add grid for chart sections
		const sectionGridIndex = gridIndex;
		grids.push({
			...position,
			containLabel: true,
		});

		// Add xAxis if present
		if (opt.xAxis) {
			const xArr = Array.isArray(opt.xAxis) ? opt.xAxis : [opt.xAxis];
			for (const x of xArr) {
				xAxes.push({
					...x,
					gridIndex: sectionGridIndex,
				});
			}
		}

		// Add yAxis if present
		if (opt.yAxis) {
			const yArr = Array.isArray(opt.yAxis) ? opt.yAxis : [opt.yAxis];
			for (const y of yArr) {
				yAxes.push({
					...y,
					gridIndex: sectionGridIndex,
				});
			}
		}

		// Add series if present
		if (opt.series) {
			const seriesArr = Array.isArray(opt.series) ? opt.series : [opt.series];
			for (const s of seriesArr) {
				const seriesType = (s as { type?: string }).type;
				// For cartesian charts, use xAxisIndex/yAxisIndex
				if (
					seriesType === "line" ||
					seriesType === "bar" ||
					seriesType === "scatter"
				) {
					series.push({
						...s,
						xAxisIndex: sectionGridIndex,
						yAxisIndex: sectionGridIndex,
					});
				} else if (seriesType === "pie") {
					// Pie charts use center positioning
					const centerX =
						Number.parseFloat(position.left) +
						Number.parseFloat(position.width) / 2;
					const centerY =
						Number.parseFloat(position.top) +
						Number.parseFloat(position.height) / 2;
					const radius =
						Math.min(
							Number.parseFloat(position.width),
							Number.parseFloat(position.height),
						) * 0.35;
					series.push({
						...s,
						center: [`${centerX}%`, `${centerY}%`],
						radius: `${radius}%`,
					});
				} else {
					series.push(s);
				}
			}
		}

		// Add title if present (for chart sections that also have a title)
		if (opt.title) {
			const titleArr = Array.isArray(opt.title) ? opt.title : [opt.title];
			for (const t of titleArr) {
				const centerX =
					Number.parseFloat(position.left) +
					Number.parseFloat(position.width) / 2;
				titles.push({
					...t,
					left: `${centerX}%`,
					top: position.top,
					textAlign: "center",
				});
			}
		}

		gridIndex++;
	}

	return {
		tooltip: { trigger: "axis" },
		grid: grids.length > 0 ? grids : undefined,
		xAxis: xAxes.length > 0 ? xAxes : undefined,
		yAxis: yAxes.length > 0 ? yAxes : undefined,
		series: series.length > 0 ? series : undefined,
		title: titles.length > 0 ? titles : undefined,
	} as EChartsOption;
}
