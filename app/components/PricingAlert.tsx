import React from 'react';
import styles from './PricingAlert.module.css';
import { Grid } from '@mui/material';
import { Form } from 'react-bootstrap';
import { Button } from './Button';
import { Bell } from 'react-feather';

export const PricingAlert: React.FC<any> = () => {
  return (
    <div className={styles.Container}>
      <div className={styles.OuterCard}>
        <Grid container spacing={1}>

          {/*Information*/}
          <Grid item xs={12} md={6}>
            <div className={styles.Title}>
              Crypto Pricing
            </div>
            <div>Get notified when a coin goes above or below a price target.
            </div>
          </Grid>

          {/*Form*/}
          <Grid item xs={12} md={6}>
            <div className={styles.InnerCard}>
              <Form className={styles.FormCard}>
                {/*Notification Section*/}
                <div>
                  <div className={styles.FormTitleSection}>
                    Add New Alert
                  </div>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Form.Group className="py-3">
                        <Form.Label>Notification</Form.Label>
                        <Form.Select aria-label="Notification Option">
                          <option value="SMS">SMS</option>
                          <option value="Email">Email</option>
                        </Form.Select>
                      </Form.Group>
                    </Grid>
                    <Grid item xs={9}>
                      {/*IDK */}
                    </Grid>
                  </Grid>
                  <Form.Group className="pb-3" controlId="formBasicEmail">
                    <Form.Label>Coin</Form.Label>
                    <Form.Control type="text" placeholder="BTC"/>
                  </Form.Group>

                  <Form.Group className="pb-3">
                    <Form.Label>When</Form.Label>
                    <Form.Select aria-label="Notification Option">
                      <option value="ABOVE">ABOVE</option>
                      <option value="BELOW">BELOW</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="pb-3" controlId="formBasicEmail">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" placeholder="32000"/>
                  </Form.Group>

                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Disable after trigger"/>
                  </Form.Group>
                </div>
                <Button>
                  <Bell size={16}/> Alert me
                </Button>
              </Form>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}