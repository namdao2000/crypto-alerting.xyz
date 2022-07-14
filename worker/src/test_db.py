import asyncio

from datetime import datetime, timedelta

from db.pricedb import DBClient

from price_worker import CCXTClient

dummy_data = [
    {
        "exchange": "FTX",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoat()
    },
    {
        "exchange": "BINANCE",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoat()
    },
    {
        "exchange": "OKX",
        "ticker": "BTC",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoat()
    },
    {
        "exchange": "FTX",
        "ticker": "ETH",
        "price": "0.0",
        "lastUpdated": (datetime.now() - timedelta(days=10)).isoat()
    }
]


# prepare list of dicts with data to insert to mongo


async def insert_price(client: DBClient, doc: dict):
    # insert price to mongo
    response = await client.price_cache.update_one({"exchange": doc['exchange'], "ticker": doc['ticker']}, {"$set": {
        "enabled": True,
    }})
    return response


async def async_main():
    client = DBClient(host="localhost", test=True)
    for data in dummy_data:
        print("enabling price: ", data)
        await insert_price(client, data)













if __name__ == '__main__':
    asyncio.run(async_main())
