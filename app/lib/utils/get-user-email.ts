import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export const getUserEmail = async (req: NextApiRequest, res: NextApiResponse): Promise<string> => {
  const token = await getToken({
    req,
    secret: process.env.SECRET,
  });

  if (!token?.email) {
    res.status(401).send('User not authenticated');
    throw new Error('User not authenticated');
  }

  return token?.email as string;
};