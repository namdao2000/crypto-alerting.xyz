import { NextApiRequest, NextApiResponse } from 'next';
import { SubscriptionsService } from '../../../lib/services/subscriptions.service';
import Joi from 'joi';
import { validate } from '../../../lib/utils/validate';
import { getUserEmail } from '../../../lib/utils/get-user-email';
import { CoinDataService } from '../../../lib/services/coindata.service';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  switch (method) {
    case 'POST':
      const email = await getUserEmail(req, res);
      const numSubscriptions = await SubscriptionsService.getNumSubscriptions(
        email
      );

      if (numSubscriptions >= 15) {
        res
          .status(400)
          .json('You have reached the maximum number of subscriptions');
        // Actually the FE is only able to display the status code text, im working on allow it to display actual messages
        // this is good ^
        // throw new Error('You have reached the maximum number of subscriptions');
        return;
      }

      let schema = Joi.object({
        alertType: Joi.string().required(),
        phone: Joi.string(),
        ticker: Joi.string().required(),
        exchange: Joi.string().required(),
        threshold: Joi.number(),
        alertFrequency: Joi.number().required(),
        disableAfterAlert: Joi.boolean(),
        notificationType: Joi.string().required(),
        lastAlerted: Joi.date().allow(null),
      });

      if (body.alertType !== 'LISTING') {
        schema = schema.keys({
          threshold: Joi.number().required(),
        });
      }

      if (body.notificationType == 'SMS') {
        schema = schema.keys({
          phone: Joi.string().required(),
        });
      }

      await validate(schema, body, res);

      const coin = await CoinDataService.getCoinData(
        body.ticker,
        body.exchange
      );

      if (!coin && body.alertType !== 'LISTING') {
        res.status(400).json('Coin not found on FTX');
        return;
      }

      if (body.alertType === 'LISTING' && coin) {
        res.status(400).json('Coin is already listed');
        return;
      }

      await SubscriptionsService.createSubscription({
        ...body,
        email,
        ipAddress: req.headers['x-forwarded-for'],
      });

      res.status(200).json('OK');
      break;
  }
}
