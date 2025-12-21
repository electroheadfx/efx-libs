// Matrix layout builder types for simplified mediaDefinitions

export interface SimpleMatrixLayout {
  sections: string[];
  breakpoints: Record<string, BreakpointConfig>;
  gap?: number;
}

export interface BreakpointConfig {
  minWidth?: number;
  maxWidth?: number;
  template: string;
}

// Parsed template cell
export interface TemplateCell {
  sectionId: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

// Matrix coordinate: single index or [start, end] range
export type MatrixCoord = number | [number, number];

// Section coordinate mapping: [colCoord, rowCoord]
export type SectionCoordValue = [MatrixCoord, MatrixCoord];

// ECharts-compatible media definition
export interface MediaDefinition {
  query?: { minWidth?: number; maxWidth?: number };
  matrix: {
    x: { data: null[] };
    y: { data: null[] };
  };
  sectionCoordMap: Record<string, SectionCoordValue>;
}

// Matrix chart section
export interface MatrixSection {
  id: string;
  option: import('echarts').EChartsOption;
}

// Matrix chart props
export interface MatrixChartProps {
  sections: MatrixSection[];
  mediaDefinitions: MediaDefinition[];
  className?: string;
  style?: React.CSSProperties;
  onChartReady?: (instance: unknown) => void;
}
