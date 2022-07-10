from datetime import timedelta
from datetime import datetime

from .exceptions import ExchangeSymbolNotImplemented


def is_stale(last_updated: str, expiry_delta: timedelta) -> bool:

    last_updated_dt = datetime.strptime(last_updated, '%Y-%m-%dT%H:%M:%S.%f')

    if last_updated_dt < datetime.now() - expiry_delta:
        return True
    return False


def convert_symbol(coin: str, exchange: str) -> str:
    usdt_exchanges = ['BINANCE', 'BITTREX', 'HUOBI', 'BITMEX']
    usd_exchanges = ['FTX', 'OKX']
    if exchange in usdt_exchanges:
        return coin + '/USDT'
    elif exchange in usd_exchanges:
        return coin + '/USD'
    else:
        raise ExchangeSymbolNotImplemented(coin, exchange)
