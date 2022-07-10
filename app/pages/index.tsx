import type { NextPage } from 'next';
import * as React from 'react';
import { PageLayout } from '../components/PageLayout';
import { PricingAlert } from '../components/PricingAlert';

const Index: NextPage = () => {
  return (
    <div>
      <PageLayout>
        <PricingAlert />
      </PageLayout>
    </div>
  );
};

export default Index;
