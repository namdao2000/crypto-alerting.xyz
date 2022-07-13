import { server } from '../utils/utils';
import { Subscription } from '../services/subscriptions.service';
import { useState } from 'react';

type HookReturn = {
  loadingToggle: boolean;
  toggleSubscription: (data: Subscription) => Promise<void>;
};

export const useToggleSubscription = (): HookReturn => {
  const [loadingToggle, setLoading] = useState(false);

  const toggleSubscription = async (data: Subscription) => {
    setLoading(true);
    data['enabled'] = !data['enabled'];
    console.log(data);
    const response = await fetch(`${server}/api/subscription/_id`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, ipAddress: undefined }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setLoading(false);
  };

  return {
    loadingToggle,
    toggleSubscription,
  };
};
