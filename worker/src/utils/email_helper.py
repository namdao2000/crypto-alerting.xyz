import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from dotenv import load_dotenv, find_dotenv


class EmailClient:

    def __init__(self):
        load_dotenv()

        sendgrid_api_key = os.getenv('SENDGRID_API_KEY')
        from_email = os.getenv('FROM_EMAIL')
        listing_template_id = os.getenv('LISTING_ALERT_SENDGRID_TEMPLATE_ID')
        price_template_id = os.getenv('PRICE_ALERT_SENDGRID_TEMPLATE_ID')


        if sendgrid_api_key is None:
            raise Exception("Sendgrid API key is not set")
        if from_email is None:
            raise Exception("From email is not set")
        if price_template_id is None or price_template_id is None:
            raise Exception("Email Template ID is not set")

        self._client = SendGridAPIClient(sendgrid_api_key)
        self._from_email = from_email
        self.listing_alert_template_id = listing_template_id
        self.price_alert_template_id = price_template_id

    def send_email(self, subscription: dict, price: float):
        """
        Sends an email to the user.
        """
        try:

            mail = self.build_dynamic_email(subscription, price)
            response = self._client.send(mail)
            print(response)

            if response.status_code == 202:
                print(f"[ALERT_THREAD] Email sent to: {subscription['email']}")

            if response.status_code != 202:
                print(f"[ALERT_THREAD] Email failed to send to: {subscription['email']}")
        except Exception as e:
            print(e)
            return False
        return True

    def build_dynamic_email(self, subscription: dict, price: float):
        """
        Builds an email to be sent to the user.
        """
        subject = None
        body = None
        mail = None

        if subscription['alertType'] == "LISTING":
            mail = Mail(
                from_email=self._from_email,
                to_emails=subscription['email'],
            )
            mail.dynamic_template_data = {
                'ticker': subscription['ticker'],
                'exchange': subscription['exchange'],
            }
            mail.template_id = self.listing_alert_template_id

        else:
            mail = Mail(
                from_email=self._from_email,
                to_emails=subscription['email'],
            )
            mail.dynamic_template_data = {
                'alertType': subscription['alertType'],
                'ticker': subscription['ticker'],
                'price': subscription['threshold'],
                'currentPrice': price
            }
            mail.template_id = self.price_alert_template_id

        return mail

    def build_email(self, subscription: dict, price: float):
        """
        Builds an email to be sent to the user.
        """
        subject = None
        body = None

        if subscription['alertType'] == "LISTING":
            subject = f"{subscription['ticker']} listed on {subscription['exchange']}"
            body = f"{subscription['ticker']} has been listed on {subscription['exchange']} at {price}"

        if subscription['alertType'] == "ABOVE":
            subject = f"{subscription['ticker']} is above {subscription['threshold']}"
            body = f"{subscription['ticker']} is above {subscription['threshold']} at {price}"
        if subscription['alertType'] == "BELOW":
            subject = f"{subscription['ticker']} is below {subscription['threshold']}"
            body = f"{subscription['ticker']} is below {subscription['threshold']} at {price}"

        return Mail(
            from_email=self._from_email,
            to_emails=subscription['email'],
            subject=subject,
            html_content=body
        )
