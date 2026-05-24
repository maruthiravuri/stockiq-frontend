import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00D4AA', dark: '#00A882', light: '#33DCBB', contrastText: '#000' },
    secondary: { main: '#6C8EEF', dark: '#4A6EE0', light: '#8FADE6' },
    background: { default: '#0A0E1A', paper: '#111827' },
    success: { main: '#00D4AA' },
    error: { main: '#FF4D6A' },
    warning: { main: '#FFB84D' },
    text: { primary: '#E8EAF0', secondary: '#8B93A5' },
    divider: 'rgba(255,255,255,0.07)',
  },
  typography: {
    fontFamily: '"IBM Plex Mono", "JetBrains Mono", "Courier New", monospace',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.2rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
    caption: { fontSize: '0.72rem', letterSpacing: '0.04em' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.06)' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 6, fontFamily: 'inherit' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '8px 12px', fontSize: '0.8rem' },
        head: { color: '#8B93A5', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', backgroundColor: '#0D1321' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: 'inherit', fontSize: '0.72rem', height: 22, borderRadius: 4 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontFamily: 'inherit', fontSize: '0.8rem', minHeight: 40 },
      },
    },
  },
  shape: { borderRadius: 8 },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0066CC', dark: '#004C99', light: '#3385D6', contrastText: '#fff' },
    secondary: { main: '#5B5BD6', dark: '#4747B0', light: '#7A7ADF' },
    background: { default: '#F0F2F7', paper: '#FFFFFF' },
    success: { main: '#00875A' },
    error: { main: '#D63031' },
    warning: { main: '#E67E22' },
    text: { primary: '#0D1321', secondary: '#5A6478' },
    divider: 'rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily: '"IBM Plex Mono", "JetBrains Mono", "Courier New", monospace',
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
    caption: { fontSize: '0.72rem', letterSpacing: '0.04em' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 6, fontFamily: 'inherit' } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '8px 12px', fontSize: '0.8rem' },
        head: { color: '#5A6478', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem', backgroundColor: '#F8F9FB' },
      },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none', fontFamily: 'inherit', fontSize: '0.8rem', minHeight: 40 } },
    },
  },
  shape: { borderRadius: 8 },
});
