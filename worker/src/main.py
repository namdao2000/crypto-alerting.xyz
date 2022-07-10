import asyncio

from utils import globals
from price_worker import Worker, AlertThread, PriceThread



if __name__ == '__main__':
    alert_thread = AlertThread().start()
    price_thread = PriceThread().start()

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    worker = Worker()

    loop.run_until_complete(worker.run())
    loop.close()

    globals.update_price_queue.join()
    globals.alert_queue.join()
