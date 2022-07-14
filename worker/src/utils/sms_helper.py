import os

from twilio.rest import Client
from dotenv import load_dotenv



class SMSClient:

    def __init__(self):
        load_dotenv()
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        messaging_service_sid = os.environ.get('TWILIO_MESSAGING_SERVICE_SID')

        if account_sid is None:
            raise Exception("Twilio account sid is not set")
        if auth_token is None:
            raise Exception("Twilio auth token is not set")
        if messaging_service_sid is None:
            raise Exception("Twilio messaging service sid is not set")

        self._messaging_service_sid = messaging_service_sid

        self.client = Client(
            account_sid,
            auth_token
        )

    def send_sms(self, subscription: dict, price: float):

        try:
            text = self._build_message(subscription, price)
            if text["body"] is None:
                raise Exception("Message body is None")
            self.client.messages.create(**text)
            print(f"[SMS_THREAD] SMS sent to: {subscription['phone']}")
        except Exception as e:
            print(e)
            return False
        return True

    def _build_message(self, subscription: dict, price: float):
        body = None
        # create listing twilio message kwargs
        if subscription['alertType'] == "LISTING":
            body = f"Crypto Alerts @ Coinbooks:\n{subscription['ticker']} has been listed on {subscription['exchange']} at ${price}"

        if subscription['alertType'] == "ABOVE":
            body = f"Crypto Alerts @ Coinbooks:\n{subscription['ticker']} is above ${subscription['threshold']} at ${price}"

        if subscription['alertType'] == "BELOW":
            body = f"Crypto Alerts @ Coinbooks:\n{subscription['ticker']} is below ${subscription['threshold']} at ${price}"

        text = {
            "messaging_service_sid": self._messaging_service_sid,
            "body": body,
            "to": subscription['phone']
        }

        return text


