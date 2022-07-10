import { NextPage } from 'next';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import useSWR from 'swr';
import { fetcher } from '../lib/utils/utils';
import AlertCard from '../components/AlertCard';

const Alerts: NextPage = () => {
  const { data, error } = useSWR('/api/subscriptions', fetcher);

  console.log(data);
  return (
    <div>
      <Header />
      Alerts Page
      <AlertCard alert={{ text: 'hello world' }} />
      <Footer />
    </div>
  );
};

export default Alerts;
