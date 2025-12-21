"use client";

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Panel, Text } from "rsuite";

interface NavigationCardProps {
	to: string;
	title: string;
	description: string;
	icon?: ReactNode;
	features?: string[];
	className?: string;
}

export function NavigationCard({
	to,
	title,
	description,
	icon,
	features = [],
	className = "",
}: NavigationCardProps) {
	return (
		<Link to={to} className={`block group ${className}`}>
			<Panel
				bordered
				shaded
				className="h-full bg-rs-bg-card hover:bg-rs-bg-active transition-all duration-200 hover:shadow-lg cursor-pointer"
			>
				<div className="flex flex-col h-full">
					<div className="flex items-start gap-4 mb-4">
						{icon && (
							<div className="p-3 rounded-lg bg-rs-primary/10 text-rs-primary">
								{icon}
							</div>
						)}
						<div className="flex-1">
							<Text
								weight="bold"
								className="text-xl text-rs-heading mb-1 group-hover:text-rs-primary transition-colors"
							>
								{title}
							</Text>
							<Text className="text-rs-secondary">{description}</Text>
						</div>
						<ArrowRight
							size={20}
							className="text-rs-secondary group-hover:text-rs-primary group-hover:translate-x-1 transition-all mt-1"
						/>
					</div>

					{features.length > 0 && (
						<div className="flex flex-wrap gap-2 mt-auto">
							{features.map((feature) => (
								<span
									key={feature}
									className="px-2 py-1 text-xs rounded-full bg-rs-bg-active text-rs-secondary"
								>
									{feature}
								</span>
							))}
						</div>
					)}
				</div>
			</Panel>
		</Link>
	);
}
