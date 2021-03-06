import dbConnect from '../utils/mongoose';
import CoinData from '../repositories/coindata.repository';
import { Schema } from 'mongoose';
const ObjectId = require('mongodb').ObjectID;

export type CoinData = {
  _id: string;
  ticker: string;
  exchange: string;
  price?: number;
  enabled?: boolean;
};

export const CoinDataService = {
  async getCoinData(ticker: string, exchange: string): Promise<CoinData> {
    await dbConnect();
    return CoinData.findOne({ _id: `${exchange}_${ticker}` });
  },

  async getCoins(ticker: string, exchange: string): Promise<CoinData[]> {
    await dbConnect();
    const regex = new RegExp('^' + ticker, 'i');
    return CoinData.find({exchange, ticker:regex}  );
  }

};
