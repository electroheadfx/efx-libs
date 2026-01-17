/**
 * Streaming Data Test Page
 *
 * Tests TanStack Router's defer() + <Await> pattern with staggered loading times.
 * Each section loads independently to verify streaming behavior before implementing
 * the full EfxCharts streaming feature.
 *
 * Expected behavior:
 * - Header loads after 500ms
 * - Sidebar loads after 1000ms
 * - Main loads after 1500ms
 * - Footer loads after 2000ms
 */

import { createFileRoute, defer, Await } from '@tanstack/react-router'
import { Panel, Loader } from 'rsuite'
import { createServerFn } from '@tanstack/react-start'

// ============================================================================
// Server Functions - Explicit declarations (factory pattern doesn't work with bundler)
// ============================================================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

interface SectionData {
  section: string
  message: string
  timestamp: string
  loadTime: number
}

/** Shared logic for generating section data */
async function generateSectionData(
  section: string,
  delayMs: number
): Promise<SectionData> {
  const start = Date.now()
  console.log(`[SERVER] Starting ${section} loader (${delayMs}ms delay)...`)
  await delay(delayMs)
  const result = {
    section,
    message: `${
      section.charAt(0).toUpperCase() + section.slice(1)
    } data loaded!`,
    timestamp: new Date().toISOString(),
    loadTime: Date.now() - start,
  }
  console.log(`[SERVER] ${section} loaded:`, result)
  return result
}

// Each server function must be declared explicitly for the bundler to track them
const getHeaderData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('header', 500)
)

const getSidebarData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('sidebar', 1000)
)

const getMainData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('main', 1500)
)

const getFooterData = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SectionData> => generateSectionData('footer', 2000)
)

// ============================================================================
// Route Definition
// ============================================================================

export const Route = createFileRoute('/streaming-data')({
  loader: async () => {
    // Each section is deferred independently - they stream in parallel
    // but resolve at different times based on their delays
    return {
      header: defer(getHeaderData()),
      sidebar: defer(getSidebarData()),
      main: defer(getMainData()),
      footer: defer(getFooterData()),
    }
  },

  component: StreamingDataDemo,
})

// ============================================================================
// Components
// ============================================================================

function StreamingDataDemo() {
  const loaderData = Route.useLoaderData()

  return (
    <div className="bg-rs-body p-6" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <Panel bordered shaded className="bg-rs-bg-card mb-6">
        <h1 className="text-xl font-bold mb-2">Streaming Data Test</h1>
        <p className="text-rs-secondary">
          Each section loads independently with staggered delays (500ms, 1000ms,
          1500ms, 2000ms). Watch them appear one by one!
        </p>
      </Panel>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Header Section - 500ms */}
        <SectionPanel title="Header (500ms)" promise={loaderData.header} />

        {/* Sidebar Section - 1000ms */}
        <SectionPanel title="Sidebar (1000ms)" promise={loaderData.sidebar} />

        {/* Main Section - 1500ms */}
        <SectionPanel title="Main (1500ms)" promise={loaderData.main} />

        {/* Footer Section - 2000ms */}
        <SectionPanel title="Footer (2000ms)" promise={loaderData.footer} />
      </div>
    </div>
  )
}

function SectionPanel({
  title,
  promise,
}: {
  title: string
  promise: Promise<SectionData>
}) {
  return (
    <Panel bordered shaded className="bg-rs-bg-card min-h-37.5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <Await promise={promise} fallback={<SectionLoading />}>
        {(data) => <SectionContent data={data} />}
      </Await>
    </Panel>
  )
}

function SectionLoading() {
  return (
    <div className="flex items-center justify-center h-20">
      <Loader content="Loading..." />
    </div>
  )
}

function SectionContent({ data }: { data: SectionData }) {
  // Debug: log what we receive
  console.log('SectionContent received:', data)

  if (!data) {
    return <p className="text-red-500">Error: No data received</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-green-500 font-medium">✓ {data.message}</p>
      <p className="text-rs-secondary text-sm">
        Load time: <strong>{data.loadTime}ms</strong>
      </p>
      <p className="text-rs-secondary text-xs font-mono">{data.timestamp}</p>
    </div>
  )
}
