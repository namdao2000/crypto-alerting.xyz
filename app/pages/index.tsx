import type { NextPage } from 'next';
import * as React from 'react';
import { PageLayout } from '../components/PageLayout';
import { AlertForm } from '../components/AlertForm';

const Index: NextPage = () => {
  return (
    <div>
      <PageLayout>
        <AlertForm />
      </PageLayout>
    </div>
  );
};

export default Index;
