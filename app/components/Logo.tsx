import styles from './Logo.module.css';
import Link from 'next/link';
import posthog from 'posthog-js';

export const Logo = () => {
  const fireCoinbooksEvent = () => {
    posthog.capture('Navigated to Coinbooks');
  };

  return (
    <div>
      <div className={styles.Container}>
        <a href={'https://coinbooks.xyz'} onClick={fireCoinbooksEvent}>
          <img className={styles.LogoImg} src="/coinbooks_logo.png" />
        </a>
        <Link href="/">
          <div className={styles.LogoText}>Crypto Alerts</div>
        </Link>
      </div>
      <a
        href={'https://coinbooks.xyz'}
        className={styles.LogoSmallText}
        onClick={fireCoinbooksEvent}
      >
        <div className={styles.LogoSmallText}>by Coinbooks</div>
      </a>
    </div>
  );
};
