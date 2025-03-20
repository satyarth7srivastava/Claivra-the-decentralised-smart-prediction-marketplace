import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { NEXT_AUTH_CONFIG } from '../lib/auth';
import Login from '../components/Login';

const LoginPage = async () => {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (session?.user) {
    redirect('/');
  }
  return <Login/>;
};

export default LoginPage;