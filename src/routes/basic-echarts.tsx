import { createFileRoute } from "@tanstack/react-router";
import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import { useId, useMemo, useState } from "react";
import { Button, ButtonGroup, Col, Grid, Panel, Row } from "rsuite";
import { useAppTheme } from "@/providers/ThemeProvider";
import type { AppTheme } from "@/types/theme.types";

export const Route = createFileRoute("/basic-echarts")({
	component: RouteComponent,
});

// ============================================================================
// SELF-CONTAINED CHART CONTAINER (no external imports)
// ============================================================================
function DemoChartContainer({
	option,
	title,
}: {
	option: EChartsOption;
	title: string;
}) {
	const { echartsTheme } = useAppTheme();
	const chartId = useId();

	return (
		<Panel
			bordered
			shaded
			header={<div className="font-semibold text-rs-heading">{title}</div>}
			className="bg-rs-bg-card"
		>
			<div className="h-80">
				<ReactECharts
					option={option}
					theme={echartsTheme}
					style={{ height: "100%", width: "100%" }}
					key={chartId}
				/>
			</div>
		</Panel>
	);
}

// ============================================================================
// DATA GENERATION UTILITIES (self-contained)
// ============================================================================
function seededRandom(seed: number) {
	let state = seed;
	return () => {
		state += 0x6d2b79f5;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function generateTimeSeriesData(count: number, seed = 12345) {
	const rng = seededRandom(seed);
	const data: { date: string; value: number }[] = [];
	const startDate = new Date("2024-01-01");

	for (let i = 0; i < count; i++) {
		const date = new Date(startDate);
		date.setMonth(startDate.getMonth() + i);
		const value = Math.round(
			100000 +
				i * 5000 +
				Math.sin((i * Math.PI) / 6) * 15000 +
				(rng() - 0.5) * 20000,
		);
		data.push({
			date: date.toISOString().slice(0, 7),
			value: Math.max(0, value),
		});
	}
	return data;
}

function generateCategoryData(categories: string[], seed = 12345) {
	const rng = seededRandom(seed);
	return categories.map((category) => ({
		category,
		value: Math.round(50000 + rng() * 400000),
	}));
}

function generateScatterData(count: number, seed = 12345) {
	const rng = seededRandom(seed);
	const data: { x: number; y: number }[] = [];
	for (let i = 0; i < count; i++) {
		const x = rng() * 100;
		const y = x * 0.7 + (rng() - 0.5) * 30;
		data.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
	}
	return data;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function RouteComponent() {
	const { theme, setTheme } = useAppTheme();
	const [seed, setSeed] = useState(12345);
	const themes: AppTheme[] = ["light", "dark", "high-contrast"];

	// Generate data with current seed
	const salesData = useMemo(() => generateTimeSeriesData(12, seed), [seed]);
	const categoryData = useMemo(
		() =>
			generateCategoryData(
				["Electronics", "Clothing", "Home", "Sports", "Books", "Toys"],
				seed + 1,
			),
		[seed],
	);
	const scatterData = useMemo(() => generateScatterData(50, seed + 2), [seed]);

	// ============================================================================
	// 1. LINE CHART - Time Series Trend
	// ============================================================================
	const lineChartOption: EChartsOption = {
		title: { text: "Revenue Trend", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		grid: { top: 60, right: 40, bottom: 40, left: 60 },
		xAxis: {
			type: "category",
			data: salesData.map((d) => d.date),
		},
		yAxis: { type: "value" },
		series: [
			{
				name: "Revenue",
				type: "line",
				data: salesData.map((d) => d.value),
				smooth: true,
				lineStyle: { width: 3 },
			},
		],
	};

	// ============================================================================
	// 2. AREA CHART - Volume Over Time
	// ============================================================================
	const areaChartOption: EChartsOption = {
		title: { text: "Sales Volume", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		grid: { top: 60, right: 40, bottom: 40, left: 60 },
		xAxis: {
			type: "category",
			data: salesData.map((d) => d.date),
			boundaryGap: false,
		},
		yAxis: { type: "value" },
		series: [
			{
				name: "Volume",
				type: "line",
				data: salesData.map((d) => d.value),
				smooth: true,
				areaStyle: { opacity: 0.6 },
			},
		],
	};

	// ============================================================================
	// 3. BAR CHART - Categorical Comparison
	// ============================================================================
	const barChartOption: EChartsOption = {
		title: { text: "Sales by Category", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		grid: { top: 60, right: 40, bottom: 40, left: 80 },
		xAxis: {
			type: "category",
			data: categoryData.map((d) => d.category),
		},
		yAxis: { type: "value" },
		series: [
			{
				name: "Sales",
				type: "bar",
				data: categoryData.map((d) => d.value),
				itemStyle: { borderRadius: [4, 4, 0, 0] },
			},
		],
	};

	// ============================================================================
	// 4. PIE CHART - Market Share
	// ============================================================================
	const pieChartOption: EChartsOption = {
		title: { text: "Market Share", left: "center", top: 10 },
		tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
		legend: { bottom: 10, left: "center" },
		series: [
			{
				name: "Market Share",
				type: "pie",
				radius: "60%",
				center: ["50%", "50%"],
				data: categoryData.map((d) => ({ name: d.category, value: d.value })),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: "rgba(0, 0, 0, 0.5)",
					},
				},
			},
		],
	};

	// ============================================================================
	// 5. DONUT CHART - Pie with Inner Radius
	// ============================================================================
	const donutChartOption: EChartsOption = {
		title: { text: "Category Distribution", left: "center", top: 10 },
		tooltip: { trigger: "item" },
		legend: { bottom: 10, left: "center" },
		series: [
			{
				name: "Categories",
				type: "pie",
				radius: ["40%", "65%"],
				center: ["50%", "50%"],
				data: categoryData
					.slice(0, 4)
					.map((d) => ({ name: d.category, value: d.value })),
				label: { show: true, position: "outside" },
			},
		],
	};

	// ============================================================================
	// 6. SCATTER CHART - Correlation Analysis
	// ============================================================================
	const scatterChartOption: EChartsOption = {
		title: { text: "Price vs Sales Correlation", left: "center", top: 10 },
		tooltip: { trigger: "item" },
		grid: { top: 60, right: 40, bottom: 40, left: 60 },
		xAxis: {
			type: "value",
			name: "Price",
			nameLocation: "middle",
			nameGap: 30,
		},
		yAxis: {
			type: "value",
			name: "Sales",
			nameLocation: "middle",
			nameGap: 40,
		},
		series: [
			{
				name: "Products",
				type: "scatter",
				data: scatterData.map((d) => [d.x, d.y]),
				symbolSize: 8,
			},
		],
	};

	// ============================================================================
	// 7. HORIZONTAL BAR CHART
	// ============================================================================
	const horizontalBarOption: EChartsOption = {
		title: { text: "Regional Performance", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		grid: { top: 60, right: 60, bottom: 40, left: 100 },
		xAxis: { type: "value" },
		yAxis: {
			type: "category",
			data: categoryData.map((d) => d.category),
		},
		series: [
			{
				name: "Performance",
				type: "bar",
				data: categoryData.map((d) => d.value),
				itemStyle: { borderRadius: [0, 4, 4, 0] },
			},
		],
	};

	// ============================================================================
	// 8. STACKED AREA CHART - Multi-Series
	// ============================================================================
	const stackedAreaOption: EChartsOption = {
		title: { text: "Stacked Revenue Streams", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		legend: { top: 40, left: "center" },
		grid: { top: 80, right: 40, bottom: 40, left: 60 },
		xAxis: {
			type: "category",
			data: salesData.map((d) => d.date),
			boundaryGap: false,
		},
		yAxis: { type: "value" },
		series: [
			{
				name: "Product A",
				type: "line",
				stack: "Total",
				areaStyle: {},
				data: salesData.map((d) => Math.round(d.value * 0.4)),
			},
			{
				name: "Product B",
				type: "line",
				stack: "Total",
				areaStyle: {},
				data: salesData.map((d) => Math.round(d.value * 0.35)),
			},
			{
				name: "Product C",
				type: "line",
				stack: "Total",
				areaStyle: {},
				data: salesData.map((d) => Math.round(d.value * 0.25)),
			},
		],
	};

	// ============================================================================
	// 9. MULTI-GRID CHART - 4 Charts in 2x2 Layout
	// ============================================================================
	const multiGridOption: EChartsOption = {
		tooltip: { trigger: "axis" },
		grid: [
			{ left: "7%", right: "53%", top: "12%", height: "35%" },
			{ left: "57%", right: "7%", top: "12%", height: "35%" },
			{ left: "7%", right: "53%", top: "57%", height: "35%" },
			{ left: "57%", right: "7%", top: "57%", height: "35%" },
		],
		xAxis: [
			{
				gridIndex: 0,
				type: "category",
				data: salesData.slice(0, 6).map((d) => d.date),
			},
			{
				gridIndex: 1,
				type: "category",
				data: categoryData.slice(0, 4).map((d) => d.category),
			},
			{ gridIndex: 2, type: "value" },
			{
				gridIndex: 3,
				type: "category",
				data: categoryData.slice(0, 4).map((d) => d.category),
			},
		],
		yAxis: [
			{ gridIndex: 0, type: "value" },
			{ gridIndex: 1, type: "value" },
			{ gridIndex: 2, type: "value" },
			{ gridIndex: 3, type: "value" },
		],
		series: [
			{
				name: "Line",
				type: "line",
				xAxisIndex: 0,
				yAxisIndex: 0,
				data: salesData.slice(0, 6).map((d) => d.value),
			},
			{
				name: "Bar",
				type: "bar",
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: categoryData.slice(0, 4).map((d) => d.value),
			},
			{
				name: "Scatter",
				type: "scatter",
				xAxisIndex: 2,
				yAxisIndex: 2,
				data: scatterData.slice(0, 30).map((d) => [d.x, d.y]),
			},
			{
				name: "Area",
				type: "line",
				xAxisIndex: 3,
				yAxisIndex: 3,
				data: categoryData.slice(0, 4).map((d) => d.value),
				areaStyle: {},
			},
		],
	};

	// ============================================================================
	// 10. DUAL-AXIS CHART - Different Scales
	// ============================================================================
	const dualAxisOption: EChartsOption = {
		title: { text: "Revenue & Growth Rate", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		legend: { top: 40, left: "center" },
		grid: { top: 80, right: 80, bottom: 40, left: 60 },
		xAxis: {
			type: "category",
			data: salesData.map((d) => d.date),
		},
		yAxis: [
			{
				type: "value",
				name: "Revenue",
				position: "left",
			},
			{
				type: "value",
				name: "Growth %",
				position: "right",
				min: -10,
				max: 30,
			},
		],
		series: [
			{
				name: "Revenue",
				type: "bar",
				data: salesData.map((d) => d.value),
			},
			{
				name: "Growth Rate",
				type: "line",
				yAxisIndex: 1,
				data: salesData.map(
					() => Math.round((Math.random() - 0.3) * 30 * 10) / 10,
				),
			},
		],
	};

	// ============================================================================
	// 11. COMBO CHART - Line + Bar + Scatter
	// ============================================================================
	const comboChartOption: EChartsOption = {
		title: { text: "Multi-Type Combo Chart", left: "center", top: 10 },
		tooltip: { trigger: "axis" },
		legend: { top: 40, left: "center" },
		grid: { top: 80, right: 60, bottom: 40, left: 60 },
		xAxis: {
			type: "category",
			data: salesData.slice(0, 8).map((d) => d.date),
		},
		yAxis: { type: "value" },
		series: [
			{
				name: "Revenue",
				type: "line",
				data: salesData.slice(0, 8).map((d) => d.value),
				smooth: true,
			},
			{
				name: "Orders",
				type: "bar",
				data: salesData.slice(0, 8).map((d) => Math.round(d.value * 0.7)),
			},
			{
				name: "Events",
				type: "scatter",
				data: [
					null,
					null,
					salesData[2].value * 1.2,
					null,
					salesData[4].value * 0.9,
					null,
					null,
					salesData[7].value * 1.1,
				],
				symbolSize: 15,
			},
		],
	};

	// ============================================================================
	// 12. RADAR CHART - Multi-Dimensional Comparison
	// ============================================================================
	const radarChartOption: EChartsOption = {
		title: { text: "Product Performance Radar", left: "center", top: 10 },
		tooltip: {},
		legend: { bottom: 10, left: "center" },
		radar: {
			indicator: [
				{ name: "Quality", max: 100 },
				{ name: "Price", max: 100 },
				{ name: "Features", max: 100 },
				{ name: "Support", max: 100 },
				{ name: "Marketing", max: 100 },
			],
			center: ["50%", "55%"],
			radius: "60%",
		},
		series: [
			{
				name: "Product Comparison",
				type: "radar",
				data: [
					{ value: [85, 70, 90, 75, 80], name: "Product A" },
					{ value: [70, 85, 75, 80, 90], name: "Product B" },
				],
			},
		],
	};

	return (
		<div className="min-h-screen bg-rs-body p-6">
			{/* Header with Theme Controls */}
			<div className="mb-6">
				<Panel bordered shaded className="bg-rs-bg-card">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-rs-heading mb-2">
								ECharts Complete Demo
							</h1>
							<p className="text-rs-secondary">
								Comprehensive showcase of all chart types and features
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Button
								onClick={() => setSeed(Math.floor(Math.random() * 100000))}
								appearance="primary"
							>
								🎲 Randomize Data
							</Button>
							<div className="flex items-center gap-2">
								<span className="text-sm text-rs-secondary">Theme:</span>
								<ButtonGroup>
									{themes.map((t) => (
										<Button
											key={t}
											appearance={theme === t ? "primary" : "default"}
											size="sm"
											onClick={() => setTheme(t)}
										>
											{t === "high-contrast"
												? "High Contrast"
												: t.charAt(0).toUpperCase() + t.slice(1)}
										</Button>
									))}
								</ButtonGroup>
							</div>
						</div>
					</div>
				</Panel>
			</div>

			{/* Chart Grid */}
			<Grid fluid>
				{/* Basic Charts */}
				<Row gutter={16} className="mb-4">
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={lineChartOption}
							title="1. Line Chart"
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={areaChartOption}
							title="2. Area Chart"
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer option={barChartOption} title="3. Bar Chart" />
					</Col>
				</Row>

				{/* Pie Charts */}
				<Row gutter={16} className="mb-4">
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer option={pieChartOption} title="4. Pie Chart" />
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={donutChartOption}
							title="5. Donut Chart"
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={scatterChartOption}
							title="6. Scatter Chart"
						/>
					</Col>
				</Row>

				{/* Advanced Charts */}
				<Row gutter={16} className="mb-4">
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={horizontalBarOption}
							title="7. Horizontal Bar"
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={stackedAreaOption}
							title="8. Stacked Area"
						/>
					</Col>
					<Col xs={24} sm={12} md={8}>
						<DemoChartContainer
							option={radarChartOption}
							title="12. Radar Chart"
						/>
					</Col>
				</Row>

				{/* Complex Compositions */}
				<Row gutter={16} className="mb-4">
					<Col xs={24} md={12}>
						<DemoChartContainer
							option={dualAxisOption}
							title="10. Dual-Axis Chart"
						/>
					</Col>
					<Col xs={24} md={12}>
						<DemoChartContainer
							option={comboChartOption}
							title="11. Combo Chart (Line+Bar+Scatter)"
						/>
					</Col>
				</Row>

				{/* Multi-Grid Layout */}
				<Row gutter={16} className="mb-4">
					<Col xs={24}>
						<Panel
							bordered
							shaded
							header={
								<div className="font-semibold text-rs-heading">
									9. Multi-Grid Chart (4-in-1 Layout)
								</div>
							}
							className="bg-rs-bg-card"
						>
							<div className="h-150">
								<ReactECharts
									option={multiGridOption}
									theme={theme === "light" ? "default" : "dark"}
									style={{ height: "100%", width: "100%" }}
								/>
							</div>
						</Panel>
					</Col>
				</Row>
			</Grid>

			{/* Footer Info */}
			<div className="mt-6">
				<Panel bordered className="bg-rs-bg-card">
					<div className="text-sm text-rs-secondary">
						<h3 className="font-semibold text-rs-heading mb-2">
							Features Demonstrated:
						</h3>
						<ul className="list-disc list-inside space-y-1">
							<li>12 different chart types with realistic seeded data</li>
							<li>
								Theme switching (Light/Dark/High-Contrast) with automatic chart
								updates
							</li>
							<li>Multi-grid layouts (4 charts in single ECharts instance)</li>
							<li>Dual-axis charts for different scales</li>
							<li>Combo charts combining multiple series types</li>
							<li>Responsive RSuite Grid layout system</li>
							<li>
								Self-contained implementation (all utilities in this file)
							</li>
						</ul>
					</div>
				</Panel>
			</div>
		</div>
	);
}
