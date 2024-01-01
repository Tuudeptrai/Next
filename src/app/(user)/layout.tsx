import * as React from 'react';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import AppHeader from '@/components/header/header';
import AppFooter from '@/components/footer/footer';
import AuthProvider from '../../components/lib/auth/AuthProvider';
import { ToastProvider } from '@/utils/toast';
import { TrackContextProvider } from '@/components/lib/TrackWraper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  

  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
        <TrackContextProvider>
        <AppHeader/>
        <ToastProvider>
        {children}
        </ToastProvider>
        <AppFooter/>
        </TrackContextProvider>
        </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
