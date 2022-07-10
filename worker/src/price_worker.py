import asyncio
import datetime
import threading
import ccxt as ccxt
from datetime import timedelta
from utils import globals

from utils.utils import is_stale, convert_symbol
from db.pricedb import DBClient
from utils.email_helper import EmailClient


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
        return price


def handle_alert_task(subscription: dict, price: float):
    alert_task = {
        'subscription': subscription,
        'price': price
    }
    # Check if alert has been sent in the last 5 minutes
    if not is_stale(subscription['lastAlerted'], timedelta(minutes=5)):
        return
    # If alert is of type listing and a price has been retrieved
    if subscription['alertType'] is "LISTING" and price is not None:
        globals.alert_queue.put(alert_task)

    if subscription['alertType'] is "PRICE":
        # Below case
        if subscription['alert']['when'] is "BELOW":
            if price < subscription['threshold']:
                globals.alert_queue.put(alert_task)
        # Above case
        if subscription['alert']['when'] is "ABOVE":
            if price > subscription['threshold']:
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
                            timedelta(seconds=10)) \
                        and f"{coin['ticker']}-{coin['exchange']}" not in globals.currently_updating:
                    globals.currently_updating.add(f'{coin["ticker"]}-{coin["exchange"]}')
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
        while True:
            task = globals.update_price_queue.get()
            print(f"[COIN_THREAD] updating {task['ticker']}'s price on {task['exchange']}. {datetime.datetime.now()}")
            new_price = self.ccxt_client.get_price(task['ticker'], task['exchange'])  # get price from ccxt
            await self.db_client.update_price(task['ticker'], task['exchange'], new_price)
            globals.currently_updating.remove(f'{task["ticker"]}-{task["exchange"]}')

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

    async def run_async(self):
        self.db_client: DBClient = DBClient()
        self.email_client: EmailClient = EmailClient()
        while True:
            task = globals.alert_queue.get()
            if task['subscription']['sendEmail']:
                self.email_client.send_email(task['subscription'], task['price'])
            print(f"[ALERT_THREAD] sending alert for {task['ticker']}.")

    def run(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.run_async())
        loop.close()
