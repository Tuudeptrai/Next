'use client';
import AuthSignIn from '@/components/auth/signIn';
import React from 'react';

import { useRouter } from 'next/navigation';
import { useSession ,SessionProvider } from 'next-auth/react';

const SignInPage = () => {
    const { data: session } = useSession();
    console.log('useSession', session);
    const router = useRouter();
  if(session){
    router.push('/');
  }
  return (
  <AuthSignIn />
  )
};

export default SignInPage;
