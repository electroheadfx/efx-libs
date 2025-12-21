"use client";

import type { EChartsOption, SeriesOption } from "echarts";
import { ChartContainer } from "../core/ChartContainer";

interface TimeSeriesData {
	date: string;
	value: number;
	[key: string]: unknown;
}

interface CategoryData {
	category: string;
	value: number;
}

interface MultiGridChartProps {
	/** Time series data for line chart (top-left grid) */
	lineData: TimeSeriesData[];
	/** Time series data for area chart (top-right grid) */
	areaData: TimeSeriesData[];
	/** Category data for bar chart (bottom-left grid) */
	barData: CategoryData[];
	/** Category data for horizontal bar (bottom-right grid) */
	hBarData: CategoryData[];
	/** Chart title */
	title?: string;
	/** Styling */
	className?: string;
	loading?: boolean;
}

/**
 * MultiGridChart - 4 charts in a 2x2 grid layout within a single ECharts instance.
 * Demonstrates true multi-chart composition with multiple grids, axes, and series.
 */
export function MultiGridChart({
	lineData,
	areaData,
	barData,
	hBarData,
	title,
	className,
	loading,
}: MultiGridChartProps) {
	// Build the multi-grid option
	const option: EChartsOption = {
		title: title
			? {
					text: title,
					left: "center",
					top: 0,
					textStyle: { fontSize: 14 },
				}
			: undefined,
		tooltip: {
			trigger: "axis",
		},
		// 4 grids in 2x2 layout
		grid: [
			{ left: "7%", right: "53%", top: "12%", height: "35%" }, // Top-left
			{ left: "57%", right: "7%", top: "12%", height: "35%" }, // Top-right
			{ left: "7%", right: "53%", top: "60%", height: "35%" }, // Bottom-left
			{ left: "57%", right: "7%", top: "60%", height: "35%" }, // Bottom-right
		],
		// 4 x-axes (one per grid)
		xAxis: [
			{
				type: "category",
				gridIndex: 0,
				data: lineData.map((d) => d.date),
				axisLabel: { fontSize: 10 },
			},
			{
				type: "category",
				gridIndex: 1,
				data: areaData.map((d) => d.date),
				axisLabel: { fontSize: 10 },
			},
			{
				type: "category",
				gridIndex: 2,
				data: barData.map((d) => d.category),
				axisLabel: { fontSize: 10, rotate: 30 },
			},
			{
				type: "value",
				gridIndex: 3,
				axisLabel: { fontSize: 10 },
			},
		],
		// 4 y-axes (one per grid)
		yAxis: [
			{
				type: "value",
				gridIndex: 0,
				axisLabel: { fontSize: 10 },
				splitLine: { lineStyle: { type: "dashed" } },
			},
			{
				type: "value",
				gridIndex: 1,
				axisLabel: { fontSize: 10 },
				splitLine: { lineStyle: { type: "dashed" } },
			},
			{
				type: "value",
				gridIndex: 2,
				axisLabel: { fontSize: 10 },
				splitLine: { lineStyle: { type: "dashed" } },
			},
			{
				type: "category",
				gridIndex: 3,
				data: hBarData.map((d) => d.category),
				axisLabel: { fontSize: 10 },
			},
		],
		series: [
			// Top-left: Line chart
			{
				name: "Trend",
				type: "line",
				xAxisIndex: 0,
				yAxisIndex: 0,
				data: lineData.map((d) => d.value),
				smooth: true,
				symbol: "none",
				lineStyle: { width: 2 },
			},
			// Top-right: Area chart
			{
				name: "Volume",
				type: "line",
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: areaData.map((d) => d.value),
				smooth: true,
				areaStyle: { opacity: 0.5 },
				symbol: "none",
				lineStyle: { width: 2 },
			},
			// Bottom-left: Bar chart
			{
				name: "Categories",
				type: "bar",
				xAxisIndex: 2,
				yAxisIndex: 2,
				data: barData.map((d) => d.value),
			},
			// Bottom-right: Horizontal bar
			{
				name: "Rankings",
				type: "bar",
				xAxisIndex: 3,
				yAxisIndex: 3,
				data: hBarData.map((d) => d.value),
			},
		] as SeriesOption[],
	};

	return (
		<ChartContainer option={option} className={className} loading={loading} />
	);
}

interface SplitPanelChartProps {
	/** Left chart: Line + Bar overlay */
	leftLineData: TimeSeriesData[];
	leftBarData: TimeSeriesData[];
	/** Right chart: Scatter data */
	rightScatterData: Array<{ x: number; y: number }>;
	/** Labels */
	leftLineName?: string;
	leftBarName?: string;
	rightScatterName?: string;
	/** Chart title */
	title?: string;
	/** Styling */
	className?: string;
	loading?: boolean;
}

/**
 * SplitPanelChart - 2-panel layout with combo chart on left and scatter on right.
 * Single ECharts instance with 2 grids side by side.
 */
export function SplitPanelChart({
	leftLineData,
	leftBarData,
	rightScatterData,
	leftLineName = "Trend",
	leftBarName = "Volume",
	rightScatterName = "Correlation",
	title,
	className,
	loading,
}: SplitPanelChartProps) {
	const option: EChartsOption = {
		title: title
			? {
					text: title,
					left: "center",
					top: 0,
					textStyle: { fontSize: 14 },
				}
			: undefined,
		tooltip: {
			trigger: "axis",
		},
		legend: {
			data: [leftLineName, leftBarName, rightScatterName],
			bottom: 0,
		},
		// 2 grids side by side
		grid: [
			{ left: "5%", right: "55%", top: "12%", bottom: "15%" }, // Left
			{ left: "55%", right: "5%", top: "12%", bottom: "15%" }, // Right
		],
		xAxis: [
			{
				type: "category",
				gridIndex: 0,
				data: leftLineData.map((d) => d.date),
			},
			{
				type: "value",
				gridIndex: 1,
				name: "X",
			},
		],
		yAxis: [
			{
				type: "value",
				gridIndex: 0,
				splitLine: { lineStyle: { type: "dashed" } },
			},
			{
				type: "value",
				gridIndex: 1,
				name: "Y",
				splitLine: { lineStyle: { type: "dashed" } },
			},
		],
		series: [
			// Left grid: Bar
			{
				name: leftBarName,
				type: "bar",
				xAxisIndex: 0,
				yAxisIndex: 0,
				data: leftBarData.map((d) => d.value),
				itemStyle: { opacity: 0.6 },
			},
			// Left grid: Line overlay
			{
				name: leftLineName,
				type: "line",
				xAxisIndex: 0,
				yAxisIndex: 0,
				data: leftLineData.map((d) => d.value),
				smooth: true,
				lineStyle: { width: 3 },
			},
			// Right grid: Scatter
			{
				name: rightScatterName,
				type: "scatter",
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: rightScatterData.map((d) => [d.x, d.y]),
				symbolSize: 8,
			},
		] as SeriesOption[],
	};

	return (
		<ChartContainer option={option} className={className} loading={loading} />
	);
}
