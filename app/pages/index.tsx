import type { NextPage } from 'next';
import * as React from 'react';
import { signIn, signOut } from 'next-auth/react';
import Header from '../components/header';
import Footer from '../components/footer';

const Index: NextPage = () => {
  return (
    <div>
      <Header />
      <button onClick={async () => {
      }}>
        createSubscription
      </button>
      <button onClick={
        async () => {
          signIn('google', { callbackUrl: '/' })
        }
      }>
        login
      </button>
      <button onClick={
        async () => {
          signOut()
        }
      }>
        logout
      </button>
      <Footer />
    </div>
  );
};

export default Index;
