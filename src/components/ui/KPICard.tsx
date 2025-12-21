"use client";

import type { ReactNode } from "react";
import { Text } from "rsuite";

interface KPICardProps {
	title: string;
	value: string | number;
	change?: string;
	changeType?: "positive" | "negative" | "neutral";
	icon?: ReactNode;
	className?: string;
	valueColor?: "primary" | "secondary" | "default" | string;
	/** Compact mode for reduced height - displays inline */
	compact?: boolean;
}

export function KPICard({
	title,
	value,
	change,
	changeType = "neutral",
	icon,
	className = "",
	valueColor = "primary",
	compact = false,
}: KPICardProps) {
	const changeColor =
		changeType === "positive"
			? "text-green-500"
			: changeType === "negative"
				? "text-red-500"
				: "text-gray-500";

	const getValueColor = () => {
		switch (valueColor) {
			case "primary":
				return "var(--rs-primary-500)";
			case "secondary":
				return "var(--rs-text-secondary)";
			case "default":
				return "var(--rs-text-heading)";
			default:
				return valueColor;
		}
	};

	// Compact variant - horizontal layout with smaller text
	if (compact) {
		return (
			<div
				className={`h-full flex items-center justify-between px-3 py-2 rounded-md border border-rs-border bg-rs-bg-card ${className}`}
			>
				<div className="flex items-center gap-2 min-w-0">
					{icon && <span className="text-rs-primary shrink-0">{icon}</span>}
					<Text size="sm" className="text-rs-secondary truncate">
						{title}
					</Text>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<span
						style={{
							fontSize: "1.125rem",
							fontWeight: 700,
							color: getValueColor(),
						}}
					>
						{value}
					</span>
					{change && (
						<Text size="xs" className={changeColor}>
							{change}
						</Text>
					)}
				</div>
			</div>
		);
	}

	// Default variant - vertical layout
	return (
		<div
			className={`h-full flex flex-col justify-center p-3 gap-0.5 rounded-md border border-rs-border bg-rs-bg-card ${className}`}
		>
			<div className="flex justify-between items-center w-full">
				<Text size="xs" className="text-rs-secondary truncate">
					{title}
				</Text>
				{icon && <span className="text-rs-primary text-sm">{icon}</span>}
			</div>
			<span
				style={{
					fontSize: "1.25rem",
					lineHeight: "1.5rem",
					fontWeight: 700,
					color: getValueColor(),
				}}
			>
				{value}
			</span>
			{change && (
				<Text size="xs" className={changeColor}>
					{change}
				</Text>
			)}
		</div>
	);
}
