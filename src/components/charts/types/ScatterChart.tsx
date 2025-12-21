"use client";

import type { EChartsOption } from "echarts";
import type { ScatterChartProps } from "@/types/chart.types";
import { ChartContainer } from "../core/ChartContainer";

export function ScatterChart({
	data,
	xField = "x",
	yField = "y",
	title,
	className,
	style,
	loading,
	onChartReady,
}: ScatterChartProps) {
	const scatterData = data.map((d) => [
		d[xField as keyof typeof d] as number,
		d[yField as keyof typeof d] as number,
	]);

	const option: EChartsOption = {
		title: title ? { text: title, left: "center" } : undefined,
		tooltip: {
			trigger: "item",
			formatter: (params: unknown) => {
				const p = params as { value: [number, number] };
				return `(${p.value[0]}, ${p.value[1]})`;
			},
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "3%",
			containLabel: true,
		},
		xAxis: {
			type: "value",
			scale: true,
		},
		yAxis: {
			type: "value",
			scale: true,
		},
		series: [
			{
				type: "scatter",
				data: scatterData,
				symbolSize: 10,
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
