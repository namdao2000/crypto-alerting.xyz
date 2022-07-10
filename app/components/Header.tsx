import { NextPage } from 'next';
import Link from 'next/link';
import styles from './Header.module.css';
import { Button } from './Button';

export const Header: NextPage = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.Navbar}>
        <div className={styles.Logo}>
          Crypto Alerting
        </div>
        <div className={styles.FullNavItems}>
          <Link href="/login">
            <div className={styles.NavItem}>
              Login
            </div>
          </Link>
          <Link href="/signup">
            <div className={styles.NavButton}>
              <Button>
                Sign Up
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
