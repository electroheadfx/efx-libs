import { createRouter } from "@tanstack/react-router";
import {
	GlobalErrorComponent,
	GlobalPendingComponent,
} from "./components/route-states";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,

		defaultPendingComponent: GlobalPendingComponent,
		defaultErrorComponent: GlobalErrorComponent,

		defaultPreloadStaleTime: 30_000,
		defaultStaleTime: 10_000,
		defaultGcTime: 5 * 60_000,

		defaultPendingMs: 500,
		defaultPendingMinMs: 300,
	});

	return router;
};
