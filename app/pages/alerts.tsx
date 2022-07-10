import { NextPage } from 'next';
import { Header } from '../components/Header';
import Footer from '../components/Footer';
import useSWR from 'swr';
import { fetcher } from '../lib/utils/utils';
import AlertCard from '../components/AlertCard';
import AlertBox from '../components/AlertBox';

const Alerts: NextPage = () => {
  const { data, error } = useSWR('/api/subscriptions', fetcher);

  console.log(data);
  const list = ['Hello', 'World'];

  return (
    <div>
      <Header />
      <AlertBox>
        {list.map((item, index) => {
          return <AlertCard key={index} alert={{ text: item }} />;
        })}
      </AlertBox>
      <Footer />
    </div>
  );
};

export default Alerts;
