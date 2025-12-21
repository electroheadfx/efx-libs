'use client';

import type { ReactNode } from 'react';
import { useBreakpoint, type Breakpoint } from '@/hooks/useMediaQuery';
import { DashboardLayout, type LayoutTemplate } from './DashboardLayout';

interface ResponsiveDashboardLayoutProps {
  templates: Partial<Record<Breakpoint, LayoutTemplate>>;
  children: ReactNode;
  className?: string;
}

export function ResponsiveDashboardLayout({
  templates,
  children,
  className = '',
}: ResponsiveDashboardLayoutProps) {
  const breakpoint = useBreakpoint();

  // Find the appropriate template for current breakpoint
  const template = templates[breakpoint] ?? templates.desktop ?? templates.tablet ?? templates.mobile;

  if (!template) {
    console.warn('No template found for breakpoint:', breakpoint);
    return <div className={className}>{children}</div>;
  }

  return (
    <DashboardLayout template={template} className={className}>
      {children}
    </DashboardLayout>
  );
}
