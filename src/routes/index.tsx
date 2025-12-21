import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { DashboardLayout, LayoutItem } from '@/components/layout/DashboardLayout';
import { LineChart, BarChart, PieChart } from '@/components/charts';
import { KPICard } from '@/components/ui/KPICard';
import { StatsList } from '@/components/ui/StatsList';
import { ThemeControlPanel } from '@/components/controls/ThemeControlPanel';
import { registerCustomSeries } from '@/lib/customSeries';
import { salesData, categoryData, marketShareData } from '@/data';

// Server function to fetch dashboard data
const fetchDashboardData = createServerFn({ method: 'GET' }).handler(async () => {
  // Simulate server-side data fetching
  // In production, this would fetch from database/API
  return {
    kpis: {
      revenue: { value: '$1.2M', change: '+12.5%', changeType: 'positive' as const },
      users: { value: '45,231', change: '+8.3%', changeType: 'positive' as const },
      orders: { value: '1,234', change: '-3.2%', changeType: 'negative' as const },
      conversion: { value: '3.2%', change: '+0.5%', changeType: 'positive' as const },
    },
    salesData,
    categoryData,
    marketShareData,
    stats: [
      { label: 'Active Sessions', value: '1,234', change: '+5%' },
      { label: 'Bounce Rate', value: '32.5%', change: '-2%' },
      { label: 'Avg. Session', value: '4m 32s', change: '+12s' },
      { label: 'Page Views', value: '45.2K', change: '+8%' },
    ],
    lastUpdated: new Date().toISOString(),
  };
});

// Route with SSR loader
export const Route = createFileRoute('/')({
  loader: async () => {
    // Register custom series on server (for SSR)
    registerCustomSeries();
    
    // Fetch data on server
    const data = await fetchDashboardData();
    return data;
  },
  component: Dashboard,
});

function Dashboard() {
  const data = Route.useLoaderData();

  // Dashboard layout template
  const dashboardTemplate = {
    areas: `
      "kpi1 kpi2 kpi3 kpi4"
      "main main main sidebar"
      "main main main sidebar"
      "chart1 chart1 chart2 chart2"
    `,
    columns: ['1fr', '1fr', '1fr', '300px'],
    rows: ['100px', '1fr', '1fr', '350px'],
    gap: 16,
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen p-4 bg-rs-body">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-rs-heading">Analytics Dashboard</h1>
          <p className="text-rs-secondary text-sm">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </header>

        <DashboardLayout template={dashboardTemplate} className="min-h-[calc(100vh-120px)]">
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
              title="Users"
              value={data.kpis.users.value}
              change={data.kpis.users.change}
              changeType={data.kpis.users.changeType}
            />
          </LayoutItem>
          <LayoutItem area="kpi3">
            <KPICard
              title="Orders"
              value={data.kpis.orders.value}
              change={data.kpis.orders.change}
              changeType={data.kpis.orders.changeType}
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

          {/* Main chart area */}
          <LayoutItem area="main" className="bg-rs-card rounded-lg shadow-rs-md p-4">
            <h2 className="text-lg font-semibold text-rs-heading mb-4">Revenue Trend</h2>
            <div className="h-[calc(100%-40px)]">
              <LineChart
                data={data.salesData}
                xField="date"
                yField="value"
                smooth
                areaStyle
              />
            </div>
          </LayoutItem>

          {/* Sidebar with theme control and stats */}
          <LayoutItem area="sidebar" className="flex flex-col gap-4">
            <ThemeControlPanel />
            <StatsList data={data.stats} title="Quick Stats" className="flex-1" />
          </LayoutItem>

          {/* Bottom charts */}
          <LayoutItem area="chart1" className="bg-rs-card rounded-lg shadow-rs-md p-4">
            <h2 className="text-lg font-semibold text-rs-heading mb-4">Sales by Category</h2>
            <div className="h-[calc(100%-40px)]">
              <BarChart data={data.categoryData} />
            </div>
          </LayoutItem>

          <LayoutItem area="chart2" className="bg-rs-card rounded-lg shadow-rs-md p-4">
            <h2 className="text-lg font-semibold text-rs-heading mb-4">Market Share</h2>
            <div className="h-[calc(100%-40px)]">
              <PieChart data={data.marketShareData} donut />
            </div>
          </LayoutItem>
        </DashboardLayout>
      </div>
    </ThemeProvider>
  );
}
