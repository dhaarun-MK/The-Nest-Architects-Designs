import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a2e' },
    secondary: { main: '#c9a84c' },
    background: { default: '#fafafa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif' },
    h2: { fontFamily: '"Playfair Display", serif' },
    h3: { fontFamily: '"Playfair Display", serif' },
    h4: { fontFamily: '"Playfair Display", serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 2, textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});

export default theme;
