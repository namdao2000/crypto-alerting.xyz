import React from 'react';
import styles from './AlertCard.module.css';

export const AlertCard: React.FC<any> = ({ alert }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.AlertCard}>{alert.text}</div>
    </div>
  );
};

export default AlertCard;
