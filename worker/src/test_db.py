import asyncio

from datetime import datetime, timedelta

from db.pricedb import DBClient

from price_worker import CCXTClient

dummy_data = [
    {
        "exchange": "FTX",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoformat()
    },
    {
        "exchange": "BINANCE",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoformat()
    },
    {
        "exchange": "OKX",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoformat()
    },
    {
        "exchange": "FTX",
        "ticker": "ETH",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoformat()
    }
]


# prepare list of dicts with data to insert to mongo


async def insert_price(client: DBClient, doc: dict):
    # insert price to mongo
    response = await client.price_cache.update_one({"exchange": doc['exchange'], "ticker": doc['ticker']}, {"$set": {
        "enabled": True,
    }})
    return response


class UpdateAll:
    def __init__(self):
        self.ccxt_client = None
        self.db_client = None

    async def update_all_prices(self):
        self.ccxt_client = CCXTClient()
        self.db_client = DBClient(test=True, host="mongo")
        # TODO for all exchanges, since currently ABOVE and BELOW alerts are only supported with FTX this is ok
        print("[COIN_THREAD] updating all prices..")
        tasks = []
        markets = self.ccxt_client.clients['FTX'].fetch_markets()
        added = set()
        prices = []

        for coin in markets:
            if coin['spot'] and coin['quoteId'].lower() in ['usd', 'usdt'] and coin['base'] not in added:
                prices.append({"ticker": coin['base'].upper(), "price": coin["info"]["price"]})
                added.add(coin['base'])

        for coin in prices:
            if 'HEDGE' not in coin['ticker'] and 'MOVE' not in coin['ticker'] and 'BULL' not in coin['ticker'] \
                    and 'BEAR' not in coin['ticker'] and 'HALF' not in coin['ticker']:
                tasks.append(self.db_client.update_price(f"FTX_{coin['ticker']}", float(coin['price'])))
        await asyncio.gather(*tasks)


async def async_main():
    # client = DBClient(host="localhost", test=True)
    # for data in dummy_data:
    #     print("enabling price: ", data)
    #     await insert_price(client, data)
    update_all = UpdateAll()
    await update_all.update_all_prices()


if __name__ == '__main__':
    asyncio.run(async_main())
