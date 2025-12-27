import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BarChart3,
  Grid3X3,
  Layers,
  LayoutGrid,
} from 'lucide-react'
import { useAppTheme } from '@/providers/ThemeProvider'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

interface DemoCard {
  to: string
  title: string
  subtitle: string
  description: string
  icon: typeof BarChart3
}

interface TechStack {
  name: string
  url: string
  logo: string
}

const techStack: TechStack[] = [
  {
    name: 'TanStack Start',
    url: 'https://tanstack.com/start',
    logo: 'https://tanstack.com/favicon.ico',
  },
  {
    name: 'TanStack Router',
    url: 'https://tanstack.com/router',
    logo: 'https://tanstack.com/favicon.ico',
  },
  {
    name: 'Apache ECharts',
    url: 'https://echarts.apache.org/',
    logo: 'https://echarts.apache.org/en/images/favicon.png',
  },
  {
    name: 'RSuite',
    url: 'https://rsuitejs.com/',
    logo: 'https://user-images.githubusercontent.com/1203827/47638792-92414e00-db9a-11e8-89c2-f8f430a23cd3.png',
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com/',
    logo: 'https://tailwindcss.com/favicons/favicon-32x32.png',
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    logo: 'https://www.typescriptlang.org/favicon-32x32.png',
  },
  {
    name: 'Vite',
    url: 'https://vitejs.dev/',
    logo: 'https://vitejs.dev/logo.svg',
  },
]

const demoPages: DemoCard[] = [
  {
    to: '/basic-echarts',
    title: 'Basic ECharts',
    subtitle: '12 Chart Types',
    description:
      'Line, Bar, Pie, Scatter, Radar, and more chart types with direct implementation.',
    icon: Grid3X3,
  },
  {
    to: '/layout-echarts',
    title: 'Layout Systems',
    subtitle: '7 Layout Demos',
    description:
      'DashboardLayout, DashboardGrid, MatrixChart with SSR-safe lazy loading.',
    icon: LayoutGrid,
  },
  {
    to: '/dashboard',
    title: 'Dashboard Hub',
    subtitle: '5 Domain Dashboards',
    description:
      'Sales, Performance, Financial, Marketing, and Operations dashboards.',
    icon: Layers,
  },
]

// Qoder Logo SVG component
function QoderLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="url(#qoder-gradient)" />
      <path
        d="M16 8C11.582 8 8 11.582 8 16C8 20.418 11.582 24 16 24C18.208 24 20.212 23.107 21.66 21.66L23.074 23.074C21.252 24.896 18.752 26 16 26C10.477 26 6 21.523 6 16C6 10.477 10.477 6 16 6C21.523 6 26 10.477 26 16C26 17.38 25.724 18.698 25.224 19.9L23.372 18.808C23.778 17.942 24 16.998 24 16C24 11.582 20.418 8 16 8Z"
        fill="white"
      />
      <circle cx="20" cy="20" r="3" fill="white" />
      <defs>
        <linearGradient
          id="qoder-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Theme-aware style configurations
const themeStyles = {
  light: {
    // Page background
    pageBg: 'bg-gradient-to-b from-gray-50 via-white to-gray-100',
    // Hero section
    heroWrapper: 'relative overflow-hidden',
    heroBg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    heroGlow1: 'bg-gradient-to-r from-emerald-200/40 to-teal-200/40',
    heroGlow2: 'bg-gradient-to-r from-cyan-200/30 to-blue-200/30',
    heroGlow3: 'bg-gradient-to-r from-green-200/30 to-emerald-200/30',
    // Text
    titleText: 'text-gray-900',
    titleAccent: 'text-emerald-600',
    subtitleText: 'text-gray-600',
    statValue: 'text-emerald-600',
    statLabel: 'text-gray-500',
    // Badge
    badgeBg: 'bg-white/80 border-gray-200',
    badgeText: 'text-gray-700',
    badgeIcon: 'text-emerald-500',
    // Cards
    cardBg: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg',
    cardPreviewBg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    cardPreviewPattern: 'opacity-10',
    cardIconBg:
      'bg-gray-100 border-gray-200 group-hover:border-emerald-400 group-hover:bg-emerald-50',
    cardIcon: 'text-gray-400 group-hover:text-emerald-500',
    cardTitle: 'text-gray-900',
    cardDesc: 'text-gray-500',
    cardLink: 'text-emerald-600',
    // Footer
    footerBg: 'bg-white border-gray-200',
    techBadgeBg:
      'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100',
    techBadgeText: 'text-gray-700',
    qoderBg: 'bg-gray-50 border-gray-200 hover:border-emerald-400',
    footerText: 'text-gray-500',
  },
  dark: {
    // Page background
    pageBg: 'bg-[#0a0a0a]',
    // Hero section
    heroWrapper: 'relative overflow-hidden',
    heroBg: 'bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]',
    heroGlow1:
      'bg-[radial-gradient(ellipse_80%_80%_at_20%_20%,_#22c55e50_0%,_transparent_60%)]',
    heroGlow2:
      'bg-[radial-gradient(ellipse_70%_70%_at_80%_30%,_#14b8a650_0%,_transparent_60%)]',
    heroGlow3:
      'bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,_#3b82f640_0%,_transparent_70%)]',
    // Text
    titleText: 'text-white',
    titleAccent: 'text-emerald-400',
    subtitleText: 'text-zinc-400',
    statValue: 'text-emerald-400',
    statLabel: 'text-zinc-500',
    // Badge
    badgeBg: 'bg-zinc-800/50 border-zinc-700',
    badgeText: 'text-zinc-300',
    badgeIcon: 'text-emerald-400',
    // Cards
    cardBg:
      'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900',
    cardPreviewBg: 'bg-gradient-to-br from-zinc-800/50 to-zinc-900',
    cardPreviewPattern: 'opacity-20',
    cardIconBg:
      'bg-zinc-800/80 border-zinc-700 group-hover:border-emerald-500/50 group-hover:bg-zinc-800',
    cardIcon: 'text-zinc-400 group-hover:text-emerald-400',
    cardTitle: 'text-white',
    cardDesc: 'text-zinc-400',
    cardLink: 'text-emerald-400',
    // Footer
    footerBg: 'bg-zinc-900/50 border-zinc-800',
    techBadgeBg:
      'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800',
    techBadgeText: 'text-zinc-300',
    qoderBg:
      'bg-zinc-900 border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800',
    footerText: 'text-zinc-500',
  },
  'high-contrast': {
    // Page background
    pageBg: 'bg-black',
    // Hero section
    heroWrapper: 'relative overflow-hidden',
    heroBg: 'bg-black',
    heroGlow1:
      'bg-[radial-gradient(ellipse_80%_80%_at_20%_20%,_#22c55e70_0%,_transparent_50%)]',
    heroGlow2:
      'bg-[radial-gradient(ellipse_70%_70%_at_80%_30%,_#14b8a670_0%,_transparent_50%)]',
    heroGlow3:
      'bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,_#3b82f660_0%,_transparent_60%)]',
    // Text
    titleText: 'text-white',
    titleAccent: 'text-emerald-300',
    subtitleText: 'text-gray-200',
    statValue: 'text-emerald-300',
    statLabel: 'text-gray-300',
    // Badge
    badgeBg: 'bg-black border-white',
    badgeText: 'text-white',
    badgeIcon: 'text-emerald-300',
    // Cards
    cardBg: 'bg-black border-white hover:border-emerald-400',
    cardPreviewBg: 'bg-zinc-950',
    cardPreviewPattern: 'opacity-30',
    cardIconBg: 'bg-black border-white group-hover:border-emerald-400',
    cardIcon: 'text-white group-hover:text-emerald-300',
    cardTitle: 'text-white',
    cardDesc: 'text-gray-200',
    cardLink: 'text-emerald-300',
    // Footer
    footerBg: 'bg-black border-white',
    techBadgeBg: 'bg-black border-white hover:border-emerald-400',
    techBadgeText: 'text-white',
    qoderBg: 'bg-black border-white hover:border-emerald-400',
    footerText: 'text-gray-300',
  },
}

function DemoPageCard({
  demo,
  styles,
}: {
  demo: DemoCard
  styles: (typeof themeStyles)['dark']
}) {
  const Icon = demo.icon

  return (
    <Link to={demo.to} className="block group">
      <div
        className={`h-full border rounded-2xl overflow-hidden transition-all duration-300 ${styles.cardBg}`}
      >
        {/* Visual Preview Area */}
        <div
          className={`h-48 flex items-center justify-center relative overflow-hidden ${styles.cardPreviewBg}`}
        >
          {/* Decorative grid pattern */}
          <div
            className={`absolute inset-0 ${styles.cardPreviewPattern}`}
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Icon */}
          <div
            className={`relative p-6 rounded-2xl border transition-all ${styles.cardIconBg}`}
          >
            <Icon
              size={48}
              strokeWidth={1}
              className={`transition-colors ${styles.cardIcon}`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3
            className={`text-2xl font-bold mb-1 tracking-tight ${styles.cardTitle}`}
          >
            {demo.title}
          </h3>

          <p className={`text-sm mb-4 ${styles.cardDesc}`}>
            {demo.description}
          </p>

          {/* CTA Link */}
          <div
            className={`flex items-center gap-1 font-medium group-hover:gap-2 transition-all ${styles.cardLink}`}
          >
            Explore
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

function LandingPage() {
  const { theme } = useAppTheme()
  const styles = themeStyles[theme]

  return (
    <div
      className={`min-h-[calc(100vh-72px)] transition-colors duration-300 ${styles.pageBg}`}
    >
      {/* Hero Section with Glow Effects */}
      <div className={styles.heroWrapper}>
        {/* Background with gradient */}
        <div className={`absolute inset-0 ${styles.heroBg}`} />

        {/* Glow orbs */}
        <div
          className={`absolute -top-20 -left-20 w-150 h-150 blur-[100px] ${styles.heroGlow1}`}
        />
        <div
          className={`absolute -top-10 -right-20 w-125 h-125 blur-[100px] ${styles.heroGlow2}`}
        />
        <div
          className={`absolute -bottom-32 left-1/2 -translate-x-1/2 w-200 h-100 blur-[120px] ${styles.heroGlow3}`}
        />

        {/* Content */}
        <div className="relative py-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-8 ${styles.badgeBg}`}
            >
              <BarChart3 size={16} className={styles.badgeIcon} />
              <span className={`text-sm ${styles.badgeText}`}>
                TanStack Start + ECharts
              </span>
            </div>

            {/* Title with accent */}
            <h1
              className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight ${styles.titleText}`}
            >
              ECharts <span className={styles.titleAccent}>Multi-Chart</span>{' '}
              Demo
            </h1>

            <p
              className={`text-xl max-w-3xl mx-auto mb-12 leading-relaxed ${styles.subtitleText}`}
            >
              A comprehensive data visualization platform showcasing advanced
              ECharts compositions, responsive layout systems, and
              production-ready dashboard patterns.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12">
              <div className="text-center">
                <div className={`text-4xl font-bold ${styles.statValue}`}>
                  12+
                </div>
                <div className={`text-sm ${styles.statLabel}`}>Chart Types</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${styles.statValue}`}>
                  7
                </div>
                <div className={`text-sm ${styles.statLabel}`}>
                  Layout Systems
                </div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${styles.statValue}`}>
                  5
                </div>
                <div className={`text-sm ${styles.statLabel}`}>Dashboards</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${styles.statValue}`}>
                  3
                </div>
                <div className={`text-sm ${styles.statLabel}`}>Themes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Cards Section */}
      <div className="px-6 pb-24 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${styles.titleText}`}>
              Explore <span className={styles.titleAccent}>Your Way</span>
            </h2>
            <p className={styles.subtitleText}>
              Choose a demo to see different aspects of ECharts implementation
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoPages.map((demo) => (
              <DemoPageCard key={demo.to} demo={demo} styles={styles} />
            ))}
          </div>
        </div>
      </div>

      {/* Built With Section */}
      <div className={`border-t py-16 px-6 ${styles.footerBg}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className={`text-xl font-semibold mb-2 ${styles.titleText}`}>
              Built With
            </h3>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${styles.techBadgeBg} ${styles.techBadgeText}`}
              >
                <img
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  className="w-5 h-5"
                />
                {tech.name}
              </a>
            ))}
          </div>

          {/* Qoder Attribution */}
          <div className="text-center">
            <a
              href="https://qoder.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-6 py-3 border rounded-xl font-medium transition-all group ${styles.qoderBg} ${styles.titleText}`}
            >
              <QoderLogo className="w-7 h-7" />
              <span>
                Built with <span className={styles.titleAccent}>Qoder</span>
              </span>
              <ArrowUpRight
                size={16}
                className={`${styles.subtitleText} group-hover:text-emerald-400 transition-colors`}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-8 text-center border-t ${styles.footerBg}`}>
        <p className={`text-sm ${styles.footerText}`}>
          Open source demo • Theme switching • Seeded random data
        </p>
      </div>
    </div>
  )
}
