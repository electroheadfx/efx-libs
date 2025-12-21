import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LayoutNavigator, ThemeControlPanel, RandomDataButton } from '@/components/controls';
import type { LayoutOption } from '@/components/controls';
import { LineChart, BarChart, PieChart, ScatterChart } from '@/components/charts';
import { ResponsiveDashboardLayout, LayoutItem } from '@/components/layout/ResponsiveDashboardLayout';
import type { ResponsiveTemplates } from '@/components/layout/ResponsiveDashboardLayout';
import { KPICard, StatsList } from '@/components/ui';
import { generateDashboardData, generateScatterData, randomSeed } from '@/lib/sampleDataGenerator';

export const Route = createFileRoute('/examples/sales-analytics')({
  component: SalesAnalyticsPage,
});

const layouts: LayoutOption[] = [
  { id: 'overview', name: 'Overview', description: 'Complete sales overview' },
  { id: 'detailed', name: 'Detailed Analysis', description: 'Deep dive analytics' },
  { id: 'executive', name: 'Executive Summary', description: 'High-level metrics' },
];

// Template configurations for each layout
const layoutTemplates: Record<string, ResponsiveTemplates> = {
  overview: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "main main main side side"
        "main main main side side"
        "chart1 chart1 chart2 chart2 chart2"
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
        "main"
        "side"
        "chart1"
        "chart2"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '300px', '200px', '250px', '250px'],
      gap: 12,
    },
  },
  detailed: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "main main scatter scatter scatter"
        "main main scatter scatter scatter"
        "bar bar pie stats stats"
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
        "main"
        "scatter"
        "bar"
        "pie"
        "stats"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '280px', '250px', '250px', '200px'],
      gap: 12,
    },
  },
  executive: {
    desktop: {
      areas: `
        "nav kpi1 kpi1 kpi2 kpi2"
        "nav kpi3 kpi3 kpi4 kpi4"
        "main main main side side"
        "main main main side side"
        "chart1 chart1 chart1 chart1 chart1"
      `,
      columns: ['180px', '1fr', '1fr', '1fr', '1fr'],
      rows: ['70px', '70px', '1fr', '1fr', '200px'],
      gap: 12,
    },
    mobile: {
      areas: `
        "nav"
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "main"
        "side"
        "chart1"
      `,
      columns: ['1fr'],
      rows: ['60px', '90px', '90px', '90px', '90px', '300px', '200px', '250px'],
      gap: 12,
    },
  },
};

function SalesAnalyticsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  
  const handleRandomize = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const currentLayout = layouts[currentIndex];
  const data = generateDashboardData(seed);
  const scatterData = generateScatterData(40, 0.75, seed + 10);
  const template = layoutTemplates[currentLayout.id];

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
            <KPICard
              title="Revenue"
              value={data.kpis.revenue.value}
              change={data.kpis.revenue.change}
              changeType={data.kpis.revenue.changeType}
            />
          </LayoutItem>
          <LayoutItem area="kpi2">
            <KPICard
              title="Orders"
              value={data.kpis.orders.value}
              change={data.kpis.orders.change}
              changeType={data.kpis.orders.changeType}
            />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard
              title="Customers"
              value={data.kpis.users.value}
              change={data.kpis.users.change}
              changeType={data.kpis.users.changeType}
            />
          </LayoutItem>
          <LayoutItem area="kpi4">
            <KPICard
              title="Conversion"
              value={data.kpis.conversion.value}
              change={data.kpis.conversion.change}
              changeType={data.kpis.conversion.changeType}
            />
          </LayoutItem>

          {/* Main Line Chart - Always present */}
          <LayoutItem area="main" className="bg-rs-card rounded-lg shadow-rs-md p-4">
            <h3 className="text-lg font-semibold text-rs-heading mb-2">Revenue Trend</h3>
            <div className="h-[calc(100%-32px)]">
              <LineChart data={data.salesData} smooth areaStyle />
            </div>
          </LayoutItem>

          {/* Layout-specific content */}
          {currentLayout.id === 'overview' && (
            <>
              <LayoutItem area="side" className="flex flex-col gap-3">
                <div className="bg-rs-card rounded-lg shadow-rs-md p-3 flex-1">
                  <h3 className="text-sm font-semibold text-rs-heading mb-2">Market Share</h3>
                  <div className="h-[calc(100%-28px)]">
                    <PieChart data={data.marketShareData} donut />
                  </div>
                </div>
                <div className="flex-1">
                  <ThemeControlPanel />
                </div>
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
              <LayoutItem area="chart1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Sales by Category</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="chart2" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Price vs Volume Correlation</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
            </>
          )}

          {currentLayout.id === 'detailed' && (
            <>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Price vs Volume Analysis</h3>
                <div className="h-[calc(100%-32px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="bar" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Category Breakdown</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} horizontal />
                </div>
              </LayoutItem>
              <LayoutItem area="pie" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Distribution</h3>
                <div className="h-[calc(100%-28px)]">
                  <PieChart data={data.marketShareData} donut />
                </div>
              </LayoutItem>
              <LayoutItem area="stats" className="flex flex-col gap-2">
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {currentLayout.id === 'executive' && (
            <>
              <LayoutItem area="side" className="flex flex-col gap-3">
                <StatsList data={data.stats} title="Key Metrics" className="flex-1" />
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
              <LayoutItem area="chart1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Categories</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Market Share</h3>
                    <div className="h-[calc(100%-28px)]">
                      <PieChart data={data.marketShareData} donut />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Correlation</h3>
                    <div className="h-[calc(100%-28px)]">
                      <ScatterChart data={scatterData} />
                    </div>
                  </div>
                </div>
              </LayoutItem>
            </>
          )}
        </ResponsiveDashboardLayout>
      </div>
    </ThemeProvider>
  );
}
