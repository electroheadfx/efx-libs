/**
 * Shared types for route state components
 */

export interface RouteErrorProps {
  error: Error
  reset: () => void
  title?: string
  showHomeButton?: boolean
  showResetButton?: boolean
}

export interface RouteLoadingProps {
  message?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

