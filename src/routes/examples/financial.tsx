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

export const Route = createFileRoute("/examples/financial")({
	component: FinancialPage,
});

const layouts: LayoutOption[] = [
	{
		id: "matrix",
		name: "Matrix",
		description: "4-in-1 + sidebar charts",
	},
	{ id: "trends", name: "Trends", description: "Dual axis: Revenue + Margin" },
	{ id: "summary", name: "Summary", description: "Combo: P&L analysis" },
];

function FinancialContent() {
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
	const expenseData = generateSalesData(12, seed + 2);
	const profitData = generateSalesData(12, seed + 3);

	// KPIs
	const kpis = [
		{
			title: "Revenue",
			value: `$${((seed % 500) + 800).toLocaleString()}K`,
			change: "+15%",
			changeType: "positive" as const,
		},
		{
			title: "Expenses",
			value: `$${((seed % 300) + 400).toLocaleString()}K`,
			change: "+8%",
			changeType: "negative" as const,
		},
		{
			title: "Profit",
			value: `$${((seed % 200) + 300).toLocaleString()}K`,
			change: "+22%",
			changeType: "positive" as const,
		},
		{
			title: "Margin",
			value: `${(seed % 15) + 20}%`,
			change: "+3%",
			changeType: "positive" as const,
		},
	];

	const financialStats = [
		{
			label: "Net Income",
			value: `$${((seed % 150) + 200).toLocaleString()}K`,
		},
		{ label: "EBITDA", value: `$${((seed % 180) + 280).toLocaleString()}K` },
		{
			label: "Operating Cash",
			value: `$${((seed % 120) + 150).toLocaleString()}K`,
		},
		{ label: "ROE", value: `${(seed % 8) + 12}%` },
	];

	return (
		<div className="h-[calc(100vh-72px)] flex flex-col p-3 gap-3 bg-rs-body overflow-hidden">
			{/* Control Bar */}
			<ControlBar
				layouts={layouts}
				currentLayoutIndex={currentIndex}
				onLayoutChange={setCurrentIndex}
				kpis={kpis}
				onThemeToggle={handleThemeToggle}
				isDark={theme === "dark"}
				onRandomize={handleRandomize}
			/>

			{/* Main Content */}
			<div
				className="flex-1 grid gap-3 min-h-0 overflow-hidden"
				style={{
					gridTemplateColumns: "2fr 1fr",
					gridTemplateRows: "1fr",
				}}
			>
				{/* Matrix Layout - MultiGridChart (4 in 1) + Sidebar */}
				{currentLayout.id === "matrix" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Financial Dashboard (4 Charts in Single ECharts)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<MultiGridChart
									lineData={revenueData}
									areaData={profitData}
									barData={data.categoryData}
									hBarData={data.categoryData.map((d) => ({
										...d,
										value: d.value * 0.7,
									}))}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Revenue vs Margin (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={revenueData}
										secondaryData={profitData.map((d, i) => ({
											...d,
											value: (seed % 10) + 18 + i * 0.5,
										}))}
										primaryName="Revenue"
										secondaryName="Margin"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Expense Trend (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={expenseData}
										barData={profitData}
										lineName="Expenses"
										barName="Net Profit"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Trends Layout - DualAxisChart */}
				{currentLayout.id === "trends" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Revenue & Margin Trends (Dual Y-Axis)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<DualAxisChart
									primaryData={revenueData}
									secondaryData={profitData.map((d, i) => ({
										...d,
										value: (seed % 10) + 18 + i * 0.5,
									}))}
									primaryName="Revenue"
									secondaryName="Margin"
									primaryUnit="K"
									secondaryUnit="%"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Expense Breakdown (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={expenseData}
										barData={profitData}
										lineName="Expenses"
										barName="Net Profit"
									/>
								</div>
							</div>
							<StatsList
								data={financialStats}
								title="Financials"
								className="shrink-0"
							/>
						</div>
					</>
				)}

				{/* Summary Layout - ComboChart */}
				{currentLayout.id === "summary" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								P&L Analysis (Revenue Bar + Expense Line + Profit Scatter)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<ComboChart
									lineData={expenseData}
									barData={revenueData}
									scatterData={profitData}
									lineName="Expenses"
									barName="Revenue"
									scatterName="Net Profit"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									YoY Growth (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={revenueData}
										secondaryData={expenseData.map((d, i) => ({
											...d,
											value: ((seed + i) % 20) + 5,
										}))}
										primaryName="This Year"
										secondaryName="Growth %"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<StatsList
								data={financialStats}
								title="Summary"
								className="shrink-0"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function FinancialPage() {
	return (
		<ThemeProvider>
			<FinancialContent />
		</ThemeProvider>
	);
}
