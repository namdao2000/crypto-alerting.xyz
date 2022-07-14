import React, { useCallback, useEffect } from 'react';
import styles from './AlertsComponent.module.css';
import { Grid, Loading, Progress, Table, Toggle } from '@geist-ui/core';
import { Trash2 } from 'react-feather';
import { useToggleSubscription } from '../lib/hooks/useToggleSubcription';

export const AlertsComponent: React.FC<any> = ({
  alerts,
  removeAlert,
  loading,
}) => {
  const [formattedPriceAlerts, setFormattedPriceAlerts] = React.useState([]);
  const { toggleSubscription } = useToggleSubscription();

  const handleStatusChange = useCallback(
    async (alert) => {
      await toggleSubscription(alert);
    },
    [toggleSubscription]
  );

  useEffect(() => {
    if (!alerts || !alerts.length) return;
    setFormattedPriceAlerts(
      alerts.map((alert) => {
        return {
          ...alert,
          threshold: alert.threshold ? `$${alert.threshold}` : 'N/A',
          alertFrequency: alert.alertFrequency
            ? `${alert.alertFrequency} hours`
            : 'N/A',
          enabled: (
            <Toggle
              type="default"
              checked={alert.enabled}
              onChange={async () => {
                await handleStatusChange(alert);
              }}
            />
          ),
          remove: (
            <Trash2
              className={styles.TrashButton}
              onClick={() => {
                removeAlert(alert);
              }}
            />
          ),
        };
      })
    );
  }, [alerts]);

  return (
    <div className={styles.Container}>
      <Grid.Container className={styles.OuterCard} gap={2}>
        <Grid xs={24}>
          <div>
            <div className={styles.Title}>Your Alerts</div>
          </div>
        </Grid>
        {alerts && !!alerts.length && (
          <Grid xs={24}>
            <Grid.Container gap={2}>
              <Grid xs={24}>
                <div className={styles.TitleSubtext}>
                  You have used {alerts.length} out of 15 free alerts.
                </div>
              </Grid>
              <Grid xs={24}>
                <Progress value={(alerts.length / 15) * 100} />
              </Grid>
            </Grid.Container>
          </Grid>
        )}
        <Grid xs={24}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {alerts && alerts.length ? (
                <Table data={formattedPriceAlerts} className={styles.FormCard}>
                  <Table.Column prop="ticker" label="coin" />
                  <Table.Column prop="alertType" label="when" />
                  <Table.Column prop="threshold" label="price" />
                  <Table.Column prop="notificationType" label="notify via" />
                  <Table.Column prop="alertFrequency" label="frequency" />
                  <Table.Column prop="enabled" label="status" />
                  <Table.Column prop="remove" label="remove" />
                </Table>
              ) : (
                <div className={styles.TitleSubtext}>
                  You have no alerts. Let&apos;s create one!
                </div>
              )}
            </>
          )}
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default AlertsComponent;
