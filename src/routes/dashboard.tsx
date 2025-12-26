import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	LineChart,
	PieChart,
	Settings,
	TrendingUp,
} from "lucide-react";
import { Panel, Text } from "rsuite";
import { ThemeControlPanel } from "@/components/controls";

export const Route = createFileRoute("/dashboard")({
	component: NavigationHub,
});

interface PageCard {
	to: string;
	title: string;
	description: string;
	icon: LucideIcon;
	features: string[];
	layouts: number;
}

const pages: PageCard[] = [
	{
		to: "/examples/sales-analytics",
		title: "Sales Analytics",
		description:
			"E-commerce sales performance dashboards with revenue trends, category analysis, and market insights.",
		icon: TrendingUp,
		features: [
			"Line charts",
			"Bar charts",
			"Pie charts",
			"Scatter plots",
			"KPI cards",
		],
		layouts: 3,
	},
	{
		to: "/examples/performance",
		title: "Performance Metrics",
		description:
			"System and application monitoring with real-time metrics, resource allocation, and load analysis.",
		icon: BarChart3,
		features: [
			"Multi-line trends",
			"Resource bars",
			"Scatter distribution",
			"Comparison views",
		],
		layouts: 3,
	},
	{
		to: "/examples/financial",
		title: "Financial Reports",
		description:
			"Comprehensive financial data visualization with revenue, expenses, and profit margin analysis.",
		icon: LineChart,
		features: [
			"Area charts",
			"Budget allocation",
			"Risk analysis",
			"Financial KPIs",
		],
		layouts: 3,
	},
	{
		to: "/examples/marketing",
		title: "Marketing Dashboard",
		description:
			"Campaign analytics with engagement metrics, audience demographics, and conversion funnels.",
		icon: PieChart,
		features: [
			"Demographics pie",
			"Channel performance",
			"ROI scatter",
			"Funnel analysis",
		],
		layouts: 3,
	},
	{
		to: "/examples/operations",
		title: "Operations Center",
		description:
			"Operational monitoring with throughput tracking, alert patterns, and anomaly detection.",
		icon: Settings,
		features: [
			"Live monitoring",
			"Alert patterns",
			"Resource status",
			"Anomaly detection",
		],
		layouts: 3,
	},
];

function NavigationCard({ page }: { page: PageCard }) {
	const Icon = page.icon;

	return (
		<Link to={page.to} className="block group">
			<Panel
				bordered
				className="h-full bg-rs-bg-card hover:bg-rs-bg-active transition-colors cursor-pointer"
			>
				<div className="flex items-start gap-4">
					<div className="p-3 rounded-lg bg-rs-primary/10 text-rs-primary group-hover:bg-rs-primary group-hover:text-white transition-colors">
						<Icon size={24} />
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-1">
							<Text weight="semibold" className="text-lg text-rs-heading">
								{page.title}
							</Text>
							<span className="text-xs px-2 py-1 rounded bg-rs-bg-subtle text-rs-secondary">
								{page.layouts} layouts
							</span>
						</div>
						<Text className="text-rs-secondary text-sm mb-3">
							{page.description}
						</Text>
						<div className="flex flex-wrap gap-1.5">
							{page.features.map((feature) => (
								<span
									key={feature}
									className="text-xs px-2 py-0.5 rounded-full bg-rs-primary/10 text-rs-primary"
								>
									{feature}
								</span>
							))}
						</div>
					</div>
				</div>
			</Panel>
		</Link>
	);
}

function NavigationHub() {
	return (
		<div className="min-h-[calc(100vh-72px)] p-6 bg-rs-body">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<Text weight="bold" className="text-3xl text-rs-heading mb-2 block">
						Dashboard Examples
					</Text>
					<Text className="text-rs-secondary text-lg">
						Explore mixed chart dashboards with responsive layouts, KPI cards,
						and diverse visualizations
					</Text>
				</div>

				{/* Feature highlights */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<div className="text-center p-4 bg-rs-bg-card rounded-lg border border-rs-border">
						<div className="text-2xl font-bold text-rs-primary">5</div>
						<div className="text-sm text-rs-secondary">Dashboard Pages</div>
					</div>
					<div className="text-center p-4 bg-rs-bg-card rounded-lg border border-rs-border">
						<div className="text-2xl font-bold text-rs-primary">15</div>
						<div className="text-sm text-rs-secondary">Layout Variations</div>
					</div>
					<div className="text-center p-4 bg-rs-bg-card rounded-lg border border-rs-border">
						<div className="text-2xl font-bold text-rs-primary">5+</div>
						<div className="text-sm text-rs-secondary">Chart Types</div>
					</div>
					<div className="text-center p-4 bg-rs-bg-card rounded-lg border border-rs-border">
						<div className="text-2xl font-bold text-rs-primary">∞</div>
						<div className="text-sm text-rs-secondary">Random Data</div>
					</div>
				</div>

				{/* Theme controls */}
				<div className="mb-8 flex justify-center">
					<ThemeControlPanel />
				</div>

				{/* Page cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{pages.map((page) => (
						<NavigationCard key={page.to} page={page} />
					))}
				</div>

				{/* Instructions */}
				<div className="mt-8 text-center">
					<Panel bordered className="inline-block bg-rs-bg-card">
						<div className="flex items-center gap-6 text-sm text-rs-secondary">
							<div className="flex items-center gap-2">
								<kbd className="px-2 py-1 bg-rs-bg-subtle rounded text-xs">
									←
								</kbd>
								<kbd className="px-2 py-1 bg-rs-bg-subtle rounded text-xs">
									→
								</kbd>
								<span>Navigate layouts</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 bg-rs-primary/10 text-rs-primary rounded text-xs">
									🎲
								</span>
								<span>Randomize data</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="px-2 py-1 bg-rs-bg-subtle rounded text-xs">
									◐
								</span>
								<span>Toggle theme</span>
							</div>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	);
}
