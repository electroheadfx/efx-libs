"use client";

import type { EChartsOption } from "echarts";
import type { ViolinChartProps } from "@/types/chart.types";
import { ChartContainer } from "../core/ChartContainer";

export function ViolinChart({
	data,
	categories,
	title,
	className,
	style,
	loading,
	onChartReady,
}: ViolinChartProps) {
	// Transform data for violin chart custom series
	const violinData = data.map((values, idx) => ({
		name: categories[idx],
		value: values,
	}));

	const option: EChartsOption = {
		title: title ? { text: title, left: "center" } : undefined,
		tooltip: {
			trigger: "item",
		},
		xAxis: {
			type: "category",
			data: categories,
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				type: "custom",
				renderItem: "violin" as unknown as undefined, // Custom series render item
				coordinateSystem: "cartesian2d",
				data: violinData,
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
