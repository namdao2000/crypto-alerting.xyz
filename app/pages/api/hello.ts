import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.SECRET });
  res.status(200).json(token?.email);
}
