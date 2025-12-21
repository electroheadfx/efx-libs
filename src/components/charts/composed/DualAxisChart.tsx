"use client";

import type { EChartsOption } from "echarts";
import type { TimeSeriesDataPoint } from "@/types/chart.types";
import { ChartContainer } from "../core/ChartContainer";

interface DualAxisChartProps {
	/** Primary data (left Y-axis, bar chart) */
	primaryData: TimeSeriesDataPoint[];
	/** Secondary data (right Y-axis, line chart) */
	secondaryData: TimeSeriesDataPoint[];
	/** Field configuration */
	xField?: string;
	primaryField?: string;
	secondaryField?: string;
	/** Labels */
	primaryName?: string;
	secondaryName?: string;
	primaryUnit?: string;
	secondaryUnit?: string;
	/** Chart title */
	title?: string;
	/** Styling */
	className?: string;
	loading?: boolean;
}

/**
 * DualAxisChart - Line + Bar with two independent Y-axes.
 * Perfect for showing metrics with different scales (e.g., Revenue + Growth Rate).
 */
export function DualAxisChart({
	primaryData,
	secondaryData,
	xField = "date",
	primaryField = "value",
	secondaryField = "value",
	primaryName = "Value",
	secondaryName = "Rate",
	primaryUnit = "",
	secondaryUnit = "%",
	title,
	className,
	loading,
}: DualAxisChartProps) {
	const xCategories = primaryData.map((d) => {
		const dateValue = d[xField];
		return typeof dateValue === "string"
			? dateValue
			: dateValue instanceof Date
				? dateValue.toISOString()
				: String(dateValue);
	});
	const primaryValues = primaryData.map((d) => d[primaryField] as number);
	const secondaryValues = secondaryData.map((d) => d[secondaryField] as number);

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
			},
		},
		legend: {
			data: [primaryName, secondaryName],
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
		yAxis: [
			{
				type: "value",
				name: primaryName,
				position: "left",
				axisLabel: {
					formatter: `{value}${primaryUnit}`,
				},
				splitLine: {
					lineStyle: {
						type: "dashed",
					},
				},
			},
			{
				type: "value",
				name: secondaryName,
				position: "right",
				axisLabel: {
					formatter: `{value}${secondaryUnit}`,
				},
				splitLine: {
					show: false,
				},
			},
		],
		series: [
			{
				name: primaryName,
				type: "bar",
				yAxisIndex: 0,
				data: primaryValues,
				itemStyle: {
					opacity: 0.8,
				},
			},
			{
				name: secondaryName,
				type: "line",
				yAxisIndex: 1,
				data: secondaryValues,
				smooth: true,
				symbol: "circle",
				symbolSize: 8,
				lineStyle: {
					width: 3,
				},
			},
		],
	};

	return (
		<ChartContainer option={option} className={className} loading={loading} />
	);
}
