import dbConnect from '../utils/mongoose';
import Subscriptions from '../repositories/subscriptions.repository';
import { CoinData, CoinDataService } from './coindata.service';

export type Subscription = {
  _id?: string;
  __v?: any;
  alertType: string;
  email?: string;
  phone?: string;
  ticker: string;
  exchange: string;
  threshold?: number;
  alertFrequency: number;
  ipAddress?: string;
  disableAfterAlert?: boolean;
  enabled?: boolean;
  lastAlerted?: Date;
  notificationType: string;
};

export const SubscriptionsService = {
  async createSubscription(data: Subscription): Promise<void> {
    await dbConnect();
    await Subscriptions.create(data);
  },

  async getSubscriptions(email: string): Promise<any[]> {
    await dbConnect();
    return await Subscriptions.find({ email }).exec();
  },
  async deleteSubscription(data: Partial<Subscription>): Promise<void> {
    await dbConnect();
    await Subscriptions.deleteOne({ _id: data._id });
  },

  async updateSubscription(data: Partial<Subscription>): Promise<void> {
    await dbConnect();
    await Subscriptions.updateOne({ _id: data._id }, data);
  },

  async getNumSubscriptions(email: string): Promise<Number> {
    await dbConnect();
    return Subscriptions.countDocuments({ email: email });
  },
};
