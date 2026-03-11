import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#4f9cf9', light: '#7ab8ff', dark: '#2a5fa8' },
    secondary:  { main: '#3dd68c' },
    error:      { main: '#f06474' },
    warning:    { main: '#f0a742' },
    success:    { main: '#3dd68c' },
    background: { default: '#080b10', paper: '#111720' },
    text:       { primary: '#e2eaf4', secondary: '#7a90a8', disabled: '#3d5068' },
    divider:    '#1e2a3a',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif' },
    h2: { fontFamily: '"Playfair Display", serif' },
    h3: { fontFamily: '"Playfair Display", serif' },
    h4: { fontFamily: '"Playfair Display", serif' },
    h5: { fontFamily: '"Playfair Display", serif' },
    h6: { fontFamily: '"Playfair Display", serif' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(79,156,249,0.04) 0%, transparent 60%)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#243344 #0d1117',
        },
        '::-webkit-scrollbar':       { width: '5px' },
        '::-webkit-scrollbar-track': { background: '#0d1117' },
        '::-webkit-scrollbar-thumb': { background: '#243344', borderRadius: '3px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #1e2a3a',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(79,156,249,0.3), transparent)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif',
          borderRadius: 9,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f9cf9, #2a5fa8)',
          boxShadow: '0 2px 12px rgba(79,156,249,0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7ab8ff, #4f9cf9)',
            boxShadow: '0 6px 20px rgba(79,156,249,0.35)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#0d1117',
            '& fieldset':             { borderColor: '#1e2a3a' },
            '&:hover fieldset':       { borderColor: '#243344' },
            '&.Mui-focused fieldset': { borderColor: 'rgba(79,156,249,0.5)' },
          },
          '& .MuiInputLabel-root':  { color: '#7a90a8' },
          '& .MuiInputBase-input':  { color: '#e2eaf4' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { root: { background: '#0d1117' } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: '#0d1117',
            color: '#3d5068',
            fontSize: '10.5px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            fontWeight: 700,
            borderBottom: '1px solid #1e2a3a',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            borderBottom: '1px solid rgba(30,42,58,0.7)',
            transition: 'background 0.15s',
            '&:hover': { background: 'rgba(79,156,249,0.04)' },
            '&:last-child td': { borderBottom: 0 },
          },
          '& .MuiTableCell-root': { color: '#e2eaf4', fontSize: 13, padding: '13px 14px' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700, fontSize: '10.5px', height: 24 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: '#0d1117', borderRight: '1px solid #1e2a3a', width: 260 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13,17,23,0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #1e2a3a',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { background: '#111720', border: '1px solid #243344', borderRadius: 14 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 3, background: '#1e2a3a', height: 5 },
        bar:  { background: 'linear-gradient(90deg, #2a5fa8, #7ab8ff)', borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 9 } },
    },
  },
})
