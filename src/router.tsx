import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Adapter between dynamic `import()` and React Router's `lazy` route property.
 *
 * React Router expects the `lazy` function to resolve to `{ Component }`, but
 * a dynamic import resolves to a module object whose default export is the
 * component. This helper does that translation so each route only needs:
 *
 *   lazy: () => lazy(() => import('./pages/SomePage'))
 *
 * Without it every route would need the same boilerplate:
 *   lazy: () => import('./pages/SomePage').then(m => ({ Component: m.default }))
 */
const lazy = (importFn: () => Promise<{ default: React.ComponentType }>) =>
  importFn().then((m) => ({ Component: m.default }));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/reference/careers" replace /> },
      { path: 'reference/careers', lazy: () => lazy(() => import('./pages/reference/CareersPage')) },
      { path: 'reference/careers/:id', lazy: () => lazy(() => import('./pages/reference/CareerDetailPage')) },
      { path: 'reference/skills', lazy: () => lazy(() => import('./pages/reference/SkillsPage')) },
      { path: 'reference/talents', lazy: () => lazy(() => import('./pages/reference/TalentsPage')) },
      { path: 'reference/trappings', lazy: () => lazy(() => import('./pages/reference/TrappingsPage')) },
      { path: 'reference/spells', lazy: () => lazy(() => import('./pages/reference/SpellsPage')) },
      { path: 'reference/prayers', lazy: () => lazy(() => import('./pages/reference/PrayersPage')) },
      { path: 'reference/qualities', lazy: () => lazy(() => import('./pages/reference/QualitiesPage')) },
      { path: 'reference/mutations', lazy: () => lazy(() => import('./pages/reference/MutationsPage')) },
      { path: 'characters', lazy: () => lazy(() => import('./pages/characters/CharactersPage')) },
      { path: 'characters/new', lazy: () => lazy(() => import('./pages/characters/CharacterCreationPage')) },
      { path: 'characters/:id', lazy: () => lazy(() => import('./pages/characters/CharacterSheetPage')) },
      { path: 'dice', lazy: () => lazy(() => import('./pages/DicePage')) },
      { path: 'settings', lazy: () => lazy(() => import('./pages/SettingsPage')) },
      ...(import.meta.env.DEV
        ? [{ path: 'theme-preview', lazy: () => lazy(() => import('./pages/ThemePreviewPage')) }]
        : []),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
