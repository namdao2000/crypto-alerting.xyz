import React from 'react';
import styles from './AlertCard.module.css';
import { AlertBox } from './AlertBox';

export const AlertCard: React.FC<any> = ({ alert }) => {
  return <div className={styles.AlertCard}>{alert.text}</div>;
};

export default AlertCard;
