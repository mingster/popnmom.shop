'use client';

import * as React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/app/i18n/client';

//import useMediaQuery from '@mui/material/useMediaQuery';

export function ThemeToggler() {
  //const { theme } = useTheme();
  //const theme = localStorage.getItem('theme');
  //const theme = document.documentElement.getAttribute('data-theme');
  //console.log('next Theme: ' + theme);
  const { lng } = useI18n();
  const { t } = useTranslation(lng);

  const { setTheme } = useTheme();

  //mui theme
  //const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  function setMyTheme(theme: string) {
    //mui theme

    //next theme
    setTheme(theme);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('theme_toggler_title')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setMyTheme('light')}>{t('theme_toggler_light')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMyTheme('dark')}>{t('theme_toggler_dark')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMyTheme('system')}>{t('theme_toggler_system')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ThemeToggler;
