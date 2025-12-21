"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface LayoutOption {
	id: string;
	name: string;
	description?: string;
}

interface LayoutNavigatorProps {
	layouts: LayoutOption[];
	currentIndex: number;
	onNavigate: (index: number) => void;
	className?: string;
	/** Compact inline variant for embedding in dashboard grid */
	compact?: boolean;
}

export function LayoutNavigator({
	layouts,
	currentIndex,
	onNavigate,
	className = "",
	compact = false,
}: LayoutNavigatorProps) {
	const currentLayout = layouts[currentIndex];
	const total = layouts.length;

	const handlePrevious = () => {
		const newIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
		onNavigate(newIndex);
	};

	const handleNext = () => {
		const newIndex = currentIndex === total - 1 ? 0 : currentIndex + 1;
		onNavigate(newIndex);
	};

	if (compact) {
		return (
			<div
				className={`h-full flex items-center justify-between px-3 bg-rs-bg-card border border-rs-border rounded-lg ${className}`}
			>
				<button
					type="button"
					onClick={handlePrevious}
					className="p-1.5 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Previous layout"
				>
					<ChevronLeft size={20} />
				</button>

				<div className="flex-1 text-center min-w-0 px-2">
					<div className="font-semibold text-rs-heading truncate text-sm">
						{currentLayout?.name ?? "Unknown"}
					</div>
					<div className="text-xs text-rs-secondary">
						{currentIndex + 1} / {total}
					</div>
				</div>

				<button
					type="button"
					onClick={handleNext}
					className="p-1.5 rounded hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Next layout"
				>
					<ChevronRight size={20} />
				</button>
			</div>
		);
	}

	// Full version with Panel (original)
	return (
		<div
			className={`p-4 bg-rs-bg-card border border-rs-border rounded-lg ${className}`}
		>
			<div className="flex items-center justify-between gap-4">
				<button
					type="button"
					onClick={handlePrevious}
					className="p-2 rounded-lg hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Previous layout"
				>
					<ChevronLeft size={24} />
				</button>

				<div className="flex-1 text-center">
					<div className="font-semibold text-lg text-rs-heading">
						{currentLayout?.name ?? "Unknown Layout"}
					</div>
					<div className="text-sm text-rs-secondary">
						{currentIndex + 1} / {total}
						{currentLayout?.description && ` • ${currentLayout.description}`}
					</div>
				</div>

				<button
					type="button"
					onClick={handleNext}
					className="p-2 rounded-lg hover:bg-rs-bg-active transition-colors text-rs-text-primary"
					aria-label="Next layout"
				>
					<ChevronRight size={24} />
				</button>
			</div>
		</div>
	);
}
