'use client';

import type { ReactNode, CSSProperties } from 'react';

export interface LayoutTemplate {
  areas: string;
  columns?: string[];
  rows?: string[];
  gap?: number | string;
}

interface DashboardLayoutProps {
  template: LayoutTemplate;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

interface LayoutItemProps {
  area: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function DashboardLayout({ template, children, className = '', style }: DashboardLayoutProps) {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateAreas: template.areas,
    gridTemplateColumns: template.columns?.join(' ') ?? '1fr',
    gridTemplateRows: template.rows?.join(' ') ?? 'auto',
    gap: typeof template.gap === 'number' ? `${template.gap}px` : template.gap ?? '16px',
    ...style,
  };

  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
}

export function LayoutItem({ area, children, className = '', style }: LayoutItemProps) {
  return (
    <div style={{ gridArea: area, ...style }} className={className}>
      {children}
    </div>
  );
}
