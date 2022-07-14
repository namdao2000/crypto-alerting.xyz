import React from 'react';
import styles from './AlertForm.module.css';
import { Form } from 'react-bootstrap';
import { Bell } from 'react-feather';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { TextInput } from './TextInput';
import { CoinInput } from './CoinInput';
import { SelectInput } from './SelectInput';
import { useSession } from 'next-auth/react';
import { useCreateSubscription } from '../lib/hooks/useCreateSubscription';
import { Button, Grid } from '@geist-ui/core';
import { parsePhoneNumber } from 'awesome-phonenumber';

export const AlertForm: React.FC<any> = () => {
  const { data: session } = useSession();
  // You use it like this
  const { createSubscription, loading } = useCreateSubscription({
    onSuccess() {
      toast.success('Created an alert successfully');
    },
    onFailure(error) {
      toast.error(`Failed to create an alert: ${error}`);
    },
  });

  const isLoggedIn = !!session?.user?.email;

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<{
    notificationType: string;
    alertType: string;
    price: string;
    coin: string;
    keepAlertAfterTrigger: boolean;
    alertFrequency: number;
    email: string;
    phone?: string;
    exchange: string;
  }>({
    defaultValues: {
      coin: '',
      price: '',
      alertType: 'ABOVE',
      notificationType: 'EMAIL',
      keepAlertAfterTrigger: false,
      alertFrequency: 6,
      phone: '',
      exchange: 'FTX',
    },
  });

  const watchedKeepAlertAfterTrigger = watch('keepAlertAfterTrigger');
  const watchedInputSMS = watch('notificationType');
  const watchedAlertType = watch('alertType');

  const onSubmit = handleSubmit(async (data) => {
    await createSubscription({
      ticker: data.coin,
      threshold: parseInt(data.price) || undefined,
      alertType: data.alertType,
      exchange: data.exchange,
      disableAfterAlert: !data.keepAlertAfterTrigger,
      alertFrequency: data.alertFrequency,
      notificationType: data.notificationType,
      phone: data.phone?.trim() || undefined,
    });
    reset({
      coin: '',
      price: '',
      alertType: data.alertType,
      notificationType: data.notificationType,
      keepAlertAfterTrigger: data.keepAlertAfterTrigger,
      alertFrequency: 6,
      phone: '',
      exchange: data.exchange,
    });
  });

  return (
    <div className={styles.Container}>
      <Grid.Container gap={2} className={styles.OuterCard}>
        {/*Information*/}
        <Grid xs={24} md={12}>
          {watchedAlertType !== 'LISTING' && (
            <div>
              <div className={styles.Title}>
                <div>Pricing Alert</div>
              </div>
              <div className={styles.TitleSubtext}>
                Get notified when a coin goes above or below a price target.
              </div>
            </div>
          )}
          {watchedAlertType === 'LISTING' && (
            <div>
              <div className={styles.Title}>
                <div>Listing Alert</div>
              </div>
              <div className={styles.TitleSubtext}>
                Get notified when a new coin is listed on an exchange.
              </div>
            </div>
          )}
        </Grid>

        {/*Form*/}
        <Grid xs={24} md={12}>
          <div className={styles.FormContainer}>
            <Form className={styles.FormCard} onSubmit={onSubmit}>
              {/*Notification Section*/}
              <div>
                <div className={styles.FormTitleSection}>Add New Alert</div>
                <div className="py-3">
                  <SelectInput
                    name="notificationType"
                    control={control}
                    label="Notification"
                    options={[
                      { key: 'EMAIL', value: 'EMAIL' },
                      { key: 'SMS', value: 'SMS' },
                    ]}
                  />
                </div>
                {/*Conditional sms input*/}
                {watchedInputSMS === 'SMS' && (
                  <div className="pb-2">
                    <TextInput
                      label="Phone Number"
                      name="phone"
                      control={control}
                      rules={{
                        required: 'required',
                        validate: {
                          validPhone: (value) => {
                            const phone = parsePhoneNumber(value);
                            if (!phone.canBeInternationallyDialled()) {
                              return 'Please provide an international phone number';
                            }
                            if (!phone.isValid()) {
                              return 'Please provide a valid number';
                            }
                          },
                        },
                      }}
                      placeholder="+61 999 999 999"
                      errorMessage={errors.phone?.message}
                    />
                  </div>
                )}
                <div className="pb-3">
                  <CoinInput
                    label="Coin"
                    name="coin"
                    control={control}
                    rules={{ required: 'required' }}
                    placeholder="i.e BTC"
                  />
                </div>
                <Grid.Container gap={2}>
                  <Grid xs={12}>
                    <div className="pb-3" style={{ width: '100%' }}>
                      <SelectInput
                        name="alertType"
                        control={control}
                        label="When"
                        options={[
                          { key: 'ABOVE', value: 'ABOVE' },
                          { key: 'BELOW', value: 'BELOW' },
                          { key: 'LISTING', value: 'LISTING' },
                        ]}
                      />
                    </div>
                  </Grid>
                  <Grid xs={12}>
                    {watchedAlertType !== 'LISTING' && (
                      <div className="pb-3" style={{ width: '100%' }}>
                        <TextInput
                          label="Price [USD]"
                          name="price"
                          control={control}
                          rules={{
                            required: 'required',
                            validate: {
                              isPositive: (value) => {
                                if (value < 0) {
                                  return 'Price must be positive';
                                }
                              },
                            },
                          }}
                          errorMessage={errors.price?.message}
                          placeholder="$0"
                        />
                      </div>
                    )}
                    {watchedAlertType === 'LISTING' && (
                      <div className="pb-3" style={{ width: '100%' }}>
                        <SelectInput
                          name="exchange"
                          control={control}
                          label="Frequency"
                          options={[
                            { key: 'FTX', value: 'FTX' },
                            { key: 'BINANCE', value: 'BINANCE' },
                            { key: 'BITTREX', value: 'BITTREX' },
                            { key: 'BITMEX', value: 'BITMEX' },
                            { key: 'HUOBI', value: 'HUOBI' },
                            { key: 'OKX', value: 'OKX' },
                          ]}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid.Container>
                <Controller
                  control={control}
                  name="keepAlertAfterTrigger"
                  render={({ field: { onChange, value, ref } }) => (
                    <Form.Group>
                      <Form.Check
                        onChange={onChange}
                        value={value as any}
                        ref={ref}
                        type="checkbox"
                        label="Keep alert after being triggered once"
                      />
                    </Form.Group>
                  )}
                />
              </div>

              {/*Alert Frequency Section*/}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {watchedKeepAlertAfterTrigger && (
                  <div className="pb-3">
                    <SelectInput
                      name="alertFrequency"
                      control={control}
                      label="Frequency"
                      options={[
                        { key: '6 hours', value: 6 },
                        { key: '12 hours', value: 12 },
                        { key: '1 day', value: 24 },
                        { key: '1 week', value: 168 },
                      ]}
                    />
                  </div>
                )}
                {isLoggedIn && (
                  <Button
                    disabled={loading}
                    loading={loading}
                    auto
                    type="secondary"
                    scale={0.75}
                    htmlType="submit"
                  >
                    <Bell size={16} /> Alert me
                  </Button>
                )}
                {!isLoggedIn && (
                  <Button
                    disabled={loading}
                    loading={loading}
                    auto
                    type="secondary"
                    scale={0.75}
                    onClick={() => {
                      window.open('/google', '_blank');
                    }}
                  >
                    <Bell size={16} /> Alert me
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </Grid>
      </Grid.Container>
    </div>
  );
};
