/**
 * useResizeObserver Hook
 *
 * Observes container size changes and triggers a callback.
 * Used for chart resize handling.
 */

import { useEffect, useRef, type RefObject } from "react"

interface UseResizeObserverOptions {
  /** Callback when size changes */
  onResize?: (entry: ResizeObserverEntry) => void
  /** Debounce delay in ms */
  debounceMs?: number
  /** Whether the observer is enabled */
  enabled?: boolean
}

/**
 * Hook to observe element resize events
 */
export function useResizeObserver<T extends HTMLElement>(
  containerRef: RefObject<T>,
  options: UseResizeObserverOptions = {},
): void {
  const { onResize, debounceMs = 100, enabled = true } = options
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled || !containerRef.current || !onResize) return

    const element = containerRef.current

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      // Debounce resize events
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        onResize(entry)
      }, debounceMs)
    })

    resizeObserver.observe(element)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      resizeObserver.disconnect()
    }
  }, [containerRef, onResize, debounceMs, enabled])
}

/**
 * Simplified resize observer that just calls resize on the target
 */
export function useAutoResize<T extends HTMLElement>(
  containerRef: RefObject<T>,
  resizeCallback: () => void,
  enabled = true,
): void {
  useResizeObserver(containerRef, {
    onResize: resizeCallback,
    debounceMs: 50,
    enabled,
  })
}
