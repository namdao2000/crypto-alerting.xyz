import { NextPage } from 'next';
import useSWR from 'swr';
import { fetcher } from '../lib/utils/utils';
import AlertsComponent from '../components/AlertsComponent';
import { useCallback, useEffect, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { useDeleteSubscription } from '../lib/hooks/useDeleteSubscription';
import { toast } from 'react-hot-toast';

const Alerts: NextPage = () => {
  const { data, isValidating } = useSWR('/api/subscriptions', fetcher);
  const [alerts, setAlerts] = useState(data as any[]);
  const { deleteSubscription } = useDeleteSubscription();

  useEffect(() => {
    setAlerts(data as any[]);
  }, [data]);

  const removeAlert = useCallback(
    async (alert) => {
      await deleteSubscription(alert);
      setAlerts([...alerts.filter((currAlert) => currAlert._id !== alert._id)]);
      toast.success('Alert deleted successfully');
    },
    [alerts, deleteSubscription]
  );

  return (
    <div>
      <PageLayout>
        <AlertsComponent
          alerts={alerts}
          removeAlert={removeAlert}
          loading={isValidating}
        />
      </PageLayout>
    </div>
  );
};

export default Alerts;
