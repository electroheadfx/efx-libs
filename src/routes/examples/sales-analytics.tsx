import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ComboChart, DualAxisChart, MultiGridChart } from "@/components/charts";
import type { LayoutOption } from "@/components/controls";
import { ControlBar } from "@/components/controls";
import { StatsList } from "@/components/ui";
import {
	generateDashboardData,
	generateSalesData,
	randomSeed,
} from "@/lib/sampleDataGenerator";
import { ThemeProvider, useAppTheme } from "@/providers/ThemeProvider";

export const Route = createFileRoute("/examples/sales-analytics")({
	component: SalesAnalyticsPage,
});

const layouts: LayoutOption[] = [
	{
		id: "matrix",
		name: "Matrix",
		description: "4-in-1 + sidebar charts",
	},
	{
		id: "detailed",
		name: "Detailed",
		description: "Combo: Line + Bar + Scatter",
	},
	{ id: "executive", name: "Executive", description: "Dual axis comparison" },
];

function SalesAnalyticsContent() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [seed, setSeed] = useState(() => randomSeed());
	const { theme, setTheme } = useAppTheme();

	const handleRandomize = useCallback(() => {
		setSeed(randomSeed());
	}, []);

	const handleThemeToggle = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);

	const currentLayout = layouts[currentIndex];
	const data = generateDashboardData(seed);
	const revenueData = generateSalesData(12, seed + 1);
	const ordersData = generateSalesData(12, seed + 2);
	const profitData = generateSalesData(12, seed + 3);

	// Convert KPI data for ControlBar
	const kpis = [
		{
			title: "Revenue",
			value: data.kpis.revenue.value,
			change: data.kpis.revenue.change,
			changeType: data.kpis.revenue.changeType,
		},
		{
			title: "Orders",
			value: data.kpis.orders.value,
			change: data.kpis.orders.change,
			changeType: data.kpis.orders.changeType,
		},
		{
			title: "Customers",
			value: data.kpis.users.value,
			change: data.kpis.users.change,
			changeType: data.kpis.users.changeType,
		},
		{
			title: "Conversion",
			value: data.kpis.conversion.value,
			change: data.kpis.conversion.change,
			changeType: data.kpis.conversion.changeType,
		},
	];

	return (
		<div className="h-[calc(100vh-72px)] flex flex-col p-3 gap-3 bg-rs-body overflow-hidden">
			{/* Control Bar - Always at top */}
			<ControlBar
				layouts={layouts}
				currentLayoutIndex={currentIndex}
				onLayoutChange={setCurrentIndex}
				kpis={kpis}
				onThemeToggle={handleThemeToggle}
				isDark={theme === "dark"}
				onRandomize={handleRandomize}
			/>

			{/* Main Content Area */}
			<div
				className="flex-1 grid gap-3 min-h-0 overflow-hidden"
				style={{
					gridTemplateColumns: "2fr 1fr",
					gridTemplateRows: "1fr",
				}}
			>
				{/* Matrix Layout - MultiGridChart (4 in 1) + Sidebar with other charts */}
				{currentLayout.id === "matrix" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Sales Dashboard (4 Charts in Single ECharts Instance)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<MultiGridChart
									lineData={revenueData}
									areaData={ordersData}
									barData={data.categoryData}
									hBarData={data.categoryData.slice().reverse()}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Revenue vs Growth (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={revenueData}
										secondaryData={profitData.map((d, i) => ({
											...d,
											value: ((seed + i) % 20) + 5,
										}))}
										primaryName="Revenue"
										secondaryName="Growth %"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Orders Trend (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={ordersData}
										barData={profitData}
										lineName="Orders"
										barName="Profit"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Detailed Layout - ComboChart */}
				{currentLayout.id === "detailed" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Revenue vs Orders (Line + Bar in Single Chart)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<ComboChart
									lineData={revenueData}
									barData={ordersData}
									scatterData={profitData}
									lineName="Revenue Trend"
									barName="Order Volume"
									scatterName="Profit Points"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Margin Analysis (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={revenueData}
										secondaryData={profitData.map((d, i) => ({
											...d,
											value: ((seed + i) % 25) + 15,
										}))}
										primaryName="Revenue"
										secondaryName="Margin %"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<StatsList
								data={data.stats}
								title="Key Metrics"
								className="shrink-0"
							/>
						</div>
					</>
				)}

				{/* Executive Layout - Dual Axis focus */}
				{currentLayout.id === "executive" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Executive Summary (Revenue + Growth Rate)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<DualAxisChart
									primaryData={revenueData}
									secondaryData={ordersData.map((d, i) => ({
										...d,
										value: (i + 1) * 2 + (seed % 5),
									}))}
									primaryName="Revenue"
									secondaryName="Growth %"
									primaryUnit="M"
									secondaryUnit="%"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Category Performance (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={profitData}
										barData={ordersData}
										lineName="Profit"
										barName="Orders"
									/>
								</div>
							</div>
							<StatsList
								data={data.stats}
								title="Executive KPIs"
								className="shrink-0"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function SalesAnalyticsPage() {
	return (
		<ThemeProvider>
			<SalesAnalyticsContent />
		</ThemeProvider>
	);
}
