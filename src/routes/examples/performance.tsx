import { createFileRoute } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LayoutNavigator, ThemeControlPanel, RandomDataButton } from '@/components/controls';
import type { LayoutOption } from '@/components/controls';
import { LineChart, BarChart, PieChart, ScatterChart } from '@/components/charts';
import { ResponsiveDashboardLayout, LayoutItem } from '@/components/layout/ResponsiveDashboardLayout';
import type { ResponsiveTemplates } from '@/components/layout/ResponsiveDashboardLayout';
import { KPICard } from '@/components/ui';
import { generateDashboardData, generateScatterData, randomSeed, generateSalesData } from '@/lib/sampleDataGenerator';

export const Route = createFileRoute('/examples/performance')({
  component: PerformancePage,
});

const layouts: LayoutOption[] = [
  { id: 'realtime', name: 'Real-time', description: 'Live system metrics' },
  { id: 'historical', name: 'Historical', description: 'Performance over time' },
  { id: 'comparison', name: 'Comparison', description: 'Compare metrics' },
];

const layoutTemplates: Record<string, ResponsiveTemplates> = {
  realtime: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "main main main resources resources"
        "main main main resources resources"
        "scatter scatter load load load"
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
        "resources"
        "scatter"
        "load"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '250px'],
      gap: 12,
    },
  },
  historical: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "trends trends trends pie pie"
        "trends trends trends pie pie"
        "multi multi multi multi multi"
      `,
      columns: ['180px', '1fr', '1fr', '1fr', '1fr'],
      rows: ['80px', '1fr', '1fr', '250px'],
      gap: 12,
    },
    mobile: {
      areas: `
        "nav"
        "kpi1"
        "kpi2"
        "kpi3"
        "kpi4"
        "trends"
        "pie"
        "multi"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '300px', '250px', '280px'],
      gap: 12,
    },
  },
  comparison: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "line1 line1 line2 line2 line2"
        "line1 line1 line2 line2 line2"
        "bar1 bar1 bar2 bar2 controls"
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
        "line1"
        "line2"
        "bar1"
        "bar2"
        "controls"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '260px', '260px', '220px', '220px', 'auto'],
      gap: 12,
    },
  },
};

function PerformancePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  
  const handleRandomize = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const currentLayout = layouts[currentIndex];
  const data = generateDashboardData(seed);
  const scatterData = generateScatterData(30, 0.6, seed + 5);
  const template = layoutTemplates[currentLayout.id];
  
  // Additional data series for comparisons
  const cpuData = generateSalesData(12, seed + 1);
  const memoryData = generateSalesData(12, seed + 2);

  const kpis = {
    cpu: { value: `${(seed % 40) + 35}%`, change: '+12%', changeType: 'positive' as const },
    memory: { value: `${(seed % 30) + 45}%`, change: '+8%', changeType: 'positive' as const },
    latency: { value: `${(seed % 50) + 50}ms`, change: '-5%', changeType: 'positive' as const },
    uptime: { value: '99.97%', change: '+0.02%', changeType: 'positive' as const },
  };

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
            <KPICard title="CPU Usage" value={kpis.cpu.value} change={kpis.cpu.change} changeType={kpis.cpu.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi2">
            <KPICard title="Memory" value={kpis.memory.value} change={kpis.memory.change} changeType={kpis.memory.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard title="Latency" value={kpis.latency.value} change={kpis.latency.change} changeType={kpis.latency.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi4">
            <KPICard title="Uptime" value={kpis.uptime.value} change={kpis.uptime.change} changeType={kpis.uptime.changeType} />
          </LayoutItem>

          {/* Real-time layout */}
          {currentLayout.id === 'realtime' && (
            <>
              <LayoutItem area="main" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">System Load</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={data.salesData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="resources" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Resource Allocation</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Request Distribution</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="load" className="flex flex-col gap-3">
                <div className="bg-rs-card rounded-lg shadow-rs-md p-3 flex-1">
                  <h3 className="text-sm font-semibold text-rs-heading mb-2">Load Balance</h3>
                  <div className="h-[calc(100%-28px)]">
                    <PieChart data={data.marketShareData} donut />
                  </div>
                </div>
                <div className="flex gap-2">
                  <ThemeControlPanel />
                  <RandomDataButton onClick={handleRandomize} />
                </div>
              </LayoutItem>
            </>
          )}

          {/* Historical layout */}
          {currentLayout.id === 'historical' && (
            <>
              <LayoutItem area="trends" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Performance Trends</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={data.salesData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="pie" className="flex flex-col gap-3">
                <div className="bg-rs-card rounded-lg shadow-rs-md p-3 flex-1">
                  <h3 className="text-sm font-semibold text-rs-heading mb-2">Error Distribution</h3>
                  <div className="h-[calc(100%-28px)]">
                    <PieChart data={data.marketShareData} donut />
                  </div>
                </div>
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
              <LayoutItem area="multi" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">CPU History</h3>
                    <div className="h-[calc(100%-28px)]">
                      <LineChart data={cpuData} smooth />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Memory History</h3>
                    <div className="h-[calc(100%-28px)]">
                      <LineChart data={memoryData} smooth />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Latency Correlation</h3>
                    <div className="h-[calc(100%-28px)]">
                      <ScatterChart data={scatterData} />
                    </div>
                  </div>
                </div>
              </LayoutItem>
            </>
          )}

          {/* Comparison layout */}
          {currentLayout.id === 'comparison' && (
            <>
              <LayoutItem area="line1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Server A - Performance</h3>
                <div className="h-[calc(100%-28px)]">
                  <LineChart data={cpuData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="line2" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Server B - Performance</h3>
                <div className="h-[calc(100%-28px)]">
                  <LineChart data={memoryData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="bar1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">A - Resources</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="bar2" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">B - Resources</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData.map(d => ({ ...d, value: d.value * 0.85 }))} />
                </div>
              </LayoutItem>
              <LayoutItem area="controls" className="flex flex-col gap-2">
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
