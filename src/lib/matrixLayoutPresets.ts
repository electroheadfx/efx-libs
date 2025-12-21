// Matrix layout presets for common patterns
import type { SimpleMatrixLayout } from '@/types/matrixLayout.types';

export const MATRIX_PRESETS = {
  // Dashboard: header + main content + sidebar
  dashboard: {
    sections: ['header', 'main', 'sidebar', 'footer'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | header  |
          | main    |
          | sidebar |
          | footer  |
        `,
      },
      desktop: {
        template: `
          | header  | header  | header  |
          | main    | main    | sidebar |
          | main    | main    | sidebar |
          | footer  | footer  | footer  |
        `,
      },
    },
  },

  // Comparison: side-by-side charts
  comparison: {
    sections: ['title', 'left', 'right', 'summary'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | title   |
          | left    |
          | right   |
          | summary |
        `,
      },
      desktop: {
        template: `
          | title   | title   |
          | left    | right   |
          | left    | right   |
          | summary | summary |
        `,
      },
    },
  },

  // Grid: 2x2 equal cells
  grid2x2: {
    sections: ['tl', 'tr', 'bl', 'br'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | tl |
          | tr |
          | bl |
          | br |
        `,
      },
      desktop: {
        template: `
          | tl | tr |
          | bl | br |
        `,
      },
    },
  },

  // Grid: 3x3 equal cells
  grid3x3: {
    sections: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    breakpoints: {
      mobile: {
        maxWidth: 600,
        template: `
          | a |
          | b |
          | c |
          | d |
          | e |
          | f |
          | g |
          | h |
          | i |
        `,
      },
      tablet: {
        minWidth: 601,
        maxWidth: 1024,
        template: `
          | a | b | c |
          | d | e | f |
          | g | h | i |
        `,
      },
      desktop: {
        template: `
          | a | b | c |
          | d | e | f |
          | g | h | i |
        `,
      },
    },
  },
} satisfies Record<string, SimpleMatrixLayout>;

export type MatrixPresetName = keyof typeof MATRIX_PRESETS;
