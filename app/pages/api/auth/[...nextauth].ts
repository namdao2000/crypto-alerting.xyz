import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/utils/mongodb';

export default NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.SECRET,
  session: { strategy: 'jwt' as any },
  callbacks: {
    async session({ session, user, token }) {
      session.user = user;
      session.token = token;
      return session;
    },
    async jwt({ token, user }) {
      // userId can now be accessed from token.userId
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
});