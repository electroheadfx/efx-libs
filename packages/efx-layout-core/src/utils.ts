/**
 * EfxLayout Utilities
 *
 * Framework-agnostic utility functions for layout processing.
 */

import type { LayoutPadding } from './types'

/**
 * Normalize a padding value to a CSS string
 */
export function normalizePadding(value: number | string | undefined): string {
  if (value === undefined) return '0'
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Build a CSS padding string from a LayoutPadding object
 */
export function buildPaddingStyle(
  padding: LayoutPadding | number | string | undefined
): string {
  if (padding === undefined) return '0'

  if (typeof padding === 'number') {
    return `${padding}px`
  }

  if (typeof padding === 'string') {
    return padding
  }

  // Object form: { top, right, bottom, left }
  const top = normalizePadding(padding.top)
  const right = normalizePadding(padding.right)
  const bottom = normalizePadding(padding.bottom)
  const left = normalizePadding(padding.left)

  return `${top} ${right} ${bottom} ${left}`
}

/**
 * Normalize a gap value to a CSS string
 */
export function normalizeGap(gap: number | string | undefined): string {
  if (gap === undefined) return '16px'
  return typeof gap === 'number' ? `${gap}px` : gap
}

/**
 * Normalize a size value (for columns, rows, etc.)
 */
export function normalizeSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}
