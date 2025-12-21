// Correlation/scatter data
export interface CorrelationDataPoint {
  x: number;
  y: number;
  category?: string;
}

// Generate scatter data with correlation
function generateCorrelatedData(n: number, correlation: number): CorrelationDataPoint[] {
  const data: CorrelationDataPoint[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    const noise = (Math.random() - 0.5) * 50 * (1 - Math.abs(correlation));
    const y = x * correlation + (1 - correlation) * 50 + noise;
    data.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
  }
  return data;
}

export const correlationData = generateCorrelatedData(50, 0.7);

export const multiGroupScatterData: CorrelationDataPoint[] = [
  // Group 1: Positive correlation
  ...generateCorrelatedData(20, 0.8).map((d) => ({ ...d, category: 'High Performers' })),
  // Group 2: Lower correlation
  ...generateCorrelatedData(20, 0.4).map((d) => ({ ...d, category: 'Average' })),
  // Group 3: Negative correlation
  ...generateCorrelatedData(15, -0.3).map((d) => ({ ...d, category: 'Outliers' })),
];
