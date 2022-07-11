import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../lib/utils/validate';
import { getUserEmail } from '../../lib/utils/get-user-email';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'GET':
      const email = await getUserEmail(req, res);
      const subscriptions = await SubscriptionsService.getSubscriptions(email);
      res.status(200).json(subscriptions);
      return subscriptions;
  }
}
