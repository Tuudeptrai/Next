'use client'
import '../../components/style/app.css';
import AuthProvider from '../../components/lib/auth/AuthProvider';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
 
  return (
   
      <html lang="en">
        <body>
          
          <AuthProvider>
          {children}
          </AuthProvider>
         
         
          
        </body>
      </html>
  );
};

export default RootLayout;
