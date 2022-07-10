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
MONGO_URL = os.getenv('MONGO_URL')
MONG_USER = os.getenv('MONGO_URL')


class DBClient:

    def __init__(self, host: str = "mongo", test=False):
        self.client = motor_asyncio.AsyncIOMotorClient(f'mongodb://{host}:27017/', username='admin',
                                                       password='admin')

        self.db = self.client["database"]

        # # if dev env, drop collection
        # if os.getenv('ENV') == 'dev':
        if not test:
            self.db["subscriptions"].drop()
            self.db["price_cache"].drop()

        self.subscription_table = self.db["subscriptions"]
        self.price_cache= self.db["price_cache"]

    async def get_price(self, ticker: str, exchange: str) -> str:
        doc = await self.price_cache.find_one({'exchange': exchange, 'ticker': ticker})
        if doc is None:
            return None
        return doc['price']

    async def update_price(self, ticker: str, exchange: str, price: str) -> None:
        doc = create_price(ticker, exchange, price)
        await self.price_cache.update_one({'exchange': exchange, 'ticker': f'{ticker}'},
                                          {'$set': doc}, upsert=True)

    async def get_subscriptions(self, ticker: str, exchange: str) -> list:
        docs = await self.subscription_table.find({'ticker': ticker, 'exchange': exchange}).to_list(length=None)
        return docs

    async def update_subscription(self, subscription: dict) -> None:
        await self.subscription_table.update_one({'_id': subscription['_id']},
                                                 {'$set': subscription}, upsert=True)

    async def get_coin_list(self) -> list:
        docs = await self.price_cache.find().to_list(length=None)
        return docs
