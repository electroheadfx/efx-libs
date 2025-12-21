'use client';

import { Children, type ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number | string;
  rowHeight?: number | string;
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 2,
  gap = 16,
  rowHeight = 'auto',
  className = '',
}: DashboardGridProps) {
  // Build responsive grid classes
  let gridCols: string;
  if (typeof columns === 'number') {
    gridCols = `repeat(${columns}, minmax(0, 1fr))`;
  } else {
    // Use CSS custom properties for responsive columns
    gridCols = `repeat(var(--grid-cols, ${columns.lg ?? columns.md ?? columns.sm ?? 2}), minmax(0, 1fr))`;
  }

  const responsiveStyles =
    typeof columns === 'object'
      ? {
          '--grid-cols-sm': columns.sm ?? 1,
          '--grid-cols-md': columns.md ?? 2,
          '--grid-cols-lg': columns.lg ?? 3,
        }
      : {};

  return (
    <div
      className={`grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: typeof gap === 'number' ? `${gap}px` : gap,
        gridAutoRows: typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
        ...responsiveStyles,
      } as React.CSSProperties}
    >
      {Children.map(children, (child) => (
        <div className="min-h-50">{child}</div>
      ))}
    </div>
  );
}
