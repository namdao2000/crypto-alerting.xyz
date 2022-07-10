import { NextApiRequest, NextApiResponse } from 'next';
import { getUserEmail } from '../../lib/utils/get-user-email';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method, } = req
  switch (method) {
    case 'GET': {
      const email = await getUserEmail(req, res)

      res.status(200).json(email);
    }

  }

}
