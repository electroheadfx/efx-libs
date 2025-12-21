// Sample data generator utilities with seeded randomization
import type { TimeSeriesDataPoint, CategoricalDataPoint, NumericalPairDataPoint } from '@/types/chart.types';

// Seeded random number generator (Mulberry32)
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Generate a random seed
export function randomSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

// Generate time series data (for LineChart)
export function generateSalesData(count: number, seed?: number): TimeSeriesDataPoint[] {
  const rng = mulberry32(seed ?? randomSeed());
  const data: TimeSeriesDataPoint[] = [];
  const baseValue = 100000 + rng() * 50000;
  
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    
    // Add trend and noise
    const trend = i * 5000;
    const seasonality = Math.sin(i * Math.PI / 6) * 15000;
    const noise = (rng() - 0.5) * 20000;
    const value = Math.round(baseValue + trend + seasonality + noise);
    
    data.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      value: Math.max(0, value),
    });
  }
  
  return data;
}

// Generate multi-series time series data
export function generateMultiSeriesSalesData(
  categories: string[],
  count: number,
  seed?: number
): TimeSeriesDataPoint[] {
  const rng = mulberry32(seed ?? randomSeed());
  const data: TimeSeriesDataPoint[] = [];
  
  const startDate = new Date('2024-01-01');
  
  for (const category of categories) {
    const baseValue = 50000 + rng() * 100000;
    
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + i);
      
      const trend = i * (2000 + rng() * 3000);
      const seasonality = Math.sin(i * Math.PI / 6) * 10000;
      const noise = (rng() - 0.5) * 15000;
      const value = Math.round(baseValue + trend + seasonality + noise);
      
      data.push({
        date: date.toISOString().slice(0, 7),
        value: Math.max(0, value),
        category,
      });
    }
  }
  
  return data;
}

// Generate categorical data (for BarChart, PieChart)
export function generateCategoryData(
  categories: string[],
  seed?: number
): CategoricalDataPoint[] {
  const rng = mulberry32(seed ?? randomSeed());
  
  return categories.map((category) => ({
    category,
    value: Math.round(50000 + rng() * 400000),
  }));
}

// Generate market share data (values sum to 100)
export function generateMarketShareData(
  categories: string[],
  seed?: number
): CategoricalDataPoint[] {
  const rng = mulberry32(seed ?? randomSeed());
  
  // Generate random weights
  const weights = categories.map(() => rng());
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  // Normalize to 100%
  let remaining = 100;
  const data: CategoricalDataPoint[] = [];
  
  for (let i = 0; i < categories.length; i++) {
    const value = i === categories.length - 1 
      ? remaining 
      : Math.round((weights[i] / totalWeight) * 100);
    remaining -= value;
    
    data.push({
      category: categories[i],
      value: Math.max(0, value),
    });
  }
  
  return data;
}

// Generate scatter data with correlation (for ScatterChart)
export function generateScatterData(
  count: number,
  correlation = 0.7,
  seed?: number
): NumericalPairDataPoint[] {
  const rng = mulberry32(seed ?? randomSeed());
  const data: NumericalPairDataPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const x = rng() * 100;
    const noise = (rng() - 0.5) * 50 * (1 - Math.abs(correlation));
    const y = x * correlation + (1 - correlation) * 50 + noise;
    
    data.push({
      x: Math.round(x * 10) / 10,
      y: Math.round(Math.max(0, Math.min(100, y)) * 10) / 10,
    });
  }
  
  return data;
}

// Generate grouped scatter data
export function generateGroupedScatterData(
  groups: { name: string; count: number; correlation: number }[],
  seed?: number
): (NumericalPairDataPoint & { group: string })[] {
  const rng = mulberry32(seed ?? randomSeed());
  const data: (NumericalPairDataPoint & { group: string })[] = [];
  
  for (const group of groups) {
    const groupSeed = Math.floor(rng() * 2147483647);
    const points = generateScatterData(group.count, group.correlation, groupSeed);
    
    for (const point of points) {
      data.push({ ...point, group: group.name });
    }
  }
  
  return data;
}

// Generate distribution data (for ViolinChart)
export function generateDistributionData(
  groupCount: number,
  pointsPerGroup: number,
  seed?: number
): number[][] {
  const rng = mulberry32(seed ?? randomSeed());
  const data: number[][] = [];
  
  for (let g = 0; g < groupCount; g++) {
    const groupData: number[] = [];
    const mean = 30 + rng() * 50; // Random mean between 30-80
    const spread = 5 + rng() * 20; // Random spread
    
    for (let i = 0; i < pointsPerGroup; i++) {
      // Box-Muller transform for normal distribution
      const u1 = rng();
      const u2 = rng();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = mean + z * spread;
      
      groupData.push(Math.round(Math.max(0, Math.min(100, value)) * 10) / 10);
    }
    
    data.push(groupData);
  }
  
  return data;
}

// Generate KPI data
export interface KPIDataPoint {
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export function generateKPIData(seed?: number): KPIDataPoint {
  const rng = mulberry32(seed ?? randomSeed());
  
  const value = Math.round(rng() * 10000000) / 100; // Up to $100K
  const changeValue = (rng() - 0.5) * 30; // -15% to +15%
  
  const formatValue = (v: number): string => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`;
    return `$${v.toFixed(0)}`;
  };
  
  return {
    value: formatValue(value),
    change: `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}%`,
    changeType: changeValue > 0 ? 'positive' : changeValue < 0 ? 'negative' : 'neutral',
  };
}

// Generate complete dashboard data
export interface DashboardData {
  kpis: {
    revenue: KPIDataPoint;
    users: KPIDataPoint;
    orders: KPIDataPoint;
    conversion: KPIDataPoint;
  };
  salesData: TimeSeriesDataPoint[];
  categoryData: CategoricalDataPoint[];
  marketShareData: CategoricalDataPoint[];
  scatterData: NumericalPairDataPoint[];
  distributionData: number[][];
  distributionCategories: string[];
  stats: Array<{ label: string; value: string; change: string }>;
}

export function generateDashboardData(seed?: number): DashboardData {
  const baseSeed = seed ?? randomSeed();
  const rng = mulberry32(baseSeed);
  
  // Generate KPIs with different seeds
  const kpis = {
    revenue: generateKPIData(Math.floor(rng() * 2147483647)),
    users: {
      ...generateKPIData(Math.floor(rng() * 2147483647)),
      value: `${Math.round(rng() * 100000).toLocaleString()}`,
    },
    orders: {
      ...generateKPIData(Math.floor(rng() * 2147483647)),
      value: `${Math.round(rng() * 10000).toLocaleString()}`,
    },
    conversion: {
      ...generateKPIData(Math.floor(rng() * 2147483647)),
      value: `${(rng() * 10).toFixed(1)}%`,
    },
  };
  
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'];
  const distributionCategories = ['Group A', 'Group B', 'Group C', 'Group D'];
  
  return {
    kpis,
    salesData: generateSalesData(12, Math.floor(rng() * 2147483647)),
    categoryData: generateCategoryData(categories, Math.floor(rng() * 2147483647)),
    marketShareData: generateMarketShareData(
      ['Product A', 'Product B', 'Product C', 'Product D', 'Others'],
      Math.floor(rng() * 2147483647)
    ),
    scatterData: generateScatterData(50, 0.7, Math.floor(rng() * 2147483647)),
    distributionData: generateDistributionData(4, 20, Math.floor(rng() * 2147483647)),
    distributionCategories,
    stats: [
      { label: 'Active Sessions', value: Math.round(rng() * 5000).toLocaleString(), change: `+${(rng() * 10).toFixed(0)}%` },
      { label: 'Bounce Rate', value: `${(20 + rng() * 30).toFixed(1)}%`, change: `-${(rng() * 5).toFixed(0)}%` },
      { label: 'Avg. Session', value: `${Math.floor(rng() * 10)}m ${Math.floor(rng() * 60)}s`, change: `+${Math.floor(rng() * 30)}s` },
      { label: 'Page Views', value: `${(rng() * 100).toFixed(1)}K`, change: `+${(rng() * 15).toFixed(0)}%` },
    ],
  };
}
