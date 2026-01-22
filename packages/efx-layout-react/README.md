# @efx/layout-react

React components for CSS Grid-based dashboard layouts.

## Installation

```bash
npm install @efx/layout-react
# or
pnpm add @efx/layout-react
```

## Peer Dependencies

- `react` ^18.0.0 || ^19.0.0

## Components

### EfxLayout

CSS Grid-based layout component using template areas.

```tsx
import { EfxLayout, LayoutItem } from '@efx/layout-react'

function Dashboard() {
  return (
    <EfxLayout
      template={{
        areas: `
          "header header"
          "sidebar main"
          "footer footer"
        `,
        columns: ['200px', '1fr'],
        rows: ['60px', '1fr', '40px'],
        gap: 16,
      }}
      fillViewport
      viewportOffset={70}
    >
      <LayoutItem area="header">Header</LayoutItem>
      <LayoutItem area="sidebar">Sidebar</LayoutItem>
      <LayoutItem area="main">Main Content</LayoutItem>
      <LayoutItem area="footer">Footer</LayoutItem>
    </EfxLayout>
  )
}
```

### EfxGrid

Simple auto-layout grid with equal columns.

```tsx
import { EfxGrid } from '@efx/layout-react'

function CardGrid() {
  return (
    <EfxGrid columns={3} gap={16} fillHeight>
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </EfxGrid>
  )
}
```

### EfxResponsiveLayout

Responsive layout that switches templates based on viewport.

```tsx
import { EfxResponsiveLayout, LayoutItem } from '@efx/layout-react'

function ResponsiveDashboard() {
  return (
    <EfxResponsiveLayout
      templates={{
        mobile: {
          areas: '"header" "main" "sidebar" "footer"',
          columns: ['1fr'],
          rows: ['60px', '1fr', '200px', '40px'],
        },
        desktop: {
          areas: '"header header" "sidebar main" "footer footer"',
          columns: ['200px', '1fr'],
          rows: ['60px', '1fr', '40px'],
        },
      }}
      fillViewport
    >
      <LayoutItem area="header">Header</LayoutItem>
      <LayoutItem area="sidebar">Sidebar</LayoutItem>
      <LayoutItem area="main">Main</LayoutItem>
      <LayoutItem area="footer">Footer</LayoutItem>
    </EfxResponsiveLayout>
  )
}
```

## Props

### EfxLayout

| Prop | Type | Description |
|------|------|-------------|
| `template` | `LayoutTemplate` | Layout configuration |
| `children` | `ReactNode` | Child elements |
| `className` | `string` | Additional CSS class |
| `style` | `CSSProperties` | Additional inline styles |
| `fillViewport` | `boolean` | Fill remaining viewport height |
| `viewportOffset` | `number \| string` | Offset from viewport (e.g., header height) |

### LayoutItem

| Prop | Type | Description |
|------|------|-------------|
| `area` | `string` | Grid area name |
| `children` | `ReactNode` | Child elements |
| `className` | `string` | Additional CSS class |
| `style` | `CSSProperties` | Additional inline styles |

### EfxGrid

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `number \| { sm?, md?, lg? }` | Number of columns |
| `gap` | `number \| string` | Gap between cells |
| `rowHeight` | `number \| string` | Height of each row |
| `fillHeight` | `boolean` | Fill available height |
| `className` | `string` | Additional CSS class |

## Hooks

### useBreakpoint

Returns current breakpoint: `'mobile'` | `'tablet'` | `'desktop'`

```tsx
import { useBreakpoint } from '@efx/layout-react'

function MyComponent() {
  const breakpoint = useBreakpoint()
  return <div>Current: {breakpoint}</div>
}
```

### useMediaQuery

Low-level hook for media query matching.

```tsx
import { useMediaQuery } from '@efx/layout-react'

const isWide = useMediaQuery('(min-width: 1200px)')
```

## Presets

Re-exported from `@efx/layout-core`:

```tsx
import { LAYOUT_PRESETS, RESPONSIVE_LAYOUTS } from '@efx/layout-react'

// Use pre-defined layouts
<EfxLayout template={LAYOUT_PRESETS.analytics}>
  ...
</EfxLayout>
```

## Related Packages

- **@efx/layout-core** - Framework-agnostic types and utilities

## License

MIT
