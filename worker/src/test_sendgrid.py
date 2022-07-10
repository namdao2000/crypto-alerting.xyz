from utils import globals
from utils import email_helper

if __name__ == '__main__':

    email_client = email_helper.EmailClient()
    jeremy = "jrmyok@pm.me"
    nam = "namdao2000@gmail.com"
    subscription = {
        "email": jeremy,
        "alertType": "ABOVE",
        "ticker": "BTC",
        "exchange": "BINANCE",
        "threshold": "60"
    }
    price = 69.0
    email_client.send_email(subscription, price)
