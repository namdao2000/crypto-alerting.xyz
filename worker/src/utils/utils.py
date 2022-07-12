from datetime import timedelta
from datetime import datetime

from .exceptions import ExchangeSymbolNotImplemented


def is_stale(last_updated: str, expiry_delta: timedelta) -> bool:

    if last_updated is None:
        return True

    last_updated_dt = datetime.strptime(last_updated, '%Y-%m-%dT%H:%M:%S.%f')

    if last_updated_dt < datetime.now() - expiry_delta:
        return True
    return False


def convert_symbol(coin: str, exchange: str, convert_opposite: bool = False, ticker: str = None) -> str:

    if convert_opposite:
        if "/USD" in ticker:
            return coin + '/USDT'
        else:
            return coin + '/USD'

    usdt_exchanges = ['BINANCE', 'BITTREX', 'HUOBI', 'BITMEX', "KRAKEN"]
    usd_exchanges = ['FTX', 'OKX']
    if exchange in usdt_exchanges:
        return coin + '/USDT'
    elif exchange in usd_exchanges:
        return coin + '/USD'
    else:
        raise ExchangeSymbolNotImplemented(coin, exchange)
