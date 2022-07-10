import * as mongoose from 'mongoose';

const SubscriptionsSchema = new mongoose.Schema({
  subscriptionType: {
    type: String,
    enum: ['PRICE', 'LISTING'],
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
    required: true
  },
  exchange: {
    type: String,
    required: true
  },
  price: {
    type: Number,
  },
  when: {
    type: String,
    enum : ['ABOVE', 'BELOW'],
  },
  notifFrequency: {
    type: Number, // In seconds
    required: true
  },
  lastReminded: {
    type: Date,
  },
  ipAddress: {
    type: String, // Prevent people from creating too many subscriptions. Will implement later.
  },
  disableAfterTrigger: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  }
})

export default mongoose.models.Subscriptions || mongoose.model('Subscriptions', SubscriptionsSchema)