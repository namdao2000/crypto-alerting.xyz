import { NextApiRequest, NextApiResponse } from 'next';
import { CoinDataService } from '../../../lib/services/coindata.service';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    query: { ticker, exchange },
  } = req;

  switch (method) {
    case 'GET':
      const data = await CoinDataService.getCoinData(
        ticker as string,
        exchange as string
      );
      if (data === null) {
        res.status(404).json({ message: 'Not found' });
        return;
      } else {
        res.status(200).json('ok');
      }
      return data;
  }
}
