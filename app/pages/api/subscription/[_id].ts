import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../../lib/utils/validate';
import { getUserEmail } from '../../../lib/utils/get-user-email';
import React from 'react';

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
        enabled: Joi.boolean().required(),
      });
      await validate(schema, body, res);
      await SubscriptionsService.updateSubscription(body);
      res.status(200).send('OK');
      break;
  }
}
