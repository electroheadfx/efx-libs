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

export const Route = createFileRoute('/examples/marketing')({
  component: MarketingPage,
});

const layouts: LayoutOption[] = [
  { id: 'campaigns', name: 'Campaigns', description: 'Campaign performance' },
  { id: 'audience', name: 'Audience', description: 'Demographics & growth' },
  { id: 'funnel', name: 'Funnel', description: 'Conversion analysis' },
];

const layoutTemplates: Record<string, ResponsiveTemplates> = {
  campaigns: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "engagement engagement channels channels channels"
        "engagement engagement channels channels channels"
        "roi roi roi pie stats"
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
        "engagement"
        "channels"
        "roi"
        "pie"
        "stats"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '220px', 'auto'],
      gap: 12,
    },
  },
  audience: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "growth growth demographics demographics demographics"
        "growth growth demographics demographics demographics"
        "segments segments scatter scatter controls"
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
        "growth"
        "demographics"
        "segments"
        "scatter"
        "controls"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '250px', 'auto'],
      gap: 12,
    },
  },
  funnel: {
    desktop: {
      areas: `
        "nav kpi1 kpi2 kpi3 kpi4"
        "conversion conversion stages stages stages"
        "conversion conversion stages stages stages"
        "sources sources sources scatter controls"
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
        "conversion"
        "stages"
        "sources"
        "scatter"
        "controls"
      `,
      columns: ['1fr'],
      rows: ['60px', '80px', '80px', '80px', '80px', '280px', '250px', '250px', '250px', 'auto'],
      gap: 12,
    },
  },
};

function MarketingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seed, setSeed] = useState(() => randomSeed());
  
  const handleRandomize = useCallback(() => {
    setSeed(randomSeed());
  }, []);

  const currentLayout = layouts[currentIndex];
  const data = generateDashboardData(seed);
  const scatterData = generateScatterData(35, 0.65, seed + 12);
  const template = layoutTemplates[currentLayout.id];
  
  // Marketing-specific data
  const engagementData = generateSalesData(12, seed + 3);
  const growthData = generateSalesData(12, seed + 4);

  const kpis = {
    impressions: { value: `${((seed % 500) + 800).toLocaleString()}K`, change: '+18%', changeType: 'positive' as const },
    clicks: { value: `${((seed % 50) + 45).toLocaleString()}K`, change: '+12%', changeType: 'positive' as const },
    ctr: { value: `${(((seed % 30) + 20) / 10).toFixed(1)}%`, change: '+0.5%', changeType: 'positive' as const },
    cost: { value: `$${((seed % 20) + 15).toLocaleString()}K`, change: '-5%', changeType: 'positive' as const },
  };

  const campaignStats = [
    { label: 'Active Campaigns', value: `${(seed % 12) + 5}` },
    { label: 'Avg. CPC', value: `$${((seed % 150) + 50) / 100}` },
    { label: 'Conversions', value: `${(seed % 2000) + 1500}` },
    { label: 'ROI', value: `${((seed % 150) + 180)}%` },
  ];

  const audienceStats = [
    { label: 'Total Users', value: `${((seed % 100) + 150).toLocaleString()}K` },
    { label: 'New Users', value: `${((seed % 30) + 20).toLocaleString()}K` },
    { label: 'Return Rate', value: `${((seed % 20) + 35)}%` },
    { label: 'Avg. Session', value: `${(seed % 5) + 3}m` },
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
            <KPICard title="Impressions" value={kpis.impressions.value} change={kpis.impressions.change} changeType={kpis.impressions.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi2">
            <KPICard title="Clicks" value={kpis.clicks.value} change={kpis.clicks.change} changeType={kpis.clicks.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard title="CTR" value={kpis.ctr.value} change={kpis.ctr.change} changeType={kpis.ctr.changeType} />
          </LayoutItem>
          <LayoutItem area="kpi4">
            <KPICard title="Spend" value={kpis.cost.value} change={kpis.cost.change} changeType={kpis.cost.changeType} />
          </LayoutItem>

          {/* Campaigns layout */}
          {currentLayout.id === 'campaigns' && (
            <>
              <LayoutItem area="engagement" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Engagement Over Time</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={engagementData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="channels" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Channel Performance</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="roi" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">ROI by Campaign</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="pie" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Budget</h3>
                <div className="h-[calc(100%-28px)]">
                  <PieChart data={data.marketShareData} donut />
                </div>
              </LayoutItem>
              <LayoutItem area="stats" className="flex flex-col gap-2">
                <StatsList data={campaignStats} title="Campaign Stats" />
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {/* Audience layout */}
          {currentLayout.id === 'audience' && (
            <>
              <LayoutItem area="growth" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Audience Growth</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={growthData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="demographics" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Demographics</h3>
                    <div className="h-[calc(100%-28px)]">
                      <PieChart data={data.marketShareData} donut />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Age Groups</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="segments" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">User Segments</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} horizontal />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Engagement vs Spend</h3>
                <div className="h-[calc(100%-28px)]">
                  <ScatterChart data={scatterData} />
                </div>
              </LayoutItem>
              <LayoutItem area="controls" className="flex flex-col gap-2">
                <StatsList data={audienceStats} title="Audience" />
                <ThemeControlPanel />
                <RandomDataButton onClick={handleRandomize} />
              </LayoutItem>
            </>
          )}

          {/* Funnel layout */}
          {currentLayout.id === 'funnel' && (
            <>
              <LayoutItem area="conversion" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-lg font-semibold text-rs-heading mb-2">Conversion Trend</h3>
                <div className="h-[calc(100%-32px)]">
                  <LineChart data={engagementData} smooth areaStyle />
                </div>
              </LayoutItem>
              <LayoutItem area="stages" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <div className="flex gap-4 h-full">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Funnel Stages</h3>
                    <div className="h-[calc(100%-28px)]">
                      <BarChart data={data.categoryData} horizontal />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-rs-heading mb-2">Drop-off</h3>
                    <div className="h-[calc(100%-28px)]">
                      <PieChart data={data.marketShareData} donut />
                    </div>
                  </div>
                </div>
              </LayoutItem>
              <LayoutItem area="sources" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Traffic Sources</h3>
                <div className="h-[calc(100%-28px)]">
                  <BarChart data={data.categoryData} />
                </div>
              </LayoutItem>
              <LayoutItem area="scatter" className="bg-rs-card rounded-lg shadow-rs-md p-4">
                <h3 className="text-sm font-semibold text-rs-heading mb-2">Quality vs Volume</h3>
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
        </ResponsiveDashboardLayout>
      </div>
    </ThemeProvider>
  );
}
