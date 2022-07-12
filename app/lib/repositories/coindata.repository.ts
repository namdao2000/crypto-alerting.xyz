import * as mongoose from 'mongoose';

const CoinDataSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    lastUpdated: {
      type: Date,
    },
    __v: {
      type: Number,
    },
    ticker: {
      type: String,
      required: true,
    },
    exchange: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
    },
  },
  { collection: 'coinData' }
);

export default mongoose.models.CoinData ||
  mongoose.model('CoinData', CoinDataSchema);
