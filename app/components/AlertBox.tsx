import React from 'react';
import styles from './AlertBox.module.css';
import { Grid } from '@mui/material';

export const AlertBox: React.FC<any> = ({ children }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.OuterCard}>
        {/*Information*/}
        <Grid item xs={12} md={6}>
          <div className={styles.Title}>Your Alerts.</div>
          <div className={styles.Subtitle}>
            Get notified when a coin goes above or below a price target.
          </div>
        </Grid>
        <div className={styles.InnerCard}>{children}</div>
      </div>
    </div>
  );
};

export default AlertBox;
