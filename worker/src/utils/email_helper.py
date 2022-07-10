import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

FROM_EMAIL = os.environ.get('FROM_EMAIL')


class EmailClient:

    def __init__(self):
        self._client = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))

    def send_email(self, subscription: dict, price: float):
        """
        Sends an email to the user.
        """
        try:

            mail = build_email(subscription, price)
            response = self._client.send(mail)

            if (response.status_code == 202):
                print(f"[EMAIL_THREAD] Email sent to: {subscription['email']}")

            if (response.status_code != 202):
                print(f"[EMAIL_THREAD] Email failed to send to: {subscription['email']}")
        except Exception as e:
            print(e.message)
            return False
        return True


def build_email(subscription: dict, price: float):
    """
    Builds an email to be sent to the user.
    """
    subject = None
    body = None

    if subscription['alertType'] is "LISTING":
        subject = f"{subscription['ticker']} listed on {subscription['exchange']}"
        body = f"{subscription['ticker']} has been listed on {subscription['exchange']} at {price}"

    if subscription['alertType'] is "ABOVE":
        subject = f"{subscription['ticker']} is above {subscription['price']}"
        body = f"{subscription['ticker']} is above {subscription['price']} at {price}"
    if subscription['alertType'] is "BELOW":
        subject = f"{subscription['ticker']} is below {subscription['price']}"
        body = f"{subscription['ticker']} is below {subscription['price']} at {price}"

    return Mail(
        from_email=FROM_EMAIL,
        to_emails=subscription['email'],
        subject=subject,
        html_content=body
    )
