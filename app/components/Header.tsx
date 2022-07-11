import { NextPage } from 'next';
import Link from 'next/link';
import styles from './Header.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@geist-ui/core';
import { Logo } from './Logo';

export const Header: NextPage = () => {
  const { data: session, status } = useSession();

  const isLoggedIn = !!session?.user?.email;
  const displayAuthButtons = status !== 'loading';

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const logout = () => {
    signOut();
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Navbar}>
        <Logo />

        {!isLoggedIn && displayAuthButtons && (
          <div className={styles.FullNavItems}>
            <div onClick={login} className={styles.NavItem}>
              Login
            </div>
            <div className={styles.NavButton}>
              <Button auto type="secondary" onClick={login} scale={0.75}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
        {isLoggedIn && displayAuthButtons && (
          <div className={styles.FullNavItems}>
            <div className={styles.NavItem}>
              <div onClick={logout}>Logout</div>
            </div>
            <Link href="/alerts">
              <div className={styles.NavButton}>
                <Button type="success" auto scale={0.75}>
                  My Alerts
                </Button>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
