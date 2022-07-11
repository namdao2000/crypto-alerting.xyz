import React, { useEffect } from 'react';
import styles from './CoinCard.module.css';
import { useSession } from 'next-auth/react';

export const AlertCard: React.FC<any> = ({
  coinData,
  updateCurrentCoinData,
}) => {
  const { data: session, status } = useSession();

  const [price, setPrice] = React.useState(coinData.price);

  useEffect(() => {
    setPrice(coinData.price);
  }, [coinData.price]);

  return <div className={styles.AlertCard} />;
};

export default AlertCard;
