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
            "KRAKEN": ccxt.kraken(),
        }
        map(lambda x: x.load_markets(), self.clients.values())

    def get_price_helper(self, coin, exchange: str, ticker: str):
        price = None
        try:
            price = self.clients[exchange].fetch_ticker(ticker)['last']
        except:
            try:
                new_ticker = convert_symbol(coin, exchange, convert_opposite=True, ticker=ticker)
                price = self.clients[exchange].fetch_ticker(new_ticker)['last']
            except Exception as e:
                return None

        return float(price)

    def get_price(self, coin: dict):
        ticker: str = convert_symbol(coin['ticker'], coin['exchange'])

        price = None
        exchanges = self.clients.keys()
        try:
            price = self.get_price_helper(coin, coin['exchange'], ticker)
        except:

            for exchange in exchanges:
                if exchange != coin['exchange']:
                    price = self.get_price_helper(coin, exchange, ticker)
                    if price is not None:
                        break

        return price


def handle_alert_task(subscription: dict, price: str):

    if subscription['_id'] in globals.currently_updating_subscriptions:
        return

    _price = None
    if price is not None:
        _price = float(price)

    alert_task = {
        'subscription': subscription,
        'price': _price
    }

    # Check if alert has been disabled
    if subscription['enabled'] is False:
        return
    # Check if last alerted has been sent in the last 5 minutes
    if not is_stale(subscription['lastAlerted'], timedelta(hours=subscription['alertFrequency'])):
        return


    # If alert is of type listing and a price has been retrieved
    if subscription['alertType'] == "LISTING" and price is not None:
        globals.currently_updating_subscriptions.add(subscription['_id'])
        globals.alert_queue.put(alert_task)

    # Below case
    if subscription['alertType'] == "BELOW" and price is not None:
        if price < float(subscription['threshold']):
            globals.currently_updating_subscriptions.add(subscription['_id'])
            globals.alert_queue.put(alert_task)
    # Above case
    if subscription['alertType'] == "ABOVE" and price is not None:
        if _price > float(subscription['threshold']):
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
                subscriptions = await self.db.get_subscriptions(coin['_id'])

                if not subscriptions:
                    # Switches coin off from the db
                    if coin['enabled'] is True:
                        print(f"[WORKER] disbling coin: {coin['ticker']}")
                        await self.db.toggle_coin(coin['_id'], enable=False)
                    continue

                if coin['enabled'] is False:
                    print(f"[WORKER] enabling coin: {coin['ticker']}")
                    await self.db.toggle_coin(coin['_id'], enable=True)


                if coin['_id'] in globals.currently_updating_prices:
                    continue

                if coin['enabled'] is True and is_stale(coin['lastUpdated'], timedelta(seconds=30)):
                    globals.currently_updating_prices.add(coin["_id"])
                    globals.update_price_queue.put(coin)
                    continue

                for subscription in subscriptions:
                    handle_alert_task(subscription, price=coin['price'])

            await asyncio.sleep(1)


class PriceThread(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self, daemon=True)
        self.db_client = None
        self.ccxt_client = None

    async def add_symbols_to_db(self):
        for exchange in self.ccxt_client.clients.keys():
            tasks = []
            symbols = None
            while True:
                try:
                    query = {'exchange': exchange}
                    current_coins = await self.db_client.get_coin_list(**query)
                    current_symbols = [coin['_id'] for coin in current_coins]
                    markets = self.ccxt_client.clients[exchange].fetch_markets()
                    spot_coins = {coin['base'] for coin in markets if coin['spot']
                                  and coin['quoteId'].lower() in ['usd', 'usdt']}
                    _symbols = {x.upper() for x in spot_coins}
                    symbols = {x for x in _symbols if 'HEDGE' not in x
                               and 'BULL' not in x
                               and 'BEAR' not in x
                               and 'HALF' not in x}

                    for symbol in symbols:
                        if f"{exchange}_{symbol}" not in current_symbols:
                            tasks.append(self.db_client.add_coin(exchange, symbol))

                    break
                except Exception as e:
                    print(e)
                    await asyncio.sleep(1)

            for symbol in symbols:
                tasks.append(self.db_client.add_coin(symbol, exchange))

            await asyncio.gather(*tasks)

    async def run_async(self):
        self.db_client: DBClient = DBClient()
        self.ccxt_client: CCXTClient = CCXTClient()
        asyncio.get_event_loop()

        await self.add_symbols_to_db()
        while True:
            task = globals.update_price_queue.get()
            print(f"[COIN_THREAD] updating {task['ticker']}'s price on {task['exchange']}. {datetime.datetime.now()}")
            price = self.ccxt_client.get_price(task)  # get price from ccxt
            await self.db_client.update_price(task['_id'], price)
            globals.currently_updating_prices.remove(f'{task["_id"]}')

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

            if subscription['notificationType'] == "EMAIL":
                alert_sent = self.email_client.send_email(subscription, price)

            if subscription['notificationType'] == "SMS":
                alert_sent = self.sms_client.send_sms(subscription, price)
                if not alert_sent:
                    print("[ALERT_THREAD] SMS failed to send. ?? invalid number")
                    await self.db_client.delete_subscription(subscription)


            if alert_sent:
                if subscription['disableAfterAlert'] is True:
                    await self.db_client.delete_subscription(subscription)
                else:
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
