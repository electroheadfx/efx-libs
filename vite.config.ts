import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    // ECharts is a large library, adjust warning limit
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only split for client bundles (not SSR)
          if (id.includes('node_modules')) {
            // ECharts and related
            if (id.includes('echarts')) {
              if (id.includes('@echarts-x')) {
                return 'echarts-custom'
              }
              return 'vendor-echarts'
            }
            // RSuite
            if (id.includes('rsuite')) {
              return 'vendor-rsuite'
            }
          }
        },
      },
    },
  },
})

export default config
