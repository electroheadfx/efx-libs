import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LayoutNavigator, ThemeControlPanel, RandomDataButton } from '@/components/controls';
import type { LayoutOption } from '@/components/controls';
import { LineChart, BarChart, PieChart, ScatterChart } from '@/components/charts';
import { ResponsiveDashboardLayout, LayoutItem } from '@/components/layout/ResponsiveDashboardLayout';
import type { ResponsiveTemplates } from '@/components/layout/ResponsiveDashboardLayout';
import { KPICard, StatsList } from '@/components/ui';
import { generateDashboardData, generateScatterData, randomSeed, generateSalesData } from '@/lib/sampleDataGenerator';

export const Route = createFileRoute('/examples/financial')({
  component: FinancialPage,
});

const layouts: LayoutOption[] = [
  { id: 'quarterly', name: 'Quarterly Report', description: 'Q4 financial overview' },
  { id: 'trends', name: 'Trend Analysis', description: 'Financial trends' },
  { id: 'summary', name: 'Summary View', description: 'Executive summary' },
];

const layoutTemplates: Record<string, ResponsiveTemplates> = {
  quarterly: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "revenue revenue expenses expenses expenses"
        "revenue revenue expenses expenses expenses"
        "allocation allocation scatter scatter scatter"
      `,
      columns: ['180px', '1fr', '1fr', '1fr', '1fr'],
      rows: ['80px', '1fr', '1fr', '280px'],
      gap: 12,
    },
    mobile: {
      areas: `
        "nav"
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "revenue"
        "expenses"
        "allocation"
        "scatter"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '280px', '250px', '250px'],
      gap: 12,
    },
  },
  trends: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "cumulative cumulative cumulative scatter scatter"
        "cumulative cumulative cumulative scatter scatter"
        "bar1 bar1 bar2 bar2 stats"
      `,
      columns: ['180px', '1fr', '1fr', '1fr', '1fr'],
      rows: ['80px', '1fr', '1fr', '280px'],
      gap: 12,
    },
    mobile: {
      areas: `
        "nav"
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "cumulative"
        "scatter"
        "bar1"
        "bar2"
        "stats"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '280px', '220px', '220px', 'auto'],
      gap: 12,
    },
  },
  summary: {
    desktop: {
      areas: `
        "nav kpi1 kpi1 kpi2 kpi2"
        "nav kpi3 kpi3 kpi4 kpi4"
        "mixed mixed mixed donut donut"
        "mixed mixed mixed stats stats"
      `,
      columns: ['180px', '1fr', '1fr', '1fr', '1fr'],
      rows: ['70px', '70px', '1fr', '1fr'],
      gap: 12,
    },
    mobile: {
      areas: `
        "nav"
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "mixed"
        "donut"
        "stats"
      `,
      columns: ['1fr'],
      rows: ['60px', '90px', '90px', '90px', '90px', '300px', '250px', 'auto'],
      gap: 12,
    },
  },
};

function FinancialPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  
  const handleRandomize = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const currentLayout = layouts[currentIndex];
  const data = generateDashboardData(seed);
  const scatterData = generateScatterData(25, 0.85, seed + 7);
  const template = layoutTemplates[currentLayout.id];
  
  // Financial-specific data
  const revenueData = generateSalesData(12, seed + 1);

  const kpis = {
    revenue: { value: `$${((seed % 500) + 800).toLocaleString()}K`, change: '+15%', changeType: 'positive' as const },
    expenses: { value: `$${((seed % 300) + 400).toLocaleString()}K`, change: '+8%', changeType: 'negative' as const },
    profit: { value: `$${((seed % 200) + 300).toLocaleString()}K`, change: '+22%', changeType: 'positive' as const },
    margin: { value: `${((seed % 15) + 20)}%`, change: '+3%', changeType: 'positive' as const },
  };

  const financialStats = [
    { label: 'Net Income', value: `$${((seed % 150) + 200).toLocaleString()}K` },
    { label: 'EBITDA', value: `$${((seed % 180) + 280).toLocaleString()}K` },
    { label: 'Operating Cash Flow', value: `$${((seed % 120) + 150).toLocaleString()}K` },
    { label: 'ROE', value: `${((seed % 8) + 12)}%` },
    { label: 'Debt-to-Equity', value: `${((seed % 30) + 40) / 100}` },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-[calc(100vh-72px)] p-4 bg-rs-body overflow-auto">
        <ResponsiveDashboardLayout
          templates={template}
          fillViewport
          viewportOffset={{ desktop: '104px', mobile: '88px' }}
        >
          {/* Navigation */}
          <LayoutItem area="nav">
            <LayoutNavigator
              layouts={layouts}
              currentIndex={currentIndex}
              onNavigate={setCurrentIndex}
              compact
            />
          </LayoutItem>

          {/* KPI Cards */}
          <LayoutItem area="kpi1">
            <KPICard title="Revenue" value={kpis.revenue.value} change={kpis.revenue.change} changeType={kpis.revenue.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi2">
            <KPICard title="Expenses" value={kpis.expenses.value} change={kpis.expenses.change} changeType={kpis.expenses.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard title="Net Profit" value={kpis.profit.value} change={kpis.profit.change} changeType={kpis.profit.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi4">
            <KPICard title="Margin" value={kpis.margin.value} change={kpis.margin.change} changeType={kpis.margin.changeType} />
          </LayoutItem>

          {/* Quarterly layout */}
          {currentLayout.id === 'quarterly' && (
            <>
              <LayoutItem area="revenue" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Revenue Trend</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={revenueData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="expenses" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Expense Breakdown</h3>
                <div className="h-[calc(100%-32px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="allocation" className="flex flex-col gap-3">
                <div className="bg-rs-card rounded-lg shadow-rs-md p-3 flex-1">
                  <h3 className="text-sm font-semibold text-rs-heading mb-2">Budget Allocation</h3>
                  <div className="h-[calc(100%-28px)]">
                    <PieChart data={data.marketShareData} donut />
                  </div>
                </div>
                <div className="flex gap-2">
                  <ThemeControlPanel />
                  <RandomDataButton onClick={handleRandomize} />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Cost vs Returns</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
            </>
          )}

          {/* Trends layout */}
          {currentLayout.id === 'trends' && (
            <>
              <LayoutItem area="cumulative" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Cumulative Performance</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={revenueData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Risk vs Return</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="bar1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Revenue by Segment</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="bar2" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Expense Categories</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData.map(d => ({ ...d, value: d.value * 0.7 }))} horizontal />
                </div>
              </LayoutItem>
              <LayoutItem area="stats" className="flex flex-col gap-2">
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {/* Summary layout */}
          {currentLayout.id === 'summary' && (
            <>
              <LayoutItem area="mixed" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-[2]">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Revenue vs Expenses</h3>
                    <div className="h-[calc(100%-28px)]">
                      <LineChart data={revenueData} smooth areaStyle />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Categories</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="donut" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Budget Split</h3>
                <div className="h-[calc(100%-28px)]">
                  <PieChart data={data.marketShareData} donut />
                </div>
              </LayoutItem>
              <LayoutItem area="stats" className="flex flex-col gap-2">
                <StatsList data={financialStats} title="Financial Metrics" />
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}
        </ResponsiveDashboardLayout>
      </div>
    </ThemeProvider>
  );
}
