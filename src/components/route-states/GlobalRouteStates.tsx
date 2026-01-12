/**
 * Generic global route state components
 * Used as defaults for all routes in router.tsx
 */

import { Loader } from "rsuite";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import type { RouteErrorProps } from "./types";

export function GlobalPendingComponent() {
	return (
		<div
			className="bg-rs-body flex flex-col"
			style={{ height: "calc(100vh - 70px)" }}
		>
			<div className="flex items-center justify-center flex-1">
				<Loader size="lg" content="Loading..." vertical />
			</div>
		</div>
	);
}

export function GlobalErrorComponent({ error, reset }: RouteErrorProps) {
	return (
		<RouteErrorBoundary
			error={error}
			reset={reset}
			title="Something went wrong"
			showHomeButton={true}
			showResetButton={true}
		/>
	);
}
