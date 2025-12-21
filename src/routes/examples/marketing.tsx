import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ComboChart, DualAxisChart, MultiGridChart } from "@/components/charts";
import type { LayoutOption } from "@/components/controls";
import { ControlBar } from "@/components/controls";
import { StatsList } from "@/components/ui";
import { generateSalesData, randomSeed } from "@/lib/sampleDataGenerator";
import { ThemeProvider, useAppTheme } from "@/providers/ThemeProvider";

export const Route = createFileRoute("/examples/marketing")({
	component: MarketingPage,
});

const layouts: LayoutOption[] = [
	{
		id: "matrix",
		name: "Matrix",
		description: "4-in-1 + sidebar charts",
	},
	{
		id: "campaigns",
		name: "Campaigns",
		description: "Multi-chart: Line + Bar + Scatter",
	},
	{ id: "funnel", name: "Funnel", description: "Dual axis: Bar + Line" },
];

function MarketingContent() {
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
	const engagementData = generateSalesData(12, seed + 3);
	const growthData = generateSalesData(12, seed + 4);
	const volumeData = generateSalesData(12, seed + 5);

	// KPIs
	const kpis = [
		{
			title: "Impressions",
			value: `${((seed % 500) + 800).toLocaleString()}K`,
			change: "+18%",
			changeType: "positive" as const,
		},
		{
			title: "Clicks",
			value: `${((seed % 50) + 45).toLocaleString()}K`,
			change: "+12%",
			changeType: "positive" as const,
		},
		{
			title: "CTR",
			value: `${(((seed % 30) + 20) / 10).toFixed(1)}%`,
			change: "+0.5%",
			changeType: "positive" as const,
		},
		{
			title: "Spend",
			value: `$${((seed % 20) + 15).toLocaleString()}K`,
			change: "-5%",
			changeType: "positive" as const,
		},
	];

	const campaignStats = [
		{ label: "Active Campaigns", value: `${(seed % 12) + 5}` },
		{ label: "Avg. CPC", value: `$${((seed % 150) + 50) / 100}` },
		{ label: "Conversions", value: `${(seed % 2000) + 1500}` },
		{ label: "ROI", value: `${(seed % 150) + 180}%` },
	];

	const audienceStats = [
		{
			label: "Total Users",
			value: `${((seed % 100) + 150).toLocaleString()}K`,
		},
		{ label: "New Users", value: `${((seed % 30) + 20).toLocaleString()}K` },
		{ label: "Return Rate", value: `${(seed % 20) + 35}%` },
		{ label: "Avg. Session", value: `${(seed % 5) + 3}m` },
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
								Marketing Dashboard (4 Charts in Single ECharts)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<MultiGridChart
									lineData={engagementData}
									areaData={growthData}
									barData={[
										{ category: "Email", value: (seed % 40) + 25 },
										{ category: "Social", value: (seed % 35) + 30 },
										{ category: "Search", value: (seed % 45) + 20 },
										{ category: "Direct", value: (seed % 30) + 15 },
									]}
									hBarData={[
										{ category: "Q1", value: (seed % 80) + 40 },
										{ category: "Q2", value: (seed % 75) + 50 },
										{ category: "Q3", value: (seed % 85) + 45 },
										{ category: "Q4", value: (seed % 90) + 60 },
									]}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Channel ROI (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={engagementData}
										secondaryData={growthData.map((d, i) => ({
											...d,
											value: (((seed + i) % 30) + 10) / 10,
										}))}
										primaryName="Spend"
										secondaryName="ROI"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Campaign Trend (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={volumeData}
										barData={engagementData}
										lineName="Clicks"
										barName="Impressions"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Campaigns Layout - ComboChart (Line + Bar + Scatter in one ECharts) */}
				{currentLayout.id === "campaigns" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Engagement Analysis (Line + Bar + Scatter)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<ComboChart
									lineData={engagementData}
									barData={volumeData}
									scatterData={growthData}
									lineName="Engagement Rate"
									barName="Click Volume"
									scatterName="Conversions"
									title=""
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Channel ROI (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={engagementData}
										secondaryData={growthData.map((d, i) => ({
											...d,
											value: (((seed + i) % 30) + 10) / 10,
										}))}
										primaryName="Spend"
										secondaryName="ROI"
										primaryUnit="K"
										secondaryUnit="%"
									/>
								</div>
							</div>
							<StatsList
								data={campaignStats}
								title="Campaign Stats"
								className="shrink-0"
							/>
						</div>
					</>
				)}

				{/* Funnel Layout - DualAxisChart */}
				{currentLayout.id === "funnel" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Conversion Funnel (Dual Y-Axis: Volume + Rate)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<DualAxisChart
									primaryData={engagementData}
									secondaryData={growthData.map((d, i) => ({
										...d,
										value: 100 - i * 8 + ((seed + i) % 10),
									}))}
									primaryName="Volume"
									secondaryName="Conv. Rate"
									primaryUnit=""
									secondaryUnit="%"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Stage Performance (Line + Bar)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={volumeData}
										barData={engagementData}
										lineName="Progression"
										barName="Drop-off"
									/>
								</div>
							</div>
							<StatsList
								data={audienceStats}
								title="Funnel Metrics"
								className="shrink-0"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function MarketingPage() {
	return (
		<ThemeProvider>
			<MarketingContent />
		</ThemeProvider>
	);
}
