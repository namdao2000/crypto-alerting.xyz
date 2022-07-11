import React from 'react';
import styles from './PriceData.module.css';
import { useToggleSubscription } from '../../lib/hooks/useToggleSubcription';
import { useDeleteSubscription } from '../../lib/hooks/useDeleteSubscription';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { CoinDataService } from '../../lib/services/coindata.service';

import { Grid } from '@geist-ui/core';

export const PriceData: React.FC<any> = (coinData) => {
  const { data: session, status } = useSession();

  const [item, setItem] = React.useState(coinData);

  useEffect(() => {
    setItem(item);
  }, [item]);

  const updateCurrentCoinData = useCallback(
    (coin: string, exchange: string) => {
      const newCoinData = CoinDataService.getCoinData(coin, exchange);
      setItem(newCoinData);
    },
    []
  );

  return <div className={styles.PriceData}>{item.price}</div>;
};

export default PriceData;
