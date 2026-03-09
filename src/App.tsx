import { useState } from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
} from '@tanstack/react-router'
import { TeamDirectory } from './pages/TeamDirectory'
import { ComponentsShowcase } from './pages/ComponentsShowcase'
import './App.css'

type Theme = 'arcadiaLight' | 'arcadiaDark' | 'basisLight' | 'basisDark' | 'Knapsack'

function RootLayout() {
  const [theme, setTheme] = useState<Theme>('arcadiaLight')

  return (
    <div
      data-collections-theme={theme}
      style={{ backgroundColor: 'var(--background-page)', minHeight: '100vh' }}
    >
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '0.75rem 2rem',
        borderBottom: '1px solid var(--color-neutral-300, #e5e7eb)',
        backgroundColor: 'var(--background-page)',
      }}>
        <Link
          to="/"
          style={{ textDecoration: 'none', fontWeight: 500 }}
          activeProps={{ style: { textDecoration: 'none', fontWeight: 700 } }}
          activeOptions={{ exact: true }}
        >
          Team Directory
        </Link>
        <Link
          to="/components"
          style={{ textDecoration: 'none', fontWeight: 500 }}
          activeProps={{ style: { textDecoration: 'none', fontWeight: 700 } }}
        >
          Components
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="theme-select" style={{ fontWeight: 500, fontSize: '0.875rem' }}>Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            style={{ padding: '0.25rem 0.5rem', borderRadius: 4, border: '1px solid #ccc', backgroundColor: 'var(--color-background-primary)' }}
          >
            <option value="arcadiaLight">arcadiaLight</option>
            <option value="arcadiaDark">arcadiaDark</option>
            <option value="basisLight">basisLight</option>
            <option value="basisDark">basisDark</option>
            <option value="Knapsack">Knapsack</option>
          </select>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: TeamDirectory,
})

const componentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/components',
  component: ComponentsShowcase,
})

const routeTree = rootRoute.addChildren([indexRoute, componentsRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
