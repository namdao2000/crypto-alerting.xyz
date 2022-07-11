import { Subscription } from '../services/subscriptions.service';
import { server } from '../utils/utils';
import { useState } from 'react';

type HookReturn = {
  loading: boolean;
  createSubscription: (data: Subscription) => Promise<void>;
};

// inside this hook folder, you create your custom hooks to make API calls.
// This hook returns two things (loading and createSubscription method)

export const useCreateSubscription = ({
  onSuccess,
  onFailure,
}: {
  onSuccess: () => void;
  onFailure: (error?: any) => void;
}): HookReturn => {
  const [loading, setLoading] = useState(false);

  const createSubscription = async (data: Subscription) => {
    setLoading(true);
    const response = await fetch(`${server}/api/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      onFailure(response.statusText);
    } else {
      onSuccess();
    }
    setLoading(false);
  };

  // So down here, it returns like. Cool thing about hook is that it holds onto the loading state,
  // so your component doesn't have to
  return {
    loading,
    createSubscription,
  };
};
