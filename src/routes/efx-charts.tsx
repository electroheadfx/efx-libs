/**
 * EfxCharts Finance Dashboard
 *
 * Demonstrates the EfxCharts component with the finance layout
 * matching the finance.js reference implementation.
 * Uses deferred server-side data loading with streaming via TanStack Router.
 * Seed is driven by URL search params for shareability.
 *
 * OPTIMIZATIONS:
 * - React 19 use() hook for cleaner deferred data handling
 * - Global cache configuration from router.tsx
 * - Request cancellation support
 */

import { createFileRoute, defer, useNavigate } from "@tanstack/react-router";
import { useState, Suspense, use } from "react";
import { Panel, Button, ButtonGroup } from "rsuite";
import {
	EfxChartsLayout,
	EFX_CHART_TEMPLATES,
	createTypedChart,
} from "../components/EfxChart";
import { EfxLayout, LayoutItem } from "../components/EfxLayout";
import {
	getEfxChartsData,
	type EfxChartsFinanceData,
} from "../serverActions/efxChartsActions";
import { ChartLoadingFallback } from "../components/route-states";

export const Route = createFileRoute("/efx-charts")({
	validateSearch: (search: Record<string, unknown>) => ({
		seed: Number(search.seed) || 42,
	}),

	loaderDeps: ({ search }) => ({
		seed: search.seed,
	}),

	loader: async ({ deps, abortController }) => {
		return {
			data: defer(
				getEfxChartsData({
					data: { seed: deps.seed },
					signal: abortController.signal,
				}),
			),
		};
	},

	component: EfxChartsDemo,
});

/**
 * Finance Dashboard Demo Component
 * Main route component that renders immediately with control panel
 */
function EfxChartsDemo() {
	const { data } = Route.useLoaderData(); // data is a Promise
	const { seed } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [sidebarPosition, setSidebarPosition] = useState<"left" | "right">(
		"left",
	);

	// Handle randomize - just update URL, loader handles the rest
	const handleRandomize = () => {
		navigate({
			search: { seed: Math.floor(Math.random() * 100000) },
		});
	};

	return (
		<div
			className="bg-rs-body flex flex-col"
			style={{ height: "calc(100vh - 70px)" }}
		>
			{/* Control Panel - renders immediately */}
			<Panel
				bordered
				shaded
				className="bg-rs-bg-card m-6 mb-0"
				style={{ flexShrink: 0 }}
			>
				<div className="flex flex-wrap items-center justify-between gap-4">
					<p className="text-rs-secondary">
						Matrix-based ECharts layout with responsive design
					</p>
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-sm text-rs-secondary whitespace-nowrap">
								Sidebar:
							</span>
							<ButtonGroup>
								<Button
									appearance={
										sidebarPosition === "left" ? "primary" : "default"
									}
									size="sm"
									onClick={() => setSidebarPosition("left")}
								>
									Left
								</Button>
								<Button
									appearance={
										sidebarPosition === "right" ? "primary" : "default"
									}
									size="sm"
									onClick={() => setSidebarPosition("right")}
								>
									Right
								</Button>
							</ButtonGroup>
						</div>
						<Button appearance="primary" onClick={handleRandomize}>
							🎲 Randomize (seed: {seed})
						</Button>
					</div>
				</div>
			</Panel>

			{/* EfxLayout with Title + Chart Content */}
			<EfxLayout
				className="border rounded-lg m-6 h-full"
				template={{
					areas: `"title" "content"`,
					columns: ["1fr"],
					rows: ["auto", "1fr"],
					gap: 10,
					padding: 24,
				}}
			>
				{/* Title */}
				<LayoutItem area="title">
					<h2>Finances Efx Charts</h2>
				</LayoutItem>

				{/* Chart Content Area - streams in after data loads */}
				<LayoutItem area="content">
					{/* Suspense boundary catches suspension from use() hook */}
					<Suspense fallback={<ChartLoadingFallback />}>
						{/* Pass promise to component that uses use() hook */}
						<ChartsContent
							dataPromise={data}
							sidebarPosition={sidebarPosition}
						/>
					</Suspense>
				</LayoutItem>
			</EfxLayout>
		</div>
	);
}

/**
 * Charts Content Component
 * Uses React 19's use() hook to unwrap the deferred data promise
 * This component suspends until the promise resolves
 */
function ChartsContent({
	dataPromise,
	sidebarPosition,
}: {
	dataPromise: Promise<EfxChartsFinanceData>;
	sidebarPosition: "left" | "right";
}) {
	// ✨ React 19 use() hook - suspends until promise resolves
	const chartData = use(dataPromise);

	const handleChartReady = (chart: import("echarts").ECharts) => {
		console.log("EfxChartsLayout ready:", chart);
	};

	const handleEvents = {
		click: (params: Record<string, unknown>) => {
			console.log("Chart clicked:", params);
		},
	};

	// Create typed EfxChart for FINANCE_LAYOUT - enables autocomplete on section prop
	const efxChartTemplate = EFX_CHART_TEMPLATES.finance;
	const EfxChart = createTypedChart(efxChartTemplate);

	return (
		<EfxChartsLayout
			template={efxChartTemplate}
			sidebarPosition={sidebarPosition}
			gap={20}
			onChartReady={handleChartReady}
			onEvents={handleEvents}
		>
			<EfxChart
				section="header"
				type="line"
				title={{
					text: "Header Section",
					textStyle: { fontSize: 14 },
				}}
				data={chartData.header}
				xAxis={{ type: "time" }}
				yAxis={{ splitNumber: 2 }}
				axisPointer={{
					type: "cross",
					label: { show: true },
					snap: true,
				}}
				series={{ symbol: "none" }}
				padding="0,0,0,0"
			/>
			<EfxChart
				section="sidebar"
				type="bar"
				title={{
					text: "Sidebar Section",
					textStyle: { fontSize: 14 },
				}}
				data={chartData.sidebar}
				xAxis={{ type: "value" }}
				yAxis={{ type: "time" }}
			/>
			<EfxChart
				section="main"
				type="line"
				title={{
					text: "Main Content Area",
					textStyle: { fontSize: 14 },
				}}
				data={chartData.main}
				xAxis={{ type: "time" }}
				axisPointer={{
					type: "cross",
					label: { show: true },
					snap: true,
				}}
				series={{ symbol: "none" }}
			/>
			<EfxChart
				section="footer"
				type="bar"
				title={{
					text: "Footer Section",
					textStyle: { fontSize: 14 },
				}}
				data={chartData.footer}
				xAxis={{ type: "time" }}
				yAxis={{ splitNumber: 2 }}
			/>
		</EfxChartsLayout>
	);
}

export default EfxChartsDemo;
