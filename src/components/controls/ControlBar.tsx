"use client";

import { ChevronLeft, ChevronRight, Palette, Shuffle } from "lucide-react";
import type { LayoutOption } from "./LayoutNavigator";

interface KPIData {
	title: string;
	value: string | number;
	change?: string;
	changeType?: "positive" | "negative" | "neutral";
}

interface ControlBarProps {
	/** Layout navigation */
	layouts: LayoutOption[];
	currentLayoutIndex: number;
	onLayoutChange: (index: number) => void;
	/** KPI data to display */
	kpis: KPIData[];
	/** Theme toggle callback */
	onThemeToggle?: () => void;
	/** Current theme */
	isDark?: boolean;
	/** Randomize data callback */
	onRandomize?: () => void;
	className?: string;
}

export function ControlBar({
	layouts,
	currentLayoutIndex,
	onLayoutChange,
	kpis,
	onThemeToggle,
	isDark = false,
	onRandomize,
	className = "",
}: ControlBarProps) {
	const currentLayout = layouts[currentLayoutIndex];
	const total = layouts.length;

	const handlePrev = () => {
		const newIndex =
			currentLayoutIndex === 0 ? total - 1 : currentLayoutIndex - 1;
		onLayoutChange(newIndex);
	};

	const handleNext = () => {
		const newIndex =
			currentLayoutIndex === total - 1 ? 0 : currentLayoutIndex + 1;
		onLayoutChange(newIndex);
	};

	const getChangeColor = (type?: "positive" | "negative" | "neutral") => {
		switch (type) {
			case "positive":
				return "text-green-500";
			case "negative":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	};

	return (
		<div
			className={`flex items-center gap-2 p-2 bg-rs-bg-card border border-rs-border rounded-lg ${className}`}
		>
			{/* Layout Navigator */}
			<div className="flex items-center gap-1 pr-3 border-r border-rs-border">
				<button
					type="button"
					onClick={handlePrev}
					className="p-1 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Previous layout"
				>
					<ChevronLeft size={18} />
				</button>
				<div className="text-center min-w-24">
					<div className="text-xs font-semibold text-rs-heading truncate">
						{currentLayout?.name ?? "Layout"}
					</div>
					<div className="text-[10px] text-rs-secondary">
						{currentLayoutIndex + 1}/{total}
					</div>
				</div>
				<button
					type="button"
					onClick={handleNext}
					className="p-1 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Next layout"
				>
					<ChevronRight size={18} />
				</button>
			</div>

			{/* KPI Metrics */}
			<div className="flex-1 flex items-center gap-3 overflow-x-auto">
				{kpis.map((kpi) => (
					<div
						key={kpi.title}
						className="flex items-center gap-2 px-2 py-1 min-w-max"
					>
						<span className="text-xs text-rs-secondary">{kpi.title}:</span>
						<span className="text-sm font-bold text-rs-primary">
							{kpi.value}
						</span>
						{kpi.change && (
							<span className={`text-xs ${getChangeColor(kpi.changeType)}`}>
								{kpi.change}
							</span>
						)}
					</div>
				))}
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-1 pl-3 border-l border-rs-border">
				{onThemeToggle && (
					<button
						type="button"
						onClick={onThemeToggle}
						className="p-1.5 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
						aria-label="Toggle theme"
						title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					>
						<Palette size={16} />
					</button>
				)}
				{onRandomize && (
					<button
						type="button"
						onClick={onRandomize}
						className="p-1.5 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
						aria-label="Randomize data"
						title="Randomize data"
					>
						<Shuffle size={16} />
					</button>
				)}
			</div>
		</div>
	);
}
