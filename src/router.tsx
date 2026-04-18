import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import CareersPage from './pages/reference/CareersPage';
import CareerDetailPage from './pages/reference/CareerDetailPage';
import SkillsPage from './pages/reference/SkillsPage';
import TalentsPage from './pages/reference/TalentsPage';
import TrappingsPage from './pages/reference/TrappingsPage';
import SpellsPage from './pages/reference/SpellsPage';
import PrayersPage from './pages/reference/PrayersPage';
import CharactersPage from './pages/characters/CharactersPage';
import CharacterCreationPage from './pages/characters/CharacterCreationPage';
import CharacterSheetPage from './pages/characters/CharacterSheetPage';
import DicePage from './pages/DicePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/reference/careers" replace /> },
      { path: 'reference/careers', element: <CareersPage /> },
      { path: 'reference/careers/:id', element: <CareerDetailPage /> },
      { path: 'reference/skills', element: <SkillsPage /> },
      { path: 'reference/talents', element: <TalentsPage /> },
      { path: 'reference/trappings', element: <TrappingsPage /> },
      { path: 'reference/spells', element: <SpellsPage /> },
      { path: 'reference/prayers', element: <PrayersPage /> },
      { path: 'characters', element: <CharactersPage /> },
      { path: 'characters/new', element: <CharacterCreationPage /> },
      { path: 'characters/:id', element: <CharacterSheetPage /> },
      { path: 'dice', element: <DicePage /> },
    ],
  },
]);
