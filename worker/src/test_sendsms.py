from utils import sms_helper

if __name__ == '__main__':
    sms_client = sms_helper.SMSClient()
    jeremy = "+61456001525"
    nam =    "+61403890999"
    anthony = "+61422174234"
    subscription = {
        "alertType": "ABOVE",
        "ticker": "BTC",
        "exchange": "BINANCE",
        "price": "60",
        "phone": nam
    }
    price = 69.0
    sms_client.send_sms(subscription, price)
