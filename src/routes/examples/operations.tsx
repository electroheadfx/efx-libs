import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ComboChart, DualAxisChart, MultiGridChart } from "@/components/charts";
import type { LayoutOption } from "@/components/controls";
import { ControlBar } from "@/components/controls";
import { StatsList } from "@/components/ui";
import { generateSalesData, randomSeed } from "@/lib/sampleDataGenerator";
import { ThemeProvider, useAppTheme } from "@/providers/ThemeProvider";

export const Route = createFileRoute("/examples/operations")({
	component: OperationsPage,
});

const layouts: LayoutOption[] = [
	{
		id: "matrix",
		name: "Matrix",
		description: "4-in-1 + sidebar charts",
	},
	{
		id: "live",
		name: "Live",
		description: "Combo: Throughput + Queue + Events",
	},
	{
		id: "daily",
		name: "Daily",
		description: "Dual axis: Productivity + Errors",
	},
];

function OperationsContent() {
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
	const throughputData = generateSalesData(12, seed + 5);
	const productivityData = generateSalesData(12, seed + 6);
	const queueData = generateSalesData(12, seed + 7);

	// KPIs
	const kpis = [
		{
			title: "Uptime",
			value: "99.97%",
			change: "+0.02%",
			changeType: "positive" as const,
		},
		{
			title: "Tasks",
			value: `${(seed % 500) + 300}`,
			change: "+25",
			changeType: "positive" as const,
		},
		{
			title: "Queue",
			value: `${(seed % 50) + 10}`,
			change: "-12",
			changeType: "positive" as const,
		},
		{
			title: "Errors",
			value: `${seed % 8}`,
			change: "-3",
			changeType: "positive" as const,
		},
	];

	const liveStats = [
		{ label: "Active Workers", value: `${(seed % 20) + 15}` },
		{ label: "Jobs/min", value: `${(seed % 500) + 200}` },
		{ label: "Avg Latency", value: `${(seed % 100) + 50}ms` },
		{ label: "CPU Usage", value: `${(seed % 40) + 35}%` },
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
								Operations Center (4 Charts in Single ECharts)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<MultiGridChart
									lineData={throughputData}
									areaData={productivityData}
									barData={[
										{ category: "Team A", value: (seed % 80) + 40 },
										{ category: "Team B", value: (seed % 70) + 50 },
										{ category: "Team C", value: (seed % 60) + 55 },
										{ category: "Team D", value: (seed % 90) + 35 },
									]}
									hBarData={[
										{ category: "Critical", value: (seed % 15) + 5 },
										{ category: "High", value: (seed % 25) + 10 },
										{ category: "Medium", value: (seed % 40) + 20 },
										{ category: "Low", value: (seed % 60) + 30 },
									]}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Load vs Response (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={throughputData}
										secondaryData={queueData.map((d, i) => ({
											...d,
											value: (seed % 80) + 40 + i * 3,
										}))}
										primaryName="Load"
										secondaryName="Response"
										primaryUnit="K"
										secondaryUnit="ms"
									/>
								</div>
							</div>
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Queue Status (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={queueData}
										barData={productivityData}
										lineName="Queue"
										barName="Processed"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Live Layout - ComboChart */}
				{currentLayout.id === "live" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Operations Dashboard (Throughput + Queue + Events)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<ComboChart
									lineData={throughputData}
									barData={queueData}
									scatterData={productivityData}
									lineName="Throughput"
									barName="Queue Depth"
									scatterName="Events"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Load vs Response (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={throughputData}
										secondaryData={queueData.map((d, i) => ({
											...d,
											value: (seed % 80) + 40 + i * 3,
										}))}
										primaryName="Load"
										secondaryName="Response"
										primaryUnit="K"
										secondaryUnit="ms"
									/>
								</div>
							</div>
							<StatsList
								data={liveStats}
								title="Live Stats"
								className="shrink-0"
							/>
						</div>
					</>
				)}

				{/* Daily Layout - DualAxisChart */}
				{currentLayout.id === "daily" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Daily Productivity (Volume + Error Rate)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<DualAxisChart
									primaryData={productivityData}
									secondaryData={throughputData.map((d, i) => ({
										...d,
										value: ((seed + i) % 5) / 10,
									}))}
									primaryName="Completed Tasks"
									secondaryName="Error Rate"
									primaryUnit=""
									secondaryUnit="%"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Team Performance (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={productivityData}
										barData={queueData}
										lineName="Productivity"
										barName="Workload"
									/>
								</div>
							</div>
							<StatsList
								data={liveStats}
								title="Daily Summary"
								className="shrink-0"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function OperationsPage() {
	return (
		<ThemeProvider>
			<OperationsContent />
		</ThemeProvider>
	);
}
