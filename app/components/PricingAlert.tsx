import React from 'react';
import styles from './PricingAlert.module.css';
import { Grid } from '@mui/material';
import { Form } from 'react-bootstrap';
import { Button } from './Button';
import { Bell } from 'react-feather';
import { useForm, Controller } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';
// import { sendCreateSubscriptionRequest } from '../lib/utils/utils';

export const PricingAlert: React.FC<any> = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<{
    notificationType: string;
    alertType: string;
    price: string;
    coin: string;
    keepAlertAfterTrigger: boolean;
    alertFrequency?: string;
  }>({
    defaultValues: {
      coin: '',
      price: '',
      alertType: 'ABOVE',
      notificationType: 'Email',
      keepAlertAfterTrigger: false,
      alertFrequency: '',
    },
  });

  const watchedKeepAlertAfterTrigger = watch('keepAlertAfterTrigger');

  const onSubmit = handleSubmit(async (data) => {
    // create a custom hook so we can determine when it is loading to disable the button
    //
    // await sendCreateSubscriptionRequest({
    //   ticker: data.coin,
    //   threshold: parseInt(data.price),
    //   alertType: data.alertType,
    //   phone: if data.notificationType === SMS,
    //   email: if data.notificationType === Email,
    //   disableAfterAlert: !data.keepAlertAfterTrigger,
    //
    // })
    toast.success('Alert Created!');
    console.log(data);
  });

  return (
    <div className={styles.Container}>
      <div className={styles.OuterCard}>
        <Grid container spacing={1}>
          {/*Information*/}
          <Grid item xs={12} md={6}>
            <div className={styles.Title}>
              <p>Crypto Pricing</p>
            </div>
            <div>
              Get notified when a coin goes above or below a price target.
            </div>
          </Grid>

          {/*Form*/}
          <Grid item xs={12} md={6}>
            <div className={styles.InnerCard}>
              <Form className={styles.FormCard} onSubmit={onSubmit}>
                {/*Notification Section*/}
                <div>
                  <div className={styles.FormTitleSection}>Add New Alert</div>
                  <div className="py-3">
                    <SelectInput
                      name="notificationType"
                      control={control}
                      label="Notification"
                      options={['Email', 'SMS']}
                    />
                  </div>
                  <div className="pb-3">
                    <TextInput
                      label="Coin"
                      name="coin"
                      control={control}
                      rules={{ required: 'required' }}
                      errorMessage={errors.coin?.message}
                      placeholder="i.e BTC"
                    />
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div className="pb-3">
                        <SelectInput
                          name="alertType"
                          control={control}
                          label="When"
                          options={['ABOVE', 'BELOW']}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="pb-3">
                        <TextInput
                          label="Price"
                          name="price"
                          control={control}
                          rules={{ required: 'required' }}
                          errorMessage={errors.price?.message}
                          placeholder="0"
                        />
                      </div>
                    </Grid>
                  </Grid>
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
                <div>
                  {watchedKeepAlertAfterTrigger && (
                    <div className="pb-3">
                      <SelectInput
                        name="alertFrequency"
                        control={control}
                        label="Frequency"
                        options={[
                          '5 minutes',
                          '10 minutes',
                          '15 minutes',
                          '30 minutes',
                          '1 hour',
                          '2 hours',
                          '4 hours',
                          '8 hours',
                          '12 hours',
                          '1 day',
                        ]}
                      />
                    </div>
                  )}
                </div>
                <Button>
                  <Bell size={16} /> Alert me
                </Button>
              </Form>
            </div>
          </Grid>
        </Grid>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};
