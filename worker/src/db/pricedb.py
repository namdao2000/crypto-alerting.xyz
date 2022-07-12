from motor import motor_asyncio

import os
import dotenv
import datetime


def create_price(ticker: str, exchange: str, price: str) -> dict:
    curr_time: datetime = datetime.datetime.now().isoformat()
    return {
        'exchange': exchange,
        'ticker': f'{ticker}',
        'price': price,
        'lastUpdated': curr_time
    }


dotenv.load_dotenv()


class DBClient:

    def __init__(self, host: str = "mongo", test=False):
        dotenv.load_dotenv()
        host = os.getenv('MONGODB_URI')
        user = os.getenv('MONGO_INITDB_ROOT_USERNAME')
        password = os.getenv('MONGO_INITDB_ROOT_PASSWORD')
        db = os.getenv('MONGO_INITDB_DATABASE')

        self.client = motor_asyncio.AsyncIOMotorClient(host, authSource='admin')

        self.db = self.client[db]
        self.subscription_table = self.db["subscriptions"]
        self.price_cache = self.db["coinData"]

    async def get_price(self, ticker: str, exchange: str):
        doc = await self.price_cache.find_one({'exchange': exchange, 'ticker': ticker})
        if doc is None:
            return None
        return doc['price']

    async def update_price(self, id: str, price: float) -> None:
        await self.price_cache.update_one({'_id': id},
                                          {'$set': {"price": price,
                                                    "lastUpdated": datetime.datetime.now().isoformat()}})

    async def get_subscriptions(self, _id: str) -> list:
        exchange, ticker = [x.strip() for x in _id.split('_')]
        docs = await self.subscription_table.find({'exchange': exchange, 'ticker': ticker}).to_list(length=None)
        return docs

    async def get_all_subscriptions(self) -> list:
        docs = await self.subscription_table.find().to_list(length=None)
        return docs


    async def delete_subscription(self, subscription: dict) -> None:
        await self.subscription_table.delete_one({'_id': subscription['_id']})

    async def update_subscription(self, subscription: dict) -> None:
        await self.subscription_table.update_one({'_id': subscription['_id']},
                                                 {'$set': subscription}, upsert=True)

    async def get_coin_list(self, **kwargs) -> list:
        docs = await self.price_cache.find(kwargs).to_list(length=None)
        return docs

    async def add_coin(self, exchange: str, symbol: str) -> None:
        await self.price_cache.update_one({
            '_id': f'{exchange}_{symbol}'},
            {'$set': {
                '_id': f'{exchange}_{symbol}',
                'exchange': exchange,
                'ticker': symbol,
                'price': None,
                'lastUpdated': None,
                'enabled': False
            }
            },
            upsert=True)

    async def toggle_coin(self, _id: str, enable: bool) -> None:
        await self.price_cache.update_one({
            '_id': _id},
            {'$set': {
                'enabled': enable
            }
            })
