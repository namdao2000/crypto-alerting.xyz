class ExchangeSymbolNotImplemented(Exception):
    def __init__(self, coin: str, exchange: str):
        self.exchange = exchange
        self.coin = coin
        self.message = f'symbol conversion for {coin} on {exchange} is not implemented'
        super().__init__(self.message)

    def __str__(self):
        return f'[{self.coin} - {self.exchange}] -> {self.message}'