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

  async enableCoin(id: string): Promise<void> {
    await dbConnect();
    await CoinData.updateOne(
      { _id: id },
      { $set: { enabled: true } },
      { upsert: true }
    );
  },
};
