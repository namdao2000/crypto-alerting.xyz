import * as React from 'react';
import styles from './Footer.module.css';
import { Logo } from './Logo';
import { GitHub } from 'react-feather';

const Footer: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.FooterBar}>
        <Logo />
        <div className={styles.Copyright}>
          © {new Date().getFullYear()} MIT License <GitHub size={16} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
