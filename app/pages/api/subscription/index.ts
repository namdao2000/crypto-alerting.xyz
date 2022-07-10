import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../../lib/utils/validate';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req;
  switch (method) {
    case 'POST':
      const schema = Joi.object({
        subscriptionType: Joi.string().required(),
        email: Joi.string(),
        phone: Joi.string(),
        ticker: Joi.string().required(),
        exchange: Joi.string().required(),
        price: Joi.number(),
        when: Joi.string(),
        notifFrequency: Joi.number().required(),
        disableAfterTrigger: Joi.boolean(),
      });

      await validate(schema, body, res);

      await SubscriptionsService.createSubscription({
        ...body,
        ipAddress: req.headers["x-forwarded-for"]
      });

      res.status(200).send('OK');
      break;
  }
}
