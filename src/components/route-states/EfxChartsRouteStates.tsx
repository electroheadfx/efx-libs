/**
 * Route-specific state components for efx-charts route
 * These match the visual design of the efx-charts page
 */

import { Loader, Panel } from "rsuite";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import type { RouteErrorProps } from "./types";

/**
 * Pending component for efx-charts route
 * Shows while the route loader is running (before component mounts)
 */
export function EfxChartsPendingComponent() {
	return (
		<div
			className="bg-rs-body flex flex-col"
			style={{ height: "calc(100vh - 70px)" }}
		>
			{/* Control Panel Skeleton */}
			<Panel bordered shaded className="bg-rs-bg-card m-6 mb-0">
				<div className="flex items-center justify-between">
					<p className="text-rs-secondary">
						Matrix-based ECharts layout with responsive design
					</p>
					<Loader size="sm" content="Loading..." />
				</div>
			</Panel>

			{/* Main Content Loading */}
			<div className="flex items-center justify-center flex-1">
				<Loader size="lg" content="Preparing charts..." vertical />
			</div>
		</div>
	);
}

/**
 * Error component for efx-charts route
 * Shows when the route loader or component throws an error
 */
export function EfxChartsErrorComponent({ error, reset }: RouteErrorProps) {
	return (
		<RouteErrorBoundary
			error={error}
			reset={reset}
			title="Failed to Load Chart Data"
			showHomeButton={true}
			showResetButton={true}
		/>
	);
}
