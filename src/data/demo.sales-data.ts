// Sales time-series data for charts
export interface SalesDataPoint {
  date: string;
  value: number;
  category?: string;
  [key: string]: string | number | undefined;
}

export const salesData: SalesDataPoint[] = [
  { date: '2024-01', value: 120000 },
  { date: '2024-02', value: 135000 },
  { date: '2024-03', value: 145000 },
  { date: '2024-04', value: 138000 },
  { date: '2024-05', value: 162000 },
  { date: '2024-06', value: 175000 },
  { date: '2024-07', value: 168000 },
  { date: '2024-08', value: 185000 },
  { date: '2024-09', value: 192000 },
  { date: '2024-10', value: 205000 },
  { date: '2024-11', value: 218000 },
  { date: '2024-12', value: 245000 },
];

export const multiSeriesSalesData = [
  { date: '2024-01', value: 120000, category: 'Electronics' },
  { date: '2024-02', value: 135000, category: 'Electronics' },
  { date: '2024-03', value: 145000, category: 'Electronics' },
  { date: '2024-04', value: 138000, category: 'Electronics' },
  { date: '2024-05', value: 162000, category: 'Electronics' },
  { date: '2024-06', value: 175000, category: 'Electronics' },
  { date: '2024-01', value: 80000, category: 'Clothing' },
  { date: '2024-02', value: 95000, category: 'Clothing' },
  { date: '2024-03', value: 88000, category: 'Clothing' },
  { date: '2024-04', value: 92000, category: 'Clothing' },
  { date: '2024-05', value: 105000, category: 'Clothing' },
  { date: '2024-06', value: 115000, category: 'Clothing' },
];
