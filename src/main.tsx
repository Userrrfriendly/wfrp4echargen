import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme/theme';
import { useUiStore } from './stores/uiStore';
import { router } from './router';

const queryClient = new QueryClient();

function ThemeWrapper({ children }: { children: ReactNode }) {
  const themeMode = useUiStore((s) => s.themeMode);
  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeWrapper>
        <RouterProvider router={router} />
      </ThemeWrapper>
    </QueryClientProvider>
  </StrictMode>,
);
