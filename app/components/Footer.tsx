import * as React from 'react';
import styles from './Footer.module.css';
import { Logo } from './Logo';
import { GitHub } from 'react-feather';

const Footer: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.FooterBar}>
        <Logo />
        <a
          href="https://github.com/namdao2000/crypto-alerting.xyz"
          className={styles.Copyright}
        >
          © {new Date().getFullYear()} MIT License{' '}
          <GitHub style={{ marginLeft: '5px' }} size={16} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
