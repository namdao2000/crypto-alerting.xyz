import { Subscription } from '../services/subscriptions.service';

export const server = 'http://localhost:3000';

export const fetcher = (url) => fetch(url).then((r) => r.json());

// Example post request from client
export const sendCreateSubscriptionRequest = async (
  data: Subscription
): Promise<void> => {
  const response = await fetch(`${server}/api/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
};
