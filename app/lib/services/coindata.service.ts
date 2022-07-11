import dbConnect from '../utils/mongoose';
import CoinData from '../repositories/coindata.repository';

export type CoinData = {
  ticker: string;
  exchange: string;
  price?: number;
};

export const CoinDataService = {
  async getCoinData(ticker: string, exchange: string): Promise<CoinData> {
    await dbConnect();
    return CoinData.findOne({ ticker: ticker, exchange: exchange });
  },
};
