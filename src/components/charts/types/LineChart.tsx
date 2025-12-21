"use client";

import type { EChartsOption } from "echarts";
import type { LineChartProps } from "@/types/chart.types";
import { ChartContainer } from "../core/ChartContainer";

export function LineChart({
	data,
	xField = "date",
	yField = "value",
	smooth = false,
	areaStyle = false,
	title,
	className,
	style,
	loading,
	onChartReady,
}: LineChartProps) {
	const xData = data.map(
		(d) => (d as Record<string, unknown>)[xField] as string,
	);
	const yData = data.map(
		(d) => (d as Record<string, unknown>)[yField] as number,
	);

	const option: EChartsOption = {
		title: title ? { text: title, left: "center" } : undefined,
		tooltip: {
			trigger: "axis",
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			containLabel: true,
		},
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: xData,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				type: "line",
				data: yData,
				smooth,
				areaStyle: areaStyle ? {} : undefined,
			},
		],
	};

	return (
		<ChartContainer
			option={option}
			className={className}
			style={style}
			loading={loading}
			onChartReady={onChartReady}
		/>
	);
}
