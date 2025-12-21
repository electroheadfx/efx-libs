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

export const Route = createFileRoute('/examples/operations')({
  component: OperationsPage,
});

const layouts: LayoutOption[] = [
  { id: 'live', name: 'Live Monitor', description: 'Real-time operations' },
  { id: 'daily', name: 'Daily Review', description: 'Daily productivity' },
  { id: 'alerts', name: 'Alerts Center', description: 'Anomaly detection' },
];

const layoutTemplates: Record<string, ResponsiveTemplates> = {
  live: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "throughput throughput status status status"
        "throughput throughput status status status"
        "performance performance pie pie controls"
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
        "throughput"
        "status"
        "performance"
        "pie"
        "controls"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '220px', 'auto'],
      gap: 12,
    },
  },
  daily: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "productivity productivity allocation allocation allocation"
        "productivity productivity allocation allocation allocation"
        "tasks tasks tasks scatter controls"
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
        "productivity"
        "allocation"
        "tasks"
        "scatter"
        "controls"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '250px', 'auto'],
      gap: 12,
    },
  },
  alerts: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "patterns patterns bars bars bars"
        "patterns patterns bars bars bars"
        "anomaly anomaly pie stats stats"
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
        "patterns"
        "bars"
        "anomaly"
        "pie"
        "stats"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '220px', 'auto'],
      gap: 12,
    },
  },
};

function OperationsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  
  const handleRandomize = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const currentLayout = layouts[currentIndex];
  const data = generateDashboardData(seed);
  const scatterData = generateScatterData(40, 0.55, seed + 15);
  const template = layoutTemplates[currentLayout.id];
  
  // Operations-specific data
  const throughputData = generateSalesData(12, seed + 5);
  const productivityData = generateSalesData(12, seed + 6);

  const kpis = {
    throughput: { value: `${((seed % 500) + 2500).toLocaleString()}/h`, change: '+12%', changeType: 'positive' as const },
    activeJobs: { value: `${(seed % 50) + 120}`, change: '+8%', changeType: 'positive' as const },
    errorRate: { value: `${((seed % 20) / 100).toFixed(2)}%`, change: '-0.1%', changeType: 'positive' as const },
    efficiency: { value: `${((seed % 15) + 85)}%`, change: '+3%', changeType: 'positive' as const },
  };

  const liveStats = [
    { label: 'Queue Depth', value: `${(seed % 100) + 50}` },
    { label: 'Avg. Latency', value: `${(seed % 50) + 30}ms` },
    { label: 'Workers Active', value: `${(seed % 20) + 40}` },
    { label: 'Success Rate', value: `${((seed % 5) / 100 + 99).toFixed(1)}%` },
  ];

  const alertStats = [
    { label: 'Critical', value: `${seed % 3}` },
    { label: 'Warning', value: `${(seed % 8) + 2}` },
    { label: 'Info', value: `${(seed % 15) + 10}` },
    { label: 'Resolved (24h)', value: `${(seed % 50) + 30}` },
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
            <KPICard title="Throughput" value={kpis.throughput.value} change={kpis.throughput.change} changeType={kpis.throughput.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi2">
            <KPICard title="Active Jobs" value={kpis.activeJobs.value} change={kpis.activeJobs.change} changeType={kpis.activeJobs.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard title="Error Rate" value={kpis.errorRate.value} change={kpis.errorRate.change} changeType={kpis.errorRate.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi4">
            <KPICard title="Efficiency" value={kpis.efficiency.value} change={kpis.efficiency.change} changeType={kpis.efficiency.changeType} />
          </LayoutItem>

          {/* Live layout */}
          {currentLayout.id === 'live' && (
            <>
              <LayoutItem area="throughput" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Throughput Monitor</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={throughputData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="status" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">System Status</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Load Distribution</h3>
                    <div className="h-[calc(100%-28px)]">
                      <LineChart data={productivityData} smooth />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="performance" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Performance Distribution</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="pie" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Resources</h3>
                <div className="h-[calc(100%-28px)]">
                  <PieChart data={data.marketShareData} donut />
                </div>
              </LayoutItem>
              <LayoutItem area="controls" className="flex flex-col gap-2">
                <StatsList data={liveStats} title="Live Stats" />
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {/* Daily layout */}
          {currentLayout.id === 'daily' && (
            <>
              <LayoutItem area="productivity" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Daily Productivity</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={productivityData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="allocation" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Resource Allocation</h3>
                    <div className="h-[calc(100%-28px)]">
                      <PieChart data={data.marketShareData} donut />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Task Types</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="tasks" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Task Completion</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} horizontal />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Time vs Output</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="controls" className="flex flex-col gap-2">
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {/* Alerts layout */}
          {currentLayout.id === 'alerts' && (
            <>
              <LayoutItem area="patterns" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Alert Patterns</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={throughputData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="bars" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Alert Categories</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Resolution Time</h3>
                    <div className="h-[calc(100%-28px)]">
                      <LineChart data={productivityData} smooth />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="anomaly" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Anomaly Detection</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="pie" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Severity</h3>
                <div className="h-[calc(100%-28px)]">
                  <PieChart data={data.marketShareData} donut />
                </div>
              </LayoutItem>
              <LayoutItem area="stats" className="flex flex-col gap-2">
                <StatsList data={alertStats} title="Alerts Summary" />
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
