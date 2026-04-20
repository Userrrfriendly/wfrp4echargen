import { createTheme } from '@mui/material/styles';
import type React from 'react';
import diabloFont from '../assets/fonts/diablo.ttf';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    diablo: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    diablo?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    diablo: true;
  }
}

export const DIABLO_FONT_FAMILY = '"Diablo", serif';
export const RALEWAY_FONT_FAMILY = '"Raleway", sans-serif';

const fontFaceOverride = `
  @font-face {
    font-family: 'Diablo';
    src: url(${diabloFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const sharedTypography = {
  fontFamily: RALEWAY_FONT_FAMILY,
  h1: { fontFamily: DIABLO_FONT_FAMILY },
  h2: { fontFamily: DIABLO_FONT_FAMILY },
  h3: { fontFamily: DIABLO_FONT_FAMILY },
  h4: { fontFamily: DIABLO_FONT_FAMILY, fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  diablo: { fontFamily: DIABLO_FONT_FAMILY, fontWeight: 'normal' as const },
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#c8960c' },
    secondary: { main: '#8b2020' },
    background: { default: '#0f0f0f', paper: '#1a1a1a' },
  },
  typography: sharedTypography,
  components: {
    MuiCssBaseline: { styleOverrides: fontFaceOverride },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141414',
          borderRight: '1px solid rgba(200, 150, 12, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          borderBottom: '1px solid rgba(200, 150, 12, 0.2)',
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7a6010' },
    secondary: { main: '#8b2020' },
    background: { default: '#f5f0e8', paper: '#faf7f0' },
  },
  typography: sharedTypography,
  components: {
    MuiCssBaseline: { styleOverrides: fontFaceOverride },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ede7d9',
          borderRight: '1px solid rgba(139, 105, 20, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ede7d9',
          borderBottom: '1px solid rgba(139, 105, 20, 0.25)',
          color: '#3d2e0a',
        },
      },
    },
  },
});
