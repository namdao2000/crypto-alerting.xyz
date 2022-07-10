import * as React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.FooterBar}>
        <div className={styles.Logo}>Crypto Alerting</div>
        <div className={styles.Copyright}>© 2022 Crypto Alerting</div>
      </div>
    </div>
  );
};

export default Footer;
