import asyncio
import datetime
import threading
import ccxt as ccxt
from datetime import timedelta
from utils import globals

from utils.utils import is_stale, convert_symbol
from db.pricedb import DBClient
from utils.email_helper import EmailClient
from utils.sms_helper import SMSClient


class CCXTClient:
    def __init__(self):
        self.clients = {
            "FTX": ccxt.ftx(),
            "OKX": ccxt.okcoin(),
            "BINANCE": ccxt.binance(),
            "BITTREX": ccxt.bittrex(),
            "HUOBI": ccxt.huobi(),
            "BITMEX": ccxt.bitmex(),
        }
        map(lambda x: x.load_markets(), self.clients.values())

    def get_price(self, coin, exchange):
        ticker: str = convert_symbol(coin, exchange)
        price = self.clients[exchange].fetch_ticker(ticker)['last']
        return float(price)


def handle_alert_task(subscription: dict, price: float):

    if subscription['_id'] in globals.currently_updating_subscriptions:
        return

    alert_task = {
        'subscription': subscription,
        'price': price
    }

    # Check if alert has been disabled
    if subscription['enabled'] is False:
        return
    # Check if last alerted has been sent in the last 5 minutes
    if subscription['lastAlerted'] is not None:
        if not is_stale(subscription['lastAlerted'], timedelta(minutes=subscription['alertFrequency'])):
            return

    # If alert is of type listing and a price has been retrieved
    if subscription['alertType'] == "LISTING" and price is not None:
        globals.currently_updating_subscriptions.add(subscription['_id'])
        globals.alert_queue.put(alert_task)

    # Below case
    if subscription['alertType'] == "BELOW":
        if price < float(subscription['threshold']):
            globals.currently_updating_subscriptions.add(subscription['_id'])
            globals.alert_queue.put(alert_task)
    # Above case
    if subscription['alertType'] == "ABOVE":
        if price > float(subscription['threshold']):
            globals.currently_updating_subscriptions.add(subscription['_id'])
            globals.alert_queue.put(alert_task)
    # Equal case ???


class Worker:

    def __init__(self):
        self.db: DBClient = DBClient()

    async def run(self):
        while True:

            coin_list = await self.db.get_coin_list()
            for coin in coin_list:
                subscriptions = await self.db.get_subscriptions(coin['ticker'], coin['exchange'])

                if is_stale(coin['lastUpdated'],
                            timedelta(seconds=30)) \
                        and f"{coin['ticker']}-{coin['exchange']}" not in globals.currently_updating_prices:
                    globals.currently_updating_prices.add(f'{coin["ticker"]}-{coin["exchange"]}')
                    globals.update_price_queue.put(coin)
                    continue

                for subscription in subscriptions:
                    handle_alert_task(subscription, price=float(coin['price']))

            await asyncio.sleep(1)


class PriceThread(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self, daemon=True)
        self.db_client = None
        self.ccxt_client = None

    async def run_async(self):
        self.db_client: DBClient = DBClient()
        self.ccxt_client: CCXTClient = CCXTClient()
        loop = asyncio.get_event_loop()
        while True:
            task = globals.update_price_queue.get()
            print(f"[COIN_THREAD] updating {task['ticker']}'s price on {task['exchange']}. {datetime.datetime.now()}")
            price = self.ccxt_client.get_price(task['ticker'], task['exchange'])  # get price from ccxt
            await self.db_client.update_price(task['ticker'], task['exchange'], price)
            globals.currently_updating_prices.remove(f'{task["ticker"]}-{task["exchange"]}')

    def run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.run_async())
        loop.close()


class AlertThread(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self, daemon=True)
        self.db_client = None
        self.email_client = None
        self.sms_client = None

    async def run_async(self):
        self.db_client: DBClient = DBClient()
        self.email_client: EmailClient = EmailClient()
        self.sms_client: SMSClient = SMSClient()
        while True:
            task = globals.alert_queue.get()
            price = task['price']
            subscription = task['subscription']
            alert_sent = False
            print(f"[ALERT_THREAD] sending alert for {subscription['ticker']}.")

            if 'email' in subscription:
                alert_sent = self.email_client.send_email(subscription, price)

            if 'phone' in subscription:
                alert_sent = self.sms_client.send_sms(subscription, price)

            if alert_sent:
                await self.update_subscription(subscription)

    async def update_subscription(self, subscription: dict):
        updated_subscription = subscription
        updated_subscription['lastAlerted'] = datetime.datetime.now().isoformat()
        if updated_subscription['disableAfterAlert']:
            updated_subscription['enabled'] = False
        await self.db_client.update_subscription(updated_subscription)
        globals.currently_updating_subscriptions.remove(subscription['_id'])


    def run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.run_async())
        loop.close()
