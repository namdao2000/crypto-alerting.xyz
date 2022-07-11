import asyncio

from datetime import datetime, timedelta

from db.pricedb import DBClient

jeremy_no = "+61456001525"
nam_no = "+61403890999"
anthony_no = "+61422174234"

jeremy_email = "jrmyok@pm.me"
jeremy_gmail = "okjeremy1@gmail.com"

dummy_data = [
    {
        "email": jeremy_gmail,
        "phone": nam_no,
        "ticker": "BTC",
        "exchange": "BINANCE",
        "threshold": "0.0",
        "alertType": "ABOVE",
        "disableAfterAlert": True,
        "enabled": True,
        "lastAlerted": None,
        "notificationType": "EMAIL"
    },
    {
        "email": jeremy_gmail,
        "phone": nam_no,
        "ticker": "ETH",
        "exchange": "FTX",
        "threshold": "100000.0",
        "alertType": "BELOW",
        "disableAfterAlert": False,
        "enabled": True,
        "lastAlerted": None,
        "alertFrequency": 10,
        "notificationType": "EMAIL"

    },
]


# prepare list of dicts with data to insert to mongo


async def insert_subscriptions(client: DBClient, doc: dict):
    # insert price to mongo
    response = await client.subscription_table.insert_one(doc)
    return response


async def async_main():
    client = DBClient(host="localhost", test=True)
    for data in dummy_data:
        print("inserting price: ", data)
        await insert_subscriptions(client, data)


if __name__ == '__main__':
    asyncio.run(async_main())
