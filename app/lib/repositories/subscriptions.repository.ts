import * as mongoose from 'mongoose';

const SubscriptionsSchema = new mongoose.Schema({
  alertType: {
    type: String,
    enum: ['PRICE', 'LISTING', 'ABOVE'],
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  ticker: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
  },

  alertFrequency: {
    type: Number, // In seconds
    required: true,
  },
  lastAlerted: {
    type: Date,
  },
  ipAddress: {
    type: String, // Prevent people from creating too many subscriptions. Will implement later.
  },
  disableAfterAlert: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.Subscriptions ||
  mongoose.model('Subscriptions', SubscriptionsSchema);
