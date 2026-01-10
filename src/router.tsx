import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance with optimized defaults
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,

    // Preloading configuration
    defaultPreloadStaleTime: 30_000, // Preload if cache > 30s old

    // Cache configuration
    defaultStaleTime: 0, // Data stale immediately (revalidate on access)
    defaultGcTime: 30 * 60_000, // Keep in memory for 30 minutes

    // Pending state configuration
    defaultPendingMs: 500, // Wait 500ms before showing pending
    defaultPendingMinMs: 300, // Show pending for at least 300ms
  })

  return router
}
