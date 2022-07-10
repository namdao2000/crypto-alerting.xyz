import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../../lib/utils/validate';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  switch (method) {
    case 'POST':
      const schema = Joi.object({
        alertType: Joi.string().required(),
        email: Joi.string(),
        phone: Joi.string(),
        ticker: Joi.string().required(),
        exchange: Joi.string().required(),
        threshold: Joi.number(),
        alertFrequency: Joi.number().required(),
        disableAfterAlert: Joi.boolean(),
      });

      await validate(schema, body, res);

      await SubscriptionsService.createSubscription({
        ...body,
        ipAddress: req.headers['x-forwarded-for'],
      });

      res.status(200).send('OK');
      break;
  }
}
