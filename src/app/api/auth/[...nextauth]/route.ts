import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// use authOptions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/*
// use getNextAuthOptions
import { NextApiRequest, NextApiResponse } from 'next';
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getNextAuthOptions(req));
}
*/
