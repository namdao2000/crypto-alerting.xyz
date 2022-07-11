import { server } from '../utils/utils';
import { Subscription } from '../services/subscriptions.service';
import { useState } from 'react';

type HookReturn = {
  loadingDelete: boolean;
  deleteSubscription: (data: Subscription) => Promise<void>;
};

export const useDeleteSubscription = (): HookReturn => {
  const [loadingDelete, setLoading] = useState(false);

  const deleteSubscription = async (data: Subscription) => {
    setLoading(true);
    const response = await fetch(`${server}/api/subscription/_id`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setLoading(false);
  };

  return {
    loadingDelete,
    deleteSubscription,
  };
};
