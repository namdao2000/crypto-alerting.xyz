import { Header } from './Header';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import React from 'react';

export const PageLayout: React.FC<any> = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <Footer />
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};
