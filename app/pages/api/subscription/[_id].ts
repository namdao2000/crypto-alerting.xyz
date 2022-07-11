import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../../lib/utils/validate';
import { getUserEmail } from '../../../lib/utils/get-user-email';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    query: { _id },
  } = req;
  const email = await getUserEmail(req, res);

  switch (method) {
    case 'DELETE':
      await SubscriptionsService.deleteSubscription(body);
      res.status(200).send('OK');
      break;

    case 'PATCH':
      const schema = Joi.object({
        _id: Joi.string().required(),
        __v: Joi.number(),
        alertType: Joi.string(),
        email: Joi.string(),
        phone: Joi.string(),
        ticker: Joi.string(),
        exchange: Joi.string(),
        threshold: Joi.number(),
        alertFrequency: Joi.number(),
        disableAfterAlert: Joi.boolean(),
        enabled: Joi.boolean(),
        notificationType: Joi.string(),
        lastAlerted: Joi.date().allow(null),
      });
      await validate(schema, body, res);
      await SubscriptionsService.updateSubscription(body);
      res.status(200).send('OK');
      break;
  }
}
