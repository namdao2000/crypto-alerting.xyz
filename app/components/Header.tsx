import { NextPage } from 'next';
import Link from 'next/link';
import styles from './Header.module.css';
import { Button } from './Button';
import { signIn, signOut, useSession } from 'next-auth/react';

export const Header: NextPage = () => {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user?.email;
  const displayAuthButtons = status !== 'loading'

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  }

  const logout = () => {
    signOut();
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Navbar}>
        <Link href="/">
          <div className={styles.Logo}>Crypto Alerting</div>
        </Link>

        {!isLoggedIn && displayAuthButtons && (
          <div className={styles.FullNavItems}>
            <div
              onClick={login}
              className={styles.NavItem}>
              Login
            </div>
            <div className={styles.NavButton}>
              <Button onClick={login}>Sign Up</Button>
            </div>
          </div>
        )}
        {isLoggedIn && displayAuthButtons && (
          <div
            onClick={logout}
            className={styles.NavItem}>
            Logout
          </div>
        )}
      </div>
    </div>
  );
};
