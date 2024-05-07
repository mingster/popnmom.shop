'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import useMediaQuery from '@mui/material/useMediaQuery';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const muiTheme = (mode: string) => {
  if (mode === 'dark') {
    return darkTheme;
  } else {
    return lightTheme;
  }
};

interface muiThemeProviderProps {
  children: React.ReactNode;
}
const MuiThemeProvider: React.FC<muiThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  //const theme = localStorage.getItem('theme') as string;

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  let mTheme;
  if (prefersDarkMode) mTheme = muiTheme('dark');
  else mTheme = muiTheme(theme as string);
  /*
  const myTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  if (theme === 'light' || 'dark') {}
  console.log('prefersDarkMode: ' + prefersDarkMode);
  console.log('next Theme: ' + theme);
  console.log('mui Theme: ' + mTheme.palette.mode);

  */

  return <ThemeProvider theme={mTheme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
