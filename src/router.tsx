import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
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
    // All child routes use lazy:, so on a hard-refresh React Router v7 must
    // resolve the matched route module before it can render. HydrateFallback
    // fills that window — without it the page is blank and the console warns.
    HydrateFallback: () => (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    ),
    children: [
      { index: true, element: <Navigate to="/reference/careers" replace /> },
      {
        path: 'reference/careers',
        handle: { section: 'Careers' },
        lazy: () => lazy(() => import('./pages/reference/CareersPage')),
      },
      {
        path: 'reference/careers/:id',
        handle: { section: 'Careers' },
        lazy: () => lazy(() => import('./pages/reference/CareerDetailPage')),
      },
      {
        path: 'reference/skills',
        handle: { section: 'Skills' },
        lazy: () => lazy(() => import('./pages/reference/SkillsPage')),
      },
      {
        path: 'reference/skills/:id',
        handle: { section: 'Skills' },
        lazy: () => lazy(() => import('./pages/reference/SkillDetailPage')),
      },
      {
        path: 'reference/talents',
        handle: { section: 'Talents' },
        lazy: () => lazy(() => import('./pages/reference/TalentsPage')),
      },
      {
        path: 'reference/talents/:id',
        handle: { section: 'Talents' },
        lazy: () => lazy(() => import('./pages/reference/TalentDetailPage')),
      },
      {
        path: 'reference/trappings',
        handle: { section: 'Trappings' },
        lazy: () => lazy(() => import('./pages/reference/TrappingsPage')),
      },
      {
        path: 'reference/trappings/:id',
        handle: { section: 'Trappings' },
        lazy: () => lazy(() => import('./pages/reference/TrappingDetailPage')),
      },
      {
        path: 'reference/spells',
        handle: { section: 'Spells' },
        lazy: () => lazy(() => import('./pages/reference/SpellsPage')),
      },
      {
        path: 'reference/spells/:id',
        handle: { section: 'Spells' },
        lazy: () => lazy(() => import('./pages/reference/SpellDetailPage')),
      },
      {
        path: 'reference/prayers',
        handle: { section: 'Prayers' },
        lazy: () => lazy(() => import('./pages/reference/PrayersPage')),
      },
      {
        path: 'reference/prayers/:id',
        handle: { section: 'Prayers' },
        lazy: () => lazy(() => import('./pages/reference/PrayerDetailPage')),
      },
      {
        path: 'reference/qualities',
        handle: { section: 'Qualities & Flaws' },
        lazy: () => lazy(() => import('./pages/reference/QualitiesPage')),
      },
      {
        path: 'reference/qualities/:id',
        handle: { section: 'Qualities & Flaws' },
        lazy: () => lazy(() => import('./pages/reference/QualityDetailPage')),
      },
      {
        path: 'reference/mutations',
        handle: { section: 'Mutations' },
        lazy: () => lazy(() => import('./pages/reference/MutationsPage')),
      },
      {
        path: 'reference/mutations/:id',
        handle: { section: 'Mutations' },
        lazy: () => lazy(() => import('./pages/reference/MutationDetailPage')),
      },
      {
        path: 'characters',
        handle: { section: 'Characters' },
        lazy: () => lazy(() => import('./pages/characters/CharactersPage')),
      },
      {
        path: 'characters/new',
        handle: { section: 'New Character' },
        lazy: () =>
          lazy(() => import('./pages/characters/CharacterCreationPage')),
      },
      {
        path: 'characters/:id',
        handle: { section: 'Characters' },
        lazy: () => lazy(() => import('./pages/characters/CharacterSheetPage')),
      },
      {
        path: 'dice',
        handle: { section: 'Dice Roller' },
        lazy: () => lazy(() => import('./pages/DicePage')),
      },
      {
        path: 'settings',
        handle: { section: 'Settings' },
        lazy: () => lazy(() => import('./pages/SettingsPage')),
      },
      ...(import.meta.env.DEV
        ? [
            {
              path: 'theme-preview',
              lazy: () => lazy(() => import('./pages/ThemePreviewPage')),
            },
          ]
        : []),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
