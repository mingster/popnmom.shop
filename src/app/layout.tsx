//import {Poppins} from "next/font/google"
//import { Metadata, ResolvingMetadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NextThemeProvider from '@/providers/theme-provider';
import MuiThemeProvider from '@/providers/mui-theme-provider';
import ToastProvider from '@/providers/toast-provider';
import NextAuthProvider from '@/providers/session-provider';
//import CartDropdownProvider from '@/providers/cart-dropdown-provider';
import { CartProvider } from '@/hooks/use-cart';
import I18nProvider from '@/providers/i18n-provider';

import './globals.css';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import getStore from '@/actions/get-store';

import { dir } from 'i18next';
import { languages, fallbackLng } from './i18n/settings';

export const revalidate = process.env.NODE_ENV == 'production' ? false : 1; // 1 second for development

export default async function RootLayout({
  children, //params: { lng },
}: {
  children: React.ReactNode;
  //params: { lng: string };
}) {
  const session = await getServerSession(authOptions);
  const store = await getStore();
  /*
  let lng = 'tw';
  if (!lng) lng = fallbackLng;
  console.log('lng: ' + lng);
  <html lang={lng} dir={dir(lng)}>
*/

  return (
    <html lang="us">
      <body>
        <NextAuthProvider session={session}>
          <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MuiThemeProvider>
              <ToastProvider />
              <CartProvider>
                <I18nProvider store={store}>
                  {children} <SpeedInsights />
                </I18nProvider>
              </CartProvider>
            </MuiThemeProvider>
          </NextThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
