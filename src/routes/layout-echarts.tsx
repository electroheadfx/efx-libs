import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useState, useMemo, lazy, Suspense } from "react";
import { useAppTheme } from "@/providers/ThemeProvider";
import type { EChartsOption } from "echarts";
import type { AppTheme } from "@/types/theme.types";
import { Button, ButtonGroup, Panel, Badge } from "rsuite";
import {
	DashboardLayout,
	LayoutItem,
	DashboardGrid,
	ResponsiveDashboardLayout,
	type LayoutTemplate,
} from "@/components/layout";
import { useMatrixLayout } from "@/hooks/useMatrixLayout";
import type { MatrixSection } from "@/types/matrixLayout.types";

// Lazy load ECharts components (client-side only)
const ReactECharts = lazy(() => import("echarts-for-react"));
const MatrixChart = lazy(() =>
	import("@/components/charts/composed/MatrixChart").then((m) => ({
		default: m.MatrixChart,
	})),
);

export const Route = createFileRoute("/layout-echarts")({
	component: RouteComponent,
});

// ============================================================================
// DATA GENERATION UTILITIES
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
			50000 +
				i * 2000 +
				Math.sin((i * Math.PI) / 6) * 8000 +
				(rng() - 0.5) * 10000,
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
		value: Math.round(30000 + rng() * 200000),
	}));
}

// ============================================================================
// REUSABLE CHART COMPONENTS
// ============================================================================
function MiniChart({
	option,
	height = "100%",
}: {
	option: EChartsOption;
	height?: string;
}) {
	const { echartsTheme } = useAppTheme();
	return (
		<div style={{ height, width: "100%" }}>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full text-rs-secondary">
						Loading chart...
					</div>
				}
			>
				<ReactECharts
					option={option}
					theme={echartsTheme}
					style={{ height: "100%", width: "100%" }}
				/>
			</Suspense>
		</div>
	);
}

// Chart panel that properly handles height distribution
function ChartPanel({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="h-full w-full flex flex-col border border-rs-border rounded-md bg-rs-bg-card p-4">
			<h3 className="text-lg font-semibold text-rs-heading mb-2 shrink-0">
				{title}
			</h3>
			<div className="flex-1 min-h-0 relative">
				<div className="absolute inset-0">{children}</div>
			</div>
		</div>
	);
}

function KPICard({
	title,
	value,
	change,
}: {
	title: string;
	value: string;
	change: string;
}) {
	const isPositive = change.startsWith("+");
	return (
		<Panel bordered className="bg-rs-bg-card h-full">
			<div className="flex flex-col h-full justify-between">
				<div className="text-sm text-rs-secondary">{title}</div>
				<div className="text-3xl font-bold text-rs-heading">{value}</div>
				<div
					className={`text-sm ${
						isPositive ? "text-green-600" : "text-red-600"
					}`}
				>
					{change}
				</div>
			</div>
		</Panel>
	);
}

function CodeBlock({ code }: { code: string; language?: string }) {
	return (
		<pre className="bg-slate-900 p-4 rounded overflow-x-auto text-xs border border-slate-700">
			<code className="text-slate-100 font-mono">
				{code.split("\n").map((line, i) => {
					// Simple syntax highlighting
					let highlightedLine = line;
					// Keywords
					highlightedLine = highlightedLine.replace(
						/\b(const|let|var|function|return|import|export|from|type|interface|areas|columns|rows|gap)\b/g,
						'<span style="color: #c792ea">$1</span>',
					);
					// Strings
					highlightedLine = highlightedLine.replace(
						/(["'`])(.*?)\1/g,
						'<span style="color: #c3e88d">$1$2$1</span>',
					);
					// Numbers
					highlightedLine = highlightedLine.replace(
						/\b(\d+)\b/g,
						'<span style="color: #f78c6c">$1</span>',
					);
					// Comments
					highlightedLine = highlightedLine.replace(
						/(\/{2}.*$)/g,
						'<span style="color: #546e7a">$1</span>',
					);
					return (
						<div
							key={i}
							dangerouslySetInnerHTML={{ __html: highlightedLine || "&nbsp;" }}
						/>
					);
				})}
			</code>
		</pre>
	);
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
function RouteComponent() {
	const { theme, setTheme } = useAppTheme();
	const [seed, setSeed] = useState(12345);
	const [proportions, setProportions] = useState({ main: 2, side: 1 });
	const [activeLayout, setActiveLayout] = useState(1);
	const [showCode, setShowCode] = useState(false);
	const themes: AppTheme[] = ["light", "dark", "high-contrast"];

	// Generate data
	const salesData = useMemo(() => generateTimeSeriesData(12, seed), [seed]);
	const categoryData = useMemo(
		() =>
			generateCategoryData(
				["Electronics", "Clothing", "Home", "Sports"],
				seed + 1,
			),
		[seed],
	);

	// Randomize proportions
	const randomizeProportions = () => {
		const configs = [
			{ main: 2, side: 1 },
			{ main: 3, side: 1 },
			{ main: 1.5, side: 1 },
			{ main: 2.5, side: 1 },
			{ main: 1, side: 1 },
		];
		setProportions(configs[Math.floor(Math.random() * configs.length)]);
	};

	// Sample chart options
	const lineOption: EChartsOption = {
		tooltip: { trigger: "axis" },
		xAxis: { type: "category", data: salesData.slice(0, 6).map((d) => d.date) },
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: salesData.slice(0, 6).map((d) => d.value),
				smooth: true,
			},
		],
		grid: { top: 20, right: 20, bottom: 30, left: 50 },
	};

	const barOption: EChartsOption = {
		tooltip: { trigger: "axis" },
		xAxis: { type: "category", data: categoryData.map((d) => d.category) },
		yAxis: { type: "value" },
		series: [{ type: "bar", data: categoryData.map((d) => d.value) }],
		grid: { top: 20, right: 20, bottom: 60, left: 50 },
	};

	const pieOption: EChartsOption = {
		tooltip: { trigger: "item" },
		series: [
			{
				type: "pie",
				radius: "60%",
				data: categoryData.map((d) => ({ name: d.category, value: d.value })),
			},
		],
	};

	const areaOption: EChartsOption = {
		tooltip: { trigger: "axis" },
		xAxis: {
			type: "category",
			data: salesData.slice(0, 6).map((d) => d.date),
			boundaryGap: false,
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: salesData.slice(0, 6).map((d) => d.value),
				areaStyle: {},
			},
		],
		grid: { top: 20, right: 20, bottom: 30, left: 50 },
	};

	// ============================================================================
	// MATRIX CHART SETUP - ECharts Multi-Chart Grid System
	// ============================================================================
	const matrixSections: MatrixSection[] = [
		{
			id: "header",
			option: {
				title: { text: "Revenue Overview", left: "center" },
			},
		},
		{
			id: "main",
			option: {
				xAxis: {
					type: "category",
					data: salesData.slice(0, 8).map((d) => d.date),
				},
				yAxis: { type: "value" },
				series: [
					{
						type: "line",
						data: salesData.slice(0, 8).map((d) => d.value),
						smooth: true,
					},
				],
			},
		},
		{
			id: "sidebar",
			option: {
				series: [
					{
						type: "pie",
						radius: "50%",
						data: categoryData
							.slice(0, 3)
							.map((d) => ({ name: d.category, value: d.value })),
					},
				],
			},
		},
	];

	const matrixLayout = useMatrixLayout({
		sections: ["header", "main", "sidebar"],
		breakpoints: {
			desktop: {
				template: `
          | header  | header  | header  |
          | main    | main    | sidebar |
          | main    | main    | sidebar |
        `,
			},
		},
	});

	// ============================================================================
	// LAYOUT 1: ANALYTICS LAYOUT (KPI + Main + Sidebar)
	// ============================================================================
	const analyticsLayout: LayoutTemplate = {
		areas: `
      "kpi1 kpi2 kpi3 kpi4"
      "main main main side"
      "main main main side"
    `,
		columns: ["1fr", "1fr", "1fr", "1fr"],
		rows: ["100px", "1fr", "1fr"],
		gap: 16,
	};

	// ============================================================================
	// LAYOUT 2: REPORT LAYOUT (Header + Main + Sidebar + Footer)
	// ============================================================================
	const reportLayout: LayoutTemplate = {
		areas: `
      "header header"
      "main sidebar"
      "footer footer"
    `,
		columns: ["1fr", "300px"],
		rows: ["80px", "1fr", "80px"],
		gap: 16,
	};

	// ============================================================================
	// LAYOUT 3: COMPARISON LAYOUT (Side by Side)
	// ============================================================================
	const comparisonLayout: LayoutTemplate = {
		areas: `
      "title title"
      "left right"
      "summary summary"
    `,
		columns: ["1fr", "1fr"],
		rows: ["60px", "1fr", "100px"],
		gap: 16,
	};

	// ============================================================================
	// LAYOUT 4: DYNAMIC PROPORTIONS LAYOUT
	// ============================================================================
	const dynamicLayout: LayoutTemplate = useMemo(
		() => ({
			areas: `
      "header header"
      "main side"
    `,
			columns: [`${proportions.main}fr`, `${proportions.side}fr`],
			rows: ["80px", "1fr"],
			gap: 16,
		}),
		[proportions],
	);

	return (
		<div className="h-[calc(100vh-72px)] bg-rs-body grid grid-rows-[auto_1fr] overflow-hidden">
			{/* Fixed Header with Navigation */}
			<div className="bg-rs-bg-card border-b border-rs-border">
				<div className="p-4">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-2xl font-bold text-rs-heading">
								Layout System Demo
							</h1>
							<p className="text-sm text-rs-secondary">
								Navigate between different layout configurations
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Button
								onClick={() => setSeed(Math.floor(Math.random() * 100000))}
								appearance="primary"
								size="sm"
							>
								🎲 Data
							</Button>
							<Button
								onClick={randomizeProportions}
								appearance="default"
								size="sm"
							>
								📐 Props
							</Button>
							<Button
								onClick={() => setShowCode(!showCode)}
								appearance={showCode ? "primary" : "default"}
								size="sm"
							>
								{showCode ? "📊 View" : "💻 Code"}
							</Button>
							<ButtonGroup size="sm">
								{themes.map((t) => (
									<Button
										key={t}
										appearance={theme === t ? "primary" : "default"}
										onClick={() => setTheme(t)}
									>
										{t === "high-contrast" ? "HC" : t.charAt(0).toUpperCase()}
									</Button>
								))}
							</ButtonGroup>
						</div>
					</div>

					{/* Layout Navigation */}
					<div className="flex gap-2 overflow-x-auto pb-2">
						{[
							{ id: 1, name: "Analytics", desc: "KPI + Main + Side" },
							{ id: 2, name: "Report", desc: "Header + Footer" },
							{ id: 3, name: "Comparison", desc: "Side by Side" },
							{ id: 4, name: "MatrixChart", desc: "ECharts Grid" },
							{ id: 5, name: "Dynamic", desc: "Custom Ratios" },
							{ id: 6, name: "Grid", desc: "Auto Layout" },
							{ id: 7, name: "Responsive", desc: "Breakpoints" },
						].map((layout) => (
							<Button
								key={layout.id}
								appearance={activeLayout === layout.id ? "primary" : "default"}
								onClick={() => setActiveLayout(layout.id)}
								className="shrink-0"
							>
								<div className="text-left">
									<div className="font-semibold">
										{layout.id}. {layout.name}
									</div>
									<div className="text-xs opacity-75">{layout.desc}</div>
								</div>
							</Button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content Area - Full Height */}
			<div className="overflow-auto">
				{activeLayout === 1 && (
					<LayoutSection
						title="1. Analytics Layout"
						badge="DashboardLayout"
						description="4 KPI cards at top + main chart area + sidebar. Perfect for dashboards with key metrics."
						showCode={showCode}
						code={`const layout: LayoutTemplate = {
  areas: \`
    "kpi1 kpi2 kpi3 kpi4"
    "main main main side"
    "main main main side"
  \`,
  columns: ['1fr', '1fr', '1fr', '1fr'],
  rows: ['100px', '1fr', '1fr'],
  gap: 16,
}

<DashboardLayout template={layout}>
  <LayoutItem area="kpi1"><KPICard ... /></LayoutItem>
  <LayoutItem area="main"><Chart ... /></LayoutItem>
  <LayoutItem area="side"><Stats ... /></LayoutItem>
</DashboardLayout>`}
					>
						<div className="h-full w-full">
							<DashboardLayout template={analyticsLayout}>
								<LayoutItem area="kpi1">
									<KPICard title="Revenue" value="$1.2M" change="+15.3%" />
								</LayoutItem>
								<LayoutItem area="kpi2">
									<KPICard title="Orders" value="3,420" change="+8.7%" />
								</LayoutItem>
								<LayoutItem area="kpi3">
									<KPICard title="Customers" value="1,847" change="+12.4%" />
								</LayoutItem>
								<LayoutItem area="kpi4">
									<KPICard title="Conversion" value="3.2%" change="-0.5%" />
								</LayoutItem>
								<LayoutItem area="main">
									<ChartPanel title="Revenue Trend">
										<MiniChart option={lineOption} />
									</ChartPanel>
								</LayoutItem>
								<LayoutItem area="side">
									<ChartPanel title="Category Breakdown">
										<MiniChart option={pieOption} />
									</ChartPanel>
								</LayoutItem>
							</DashboardLayout>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 2 && (
					<LayoutSection
						title="2. Report Layout"
						badge="DashboardLayout"
						description="Classic report structure with header, main content, sidebar, and footer."
						showCode={showCode}
						code={`const layout: LayoutTemplate = {
  areas: \`
    "header header"
    "main sidebar"
    "footer footer"
  \`,
  columns: ['1fr', '300px'],
  rows: ['80px', '1fr', '80px'],
  gap: 16,
}`}
					>
						<div className="h-full w-full">
							<DashboardLayout template={reportLayout}>
								<LayoutItem area="header">
									<Panel
										bordered
										className="bg-rs-bg-card h-full flex items-center px-6"
									>
										<div>
											<h3 className="text-xl font-bold text-rs-heading">
												Monthly Sales Report
											</h3>
											<p className="text-sm text-rs-secondary">
												Generated on {new Date().toLocaleDateString()}
											</p>
										</div>
									</Panel>
								</LayoutItem>
								<LayoutItem area="main">
									<ChartPanel title="Sales Performance">
										<MiniChart option={barOption} />
									</ChartPanel>
								</LayoutItem>
								<LayoutItem area="sidebar">
									<Panel bordered className="bg-rs-bg-card h-full p-4">
										<h3 className="text-md font-semibold text-rs-heading mb-4">
											Stats
										</h3>
										<div className="space-y-3 text-sm">
											<div className="p-3 bg-rs-bg-subtle rounded">
												<div className="text-rs-secondary">Total Sales</div>
												<div className="text-xl font-bold text-rs-heading">
													$847K
												</div>
											</div>
											<div className="p-3 bg-rs-bg-subtle rounded">
												<div className="text-rs-secondary">Avg Order</div>
												<div className="text-xl font-bold text-rs-heading">
													$247
												</div>
											</div>
										</div>
									</Panel>
								</LayoutItem>
								<LayoutItem area="footer">
									<Panel
										bordered
										className="bg-rs-bg-card h-full flex items-center justify-between px-6"
									>
										<span className="text-sm text-rs-secondary">
											© 2024 Demo
										</span>
										<span className="text-sm text-rs-secondary">
											Page 1 of 1
										</span>
									</Panel>
								</LayoutItem>
							</DashboardLayout>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 3 && (
					<LayoutSection
						title="3. Comparison Layout"
						badge="DashboardLayout"
						description="Side-by-side comparison with title and summary. Ideal for A/B testing."
						showCode={showCode}
						code={`const layout: LayoutTemplate = {
  areas: \`
    "title title"
    "left right"
    "summary summary"
  \`,
  columns: ['1fr', '1fr'],
  rows: ['60px', '1fr', '100px'],
}`}
					>
						<div className="h-full w-full">
							<DashboardLayout template={comparisonLayout}>
								<LayoutItem area="title">
									<Panel
										bordered
										className="bg-rs-bg-card h-full flex items-center justify-center"
									>
										<h3 className="text-xl font-bold text-rs-heading">
											Q1 vs Q2 Performance
										</h3>
									</Panel>
								</LayoutItem>
								<LayoutItem area="left">
									<ChartPanel title="Q1 2024">
										<MiniChart option={lineOption} />
									</ChartPanel>
								</LayoutItem>
								<LayoutItem area="right">
									<ChartPanel title="Q2 2024">
										<MiniChart option={areaOption} />
									</ChartPanel>
								</LayoutItem>
								<LayoutItem area="summary">
									<Panel bordered className="bg-rs-bg-card h-full p-4">
										<div className="flex justify-around items-center h-full">
											<div className="text-center">
												<div className="text-2xl font-bold text-green-600">
													+23%
												</div>
												<div className="text-sm text-rs-secondary">Growth</div>
											</div>
											<div className="text-center">
												<div className="text-2xl font-bold text-rs-heading">
													$1.5M
												</div>
												<div className="text-sm text-rs-secondary">Revenue</div>
											</div>
										</div>
									</Panel>
								</LayoutItem>
							</DashboardLayout>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 4 && (
					<LayoutSection
						title="4. MatrixChart Layout (ECharts Multi-Chart Grid)"
						badge="MatrixChart"
						description="Multiple charts in a SINGLE ECharts instance using matrix coordinates. Better performance than separate instances."
						showCode={showCode}
						code={`const sections: MatrixSection[] = [
  { id: 'header', option: { title: { text: 'Title' } } },
  { id: 'main', option: { /* line chart */ } },
  { id: 'sidebar', option: { /* pie chart */ } },
]

const layout = useMatrixLayout({
  breakpoints: {
    desktop: {
      template: \`
        | header  | header  | header  |
        | main    | main    | sidebar |
        | main    | main    | sidebar |
      \`,
    },
  },
})

<MatrixChart sections={sections} mediaDefinitions={layout} />`}
						info="🔍 Inspect in DevTools: This is a single <canvas> element, not separate chart containers!"
					>
						<div className="h-full w-full">
							<Suspense
								fallback={
									<div className="flex items-center justify-center h-full text-rs-secondary">
										Loading chart...
									</div>
								}
							>
								<MatrixChart
									sections={matrixSections}
									mediaDefinitions={matrixLayout}
								/>
							</Suspense>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 5 && (
					<LayoutSection
						title="5. Dynamic Proportions Layout"
						badge="DashboardLayout"
						description={`Customizable column widths using fractional units. Current ratio: ${proportions.main}:${proportions.side}`}
						showCode={showCode}
						code={`// Columns with custom ratios
columns: [\`\${proportions.main}fr\`, \`\${proportions.side}fr\`]

// Examples:
// 2:1 = ['2fr', '1fr'] - main 2x wider
// 1:1 = ['1fr', '1fr'] - equal widths`}
					>
						<div className="h-full w-full">
							<DashboardLayout template={dynamicLayout}>
								<LayoutItem area="header">
									<Panel
										bordered
										className="bg-rs-bg-card h-full flex items-center justify-center"
									>
										<h3 className="text-lg font-bold text-rs-heading">
											Proportion: {proportions.main}fr vs {proportions.side}fr
										</h3>
									</Panel>
								</LayoutItem>
								<LayoutItem area="main">
									<ChartPanel title={`Main (${proportions.main}fr)`}>
										<MiniChart option={barOption} />
									</ChartPanel>
								</LayoutItem>
								<LayoutItem area="side">
									<ChartPanel title={`Side (${proportions.side}fr)`}>
										<MiniChart option={pieOption} />
									</ChartPanel>
								</LayoutItem>
							</DashboardLayout>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 6 && (
					<LayoutSection
						title="6. DashboardGrid (Auto Layout)"
						badge="DashboardGrid"
						description="Automatic grid that wraps children into columns. Simpler API without explicit area naming."
						showCode={showCode}
						code={`<DashboardGrid columns={3} gap={16} rowHeight="300px">
  <Panel><Chart1 /></Panel>
  <Panel><Chart2 /></Panel>
  <Panel><Chart3 /></Panel>
</DashboardGrid>`}
					>
						<div className="h-full w-full p-6">
							<DashboardGrid columns={3} gap={16} fillHeight>
								<ChartPanel title="Chart 1">
									<MiniChart option={lineOption} />
								</ChartPanel>
								<ChartPanel title="Chart 2">
									<MiniChart option={barOption} />
								</ChartPanel>
								<ChartPanel title="Chart 3">
									<MiniChart option={pieOption} />
								</ChartPanel>
								<ChartPanel title="Chart 4">
									<MiniChart option={areaOption} />
								</ChartPanel>
								<ChartPanel title="Chart 5">
									<MiniChart option={lineOption} />
								</ChartPanel>
								<ChartPanel title="Chart 6">
									<MiniChart option={barOption} />
								</ChartPanel>
							</DashboardGrid>
						</div>
					</LayoutSection>
				)}

				{activeLayout === 7 && (
					<LayoutSection
						title="7. Responsive Layout"
						badge="ResponsiveDashboardLayout"
						description="Automatically adapts layout structure based on screen size. Resize browser to see changes!"
						showCode={showCode}
						code={`const templates = {
  desktop: {
    areas: \`"kpi1 kpi2" "main main"\`,
    columns: ['1fr', '1fr'],
  },
  mobile: {
    areas: \`"kpi1" "kpi2" "main"\`,
    columns: ['1fr'],
  },
}

<ResponsiveDashboardLayout templates={templates}>...</ResponsiveDashboardLayout>`}
					>
						<div className="h-full w-full">
							<ResponsiveDashboardLayout
								templates={{
									desktop: {
										areas: `"kpi1 kpi2" "main main"`,
										columns: ["1fr", "1fr"],
										rows: ["100px", "1fr"],
										gap: 16,
									},
									mobile: {
										areas: `"kpi1" "kpi2" "main"`,
										columns: ["1fr"],
										rows: ["80px", "80px", "1fr"],
										gap: 12,
									},
								}}
							>
								<LayoutItem area="kpi1">
									<KPICard title="Users" value="12.4K" change="+18.2%" />
								</LayoutItem>
								<LayoutItem area="kpi2">
									<KPICard title="Engagement" value="67%" change="+5.3%" />
								</LayoutItem>
								<LayoutItem area="main">
									<ChartPanel title="Responsive Chart">
										<MiniChart option={areaOption} />
									</ChartPanel>
								</LayoutItem>
							</ResponsiveDashboardLayout>
						</div>
					</LayoutSection>
				)}
			</div>
		</div>
	);
}

// Helper component for layout sections
function LayoutSection({
	title,
	badge,
	description,
	showCode,
	code,
	info,
	children,
}: {
	title: string;
	badge: string;
	description: string;
	showCode: boolean;
	code: string;
	info?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="h-full grid grid-rows-[auto_1fr] p-6 gap-4">
			<Panel bordered shaded className="bg-rs-bg-card">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-rs-heading mb-2">
							{title} <Badge content={badge} color="blue" />
						</h2>
						<p className="text-rs-secondary">{description}</p>
					</div>
				</div>
			</Panel>

			{showCode ? (
				<div className="overflow-auto">
					<CodeBlock code={code} />
					{info && (
						<div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
							<p className="text-sm text-yellow-900">{info}</p>
						</div>
					)}
				</div>
			) : (
				<div className="min-h-0 h-full">{children}</div>
			)}
		</div>
	);
}
