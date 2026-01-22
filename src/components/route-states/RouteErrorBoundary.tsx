/**
 * Generic reusable error boundary component for routes
 */

import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button, ButtonGroup, Panel } from "rsuite";
import type { RouteErrorProps } from "./types";

export function RouteErrorBoundary({
	error,
	reset,
	title = "Something went wrong",
	showHomeButton = true,
	showResetButton = true,
}: RouteErrorProps) {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center min-h-screen bg-rs-body p-6">
			<Panel bordered shaded className="bg-rs-bg-card max-w-md w-full">
				<div className="flex flex-col items-center gap-4 p-6">
					{/* Icon */}
					<div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
						<AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
					</div>

					{/* Title */}
					<h2 className="text-xl font-bold text-rs-heading text-center">
						{title}
					</h2>

					{/* Error Message */}
					<p className="text-rs-secondary text-center">
						{error.message || "An unexpected error occurred"}
					</p>

					{/* Error Details (dev only) */}
					{import.meta.env.DEV && error.stack && (
						<details className="w-full">
							<summary className="text-xs text-rs-tertiary cursor-pointer hover:text-rs-secondary">
								Show error details
							</summary>
							<pre className="mt-2 p-2 bg-rs-bg-overlay rounded text-xs overflow-auto max-h-40">
								{error.stack}
							</pre>
						</details>
					)}

					{/* Actions */}
					<ButtonGroup className="w-full">
						{showResetButton && (
							<Button
								appearance="primary"
								onClick={reset}
								startIcon={<RefreshCw size={16} />}
							>
								Try Again
							</Button>
						)}
						{showHomeButton && (
							<Button
								appearance="ghost"
								onClick={() => router.navigate({ to: "/" })}
								startIcon={<Home size={16} />}
							>
								Go Home
							</Button>
						)}
					</ButtonGroup>
				</div>
			</Panel>
		</div>
	);
}
