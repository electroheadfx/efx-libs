/**
 * EfxChart Component
 *
 * Individual chart section within an EfxChartsLayout.
 * This is a configuration component - it doesn't render anything directly.
 */

import type { ReactNode } from 'react'
import type { EfxChartProps } from './types'

/**
 * EfxChart - Defines a chart section within EfxChartsLayout
 *
 * This component doesn't render anything directly. Instead, it serves as
 * a declarative way to configure chart sections. The parent EfxChartsLayout
 * collects these props and builds a single ECharts option.
 *
 * @example
 * ```tsx
 * <EfxChartsLayout template={FINANCE_LAYOUT}>
 *   <EfxChart
 *     section="main"
 *     title="Revenue Trend"
 *     type="line"
 *     data={timeSeriesData}
 *     xAxis={{ type: 'time' }}
 *     padding="50,10"
 *   />
 * </EfxChartsLayout>
 * ```
 */
export function EfxChart<TSection extends string = string>(
  _props: EfxChartProps<TSection>
): ReactNode {
  // This component doesn't render anything
  // It's used as a configuration object by EfxChartsLayout
  return null
}

/**
 * Type guard to check if a child is an EfxChart
 */
export function isEfxChart(
  child: unknown
): child is React.ReactElement<EfxChartProps<string>> {
  if (!child || typeof child !== 'object') return false
  const element = child as React.ReactElement
  return element.type === EfxChart
}

/**
 * Extract EfxChart props from children
 */
export function extractChartProps(
  children: ReactNode
): EfxChartProps<string>[] {
  const props: EfxChartProps<string>[] = []

  const childArray = Array.isArray(children) ? children : [children]

  for (const child of childArray) {
    if (isEfxChart(child)) {
      props.push(child.props)
    }
  }

  return props
}

export default EfxChart
