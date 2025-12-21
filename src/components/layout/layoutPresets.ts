// Dashboard layout presets
import type { LayoutTemplate } from './DashboardLayout';
import type { Breakpoint } from '@/hooks/useMediaQuery';

export const LAYOUT_PRESETS = {
  analytics: {
    areas: `
      "kpi1 kpi2 kpi3 kpi4"
      "main main main side"
      "main main main side"
    `,
    columns: ['1fr', '1fr', '1fr', '280px'],
    rows: ['100px', '1fr', '1fr'],
    gap: 16,
  },

  report: {
    areas: `
      "header header"
      "main sidebar"
      "footer footer"
    `,
    columns: ['1fr', '300px'],
    rows: ['80px', '1fr', '60px'],
    gap: 16,
  },

  comparison: {
    areas: `
      "title title"
      "left right"
      "summary summary"
    `,
    columns: ['1fr', '1fr'],
    rows: ['80px', '1fr', '120px'],
    gap: 16,
  },

  monitoring: {
    areas: `
      "kpi1 kpi2 kpi3 kpi4 kpi5"
      "chart1 chart1 chart2 chart2 chart2"
      "chart3 chart3 chart4 chart4 chart4"
    `,
    columns: ['1fr', '1fr', '1fr', '1fr', '1fr'],
    rows: ['100px', '1fr', '1fr'],
    gap: 16,
  },
} satisfies Record<string, LayoutTemplate>;

export type LayoutPresetName = keyof typeof LAYOUT_PRESETS;

// Responsive layout presets
export const RESPONSIVE_LAYOUTS = {
  analytics: {
    mobile: {
      areas: `
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "main"
        "side"
      `,
      columns: ['1fr'],
      rows: ['80px', '80px', '80px', '80px', '300px', '200px'],
      gap: 12,
    },
    tablet: {
      areas: `
        "kpi1 kpi2"
        "kpi3 kpi4"
        "main main"
        "side side"
      `,
      columns: ['1fr', '1fr'],
      rows: ['80px', '80px', '300px', '200px'],
      gap: 16,
    },
    desktop: LAYOUT_PRESETS.analytics,
  },
} satisfies Record<string, Partial<Record<Breakpoint, LayoutTemplate>>>;
