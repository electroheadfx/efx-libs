import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import { ThemeProvider } from '../providers/ThemeProvider'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

// Blocking script to detect theme before React hydrates (prevents flash)
const themeScript = `
(function() {
  try {
    // Check localStorage first for user preference
    var savedTheme = localStorage.getItem('app-theme');
    var theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'high-contrast' ? 'dark' : theme;
  } catch (e) {}
})();
`

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Blocking script to set theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
