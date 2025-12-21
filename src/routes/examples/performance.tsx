import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ComboChart, DualAxisChart, MultiGridChart } from "@/components/charts";
import type { LayoutOption } from "@/components/controls";
import { ControlBar } from "@/components/controls";
import { StatsList } from "@/components/ui";
import {
	generateSalesData,
	generateScatterData,
	randomSeed,
} from "@/lib/sampleDataGenerator";
import { ThemeProvider, useAppTheme } from "@/providers/ThemeProvider";

export const Route = createFileRoute("/examples/performance")({
	component: PerformancePage,
});

const layouts: LayoutOption[] = [
	{
		id: "matrix",
		name: "Matrix",
		description: "4-in-1 + sidebar charts",
	},
	{
		id: "realtime",
		name: "Real-time",
		description: "Combo: CPU + Memory + Events",
	},
	{ id: "historical", name: "Historical", description: "Dual axis trends" },
];

function PerformanceContent() {
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
	const _scatterData = generateScatterData(30, 0.6, seed + 5);
	const cpuData = generateSalesData(12, seed + 1);
	const memoryData = generateSalesData(12, seed + 2);
	const networkData = generateSalesData(12, seed + 3);

	// KPIs for performance
	const kpis = [
		{
			title: "CPU",
			value: `${(seed % 40) + 35}%`,
			change: "+12%",
			changeType: "positive" as const,
		},
		{
			title: "Memory",
			value: `${(seed % 30) + 45}%`,
			change: "+8%",
			changeType: "positive" as const,
		},
		{
			title: "Latency",
			value: `${(seed % 50) + 50}ms`,
			change: "-5%",
			changeType: "positive" as const,
		},
		{
			title: "Uptime",
			value: "99.97%",
			change: "+0.02%",
			changeType: "positive" as const,
		},
	];

	const liveStats = [
		{ label: "Active Connections", value: `${(seed % 500) + 200}` },
		{ label: "Requests/sec", value: `${(seed % 2000) + 1000}` },
		{ label: "Error Rate", value: `${((seed % 50) / 100).toFixed(2)}%` },
		{ label: "Avg Response", value: `${(seed % 100) + 50}ms` },
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
								System Overview (4 Charts in Single ECharts)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<MultiGridChart
									lineData={cpuData}
									areaData={memoryData}
									barData={[
										{ category: "CPU", value: (seed % 40) + 35 },
										{ category: "Memory", value: (seed % 30) + 45 },
										{ category: "Disk", value: (seed % 25) + 20 },
										{ category: "Network", value: (seed % 35) + 30 },
									]}
									hBarData={[
										{ category: "Server 1", value: (seed % 90) + 10 },
										{ category: "Server 2", value: (seed % 85) + 15 },
										{ category: "Server 3", value: (seed % 80) + 20 },
										{ category: "Server 4", value: (seed % 75) + 25 },
									]}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Load vs Latency (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={cpuData}
										secondaryData={networkData.map((d, i) => ({
											...d,
											value: (seed % 50) + 30 + i * 2,
										}))}
										primaryName="CPU %"
										secondaryName="Latency"
										primaryUnit="%"
										secondaryUnit="ms"
									/>
								</div>
							</div>
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Memory Trend (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={memoryData}
										barData={networkData}
										lineName="Memory"
										barName="Network"
									/>
								</div>
							</div>
						</div>
					</>
				)}

				{/* Real-time Layout - ComboChart */}
				{currentLayout.id === "realtime" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								System Metrics (CPU Line + Memory Bar + Network Scatter)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<ComboChart
									lineData={cpuData}
									barData={memoryData}
									scatterData={networkData}
									lineName="CPU %"
									barName="Memory GB"
									scatterName="Network I/O"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Load vs Latency (Dual Axis)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<DualAxisChart
										primaryData={cpuData}
										secondaryData={memoryData.map((d, i) => ({
											...d,
											value: (seed % 50) + 30 + i * 2,
										}))}
										primaryName="Load"
										secondaryName="Latency"
										primaryUnit="%"
										secondaryUnit="ms"
									/>
								</div>
							</div>
							<StatsList
								data={liveStats}
								title="Live Stats"
								className="flex-shrink-0"
							/>
						</div>
					</>
				)}

				{/* Historical Layout - DualAxisChart */}
				{currentLayout.id === "historical" && (
					<>
						<div className="bg-rs-card rounded-lg shadow-rs-md p-3 overflow-hidden">
							<h3 className="text-sm font-semibold text-rs-heading mb-2">
								Performance Trends (Throughput + Error Rate)
							</h3>
							<div className="h-[calc(100%-28px)]">
								<DualAxisChart
									primaryData={cpuData}
									secondaryData={networkData.map((d, i) => ({
										...d,
										value: ((seed + i) % 5) / 10,
									}))}
									primaryName="Throughput"
									secondaryName="Error Rate"
									primaryUnit="K/s"
									secondaryUnit="%"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 overflow-hidden">
							<div className="flex-1 bg-rs-card rounded-lg shadow-rs-md p-3 min-h-0">
								<h3 className="text-sm font-semibold text-rs-heading mb-2">
									Resource Utilization (Combo)
								</h3>
								<div className="h-[calc(100%-28px)]">
									<ComboChart
										lineData={memoryData}
										barData={cpuData}
										lineName="Memory"
										barName="CPU"
									/>
								</div>
							</div>
							<StatsList
								data={liveStats}
								title="Historical Avg"
								className="flex-shrink-0"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function PerformancePage() {
	return (
		<ThemeProvider>
			<PerformanceContent />
		</ThemeProvider>
	);
}
