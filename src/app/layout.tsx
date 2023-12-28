import * as React from 'react';
import ThemeRegistry from '@/components/theme-registry/theme.registry';
import AppHeader from '@/components/header/header';
import AppFooter from '@/components/footer/footer';
import AuthProvider from '../components/lib/auth/AuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
        <AppHeader/>
            {children}
        <AppFooter/>
        </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
