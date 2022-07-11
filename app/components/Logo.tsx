import styles from './Logo.module.css';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div>
      <div className={styles.Container}>
        <Link href={'https://coinbooks.xyz'}>
          <img className={styles.LogoImg} src="/coinbooks_logo.png" />
        </Link>
        <Link href="/">
          <div className={styles.LogoText}>Crypto Alerts</div>
        </Link>
      </div>
      <Link href={'https://coinbooks.xyz'}>
        <div className={styles.LogoSmallText}>by Coinbooks</div>
      </Link>
    </div>
  );
};
