import dbConnect from '../utils/mongoose';
import Subscriptions from '../repositories/subscriptions.repository';

export type Subscription = {
  subscriptionType: string;
  email?: string;
  phone?: string;
  ticker: string;
  exchange: string;
  price?: number;
  when?: string;
  notifFrequency: number;
  ipAddress?: string;
  disableAfterTrigger?: boolean;
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
  async deleteSubscription(_id: string, email: string): Promise<void> {
    await dbConnect();
    await Subscriptions.deleteOne({ _id, email });
  },

  async updateSubscription(
    _id: string,
    email: string,
    data: Partial<Subscription>
  ): Promise<void> {
    await dbConnect();
    await Subscriptions.updateOne({ _id, email }, data);
  },
};
