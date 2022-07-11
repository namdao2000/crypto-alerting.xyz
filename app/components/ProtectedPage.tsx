import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const ProtectedPage = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    window.open('/google');
  }

  return <>{children}</>;
};
