/**
 * Generic reusable loading state components for routes
 */

import { Loader } from 'rsuite'
import type { RouteLoadingProps } from './types'

export function RouteLoadingState({
  message = 'Loading...',
  size = 'lg',
  fullScreen = true,
}: RouteLoadingProps) {
  const content = (
    <div className="flex items-center justify-center">
      <Loader size={size} content={message} vertical />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rs-body">
        {content}
      </div>
    )
  }

  return content
}

/**
 * Specialized loading fallback for chart content areas
 */
export function ChartLoadingFallback({ 
  message = 'Loading charts...' 
}: { 
  message?: string 
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader size="lg" content={message} vertical />
    </div>
  )
}

