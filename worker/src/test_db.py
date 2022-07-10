import asyncio

from datetime import datetime, timedelta

from db.pricedb import DBClient

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
    response = await client.price_cache.insert_one(doc)
    return response


async def async_main():
    client = DBClient(host="localhost", test=True)
    for data in dummy_data:
        print("inserting price: ", data)
        await insert_price(client, data)

    data = await client.db["price_cache"].find().to_list(length=None)
    print(data)


if __name__ == '__main__':
    asyncio.run(async_main())
