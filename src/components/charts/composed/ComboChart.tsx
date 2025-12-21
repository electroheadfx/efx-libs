"use client";

import type { EChartsOption } from "echarts";
import type { TimeSeriesDataPoint } from "@/types/chart.types";
import { ChartContainer } from "../core/ChartContainer";

interface ComboChartProps {
	/** Primary data series (displayed as line) */
	lineData: TimeSeriesDataPoint[];
	/** Secondary data series (displayed as bar) */
	barData: TimeSeriesDataPoint[];
	/** Optional third series (displayed as scatter) */
	scatterData?: TimeSeriesDataPoint[];
	/** Field names */
	xField?: string;
	lineField?: string;
	barField?: string;
	scatterField?: string;
	/** Labels */
	lineName?: string;
	barName?: string;
	scatterName?: string;
	/** Chart title */
	title?: string;
	/** Styling */
	className?: string;
	loading?: boolean;
}

/**
 * ComboChart - Combines Line + Bar + optional Scatter in a single ECharts instance.
 * All series share the same X-axis (category) but can show different metrics.
 */
export function ComboChart({
	lineData,
	barData,
	scatterData,
	xField = "date",
	lineField = "value",
	barField = "value",
	scatterField = "value",
	lineName = "Trend",
	barName = "Volume",
	scatterName = "Events",
	title,
	className,
	loading,
}: ComboChartProps) {
	// Extract x-axis categories from line data
	const xCategories = lineData.map((d) => {
		const dateValue = d[xField];
		return typeof dateValue === "string"
			? dateValue
			: dateValue instanceof Date
				? dateValue.toISOString()
				: String(dateValue);
	});

	// Extract y values
	const lineValues = lineData.map((d) => d[lineField] as number);
	const barValues = barData.map((d) => d[barField] as number);
	const scatterValues = scatterData?.map((d, i) => [
		i,
		d[scatterField] as number,
	]);

	const series: EChartsOption["series"] = [
		{
			name: barName,
			type: "bar",
			data: barValues,
			itemStyle: {
				opacity: 0.7,
			},
			emphasis: {
				itemStyle: {
					opacity: 1,
				},
			},
		},
		{
			name: lineName,
			type: "line",
			data: lineValues,
			smooth: true,
			symbol: "circle",
			symbolSize: 6,
			lineStyle: {
				width: 3,
			},
		},
	];

	// Add scatter if provided
	if (scatterValues && scatterValues.length > 0) {
		series.push({
			name: scatterName,
			type: "scatter",
			data: scatterValues,
			symbolSize: 10,
			itemStyle: {
				opacity: 0.8,
			},
		});
	}

	const option: EChartsOption = {
		title: title
			? {
					text: title,
					left: "center",
					textStyle: { fontSize: 14 },
				}
			: undefined,
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				crossStyle: {
					color: "#999",
				},
			},
		},
		legend: {
			data: scatterData
				? [barName, lineName, scatterName]
				: [barName, lineName],
			bottom: 0,
		},
		grid: {
			left: "3%",
			right: "4%",
			top: title ? "15%" : "10%",
			bottom: "15%",
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: xCategories,
			axisPointer: {
				type: "shadow",
			},
		},
		yAxis: {
			type: "value",
			splitLine: {
				lineStyle: {
					type: "dashed",
				},
			},
		},
		series,
	};

	return (
		<ChartContainer option={option} className={className} loading={loading} />
	);
}
