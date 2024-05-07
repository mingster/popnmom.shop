import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';

import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import LineProdiver from 'next-auth/providers/line';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
//import EmailProvider from "next-auth/providers/email"
/*
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
 */
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import prismadb from '@/lib/prismadb';

// https://next-auth.js.org/configuration/options

const prisma = new PrismaClient();

const getUser = async (email: string) =>
  await prisma.user.findFirst({
    where: {
      email,
    },
  });

export const getToken = (test: string) => {
  return process.env.NEXTAUTH_SECRET + test;
};

// ANCHOR https://github.com/danyel117/wanda/blob/main/pages/api/auth/%5B...nextauth%5D.ts
const getNextAuthOptionsOLD = (req: NextApiRequest) =>
  ({
    callbacks: {
      async session({ session, user }) {
        const newSession = await prisma.session.findFirst({
          where: {
            userId: user.id,
          },
          include: {
            user: {
              include: {
                //roles: true,
              },
            },
          },
        });

        return {
          ...session,
          user: {
            ...session.user,
            id: newSession?.user.id,
            roles: newSession?.user.role,
          },
        };
      },
      async signIn({ user, account, email }) {
        return true;
        /*

// if the user has an active session, let it through
        if (await getSession({ req })) {
          return true;
        }
        // if the email was not provided, return false
        if (!account) {
          console.error('no account info');
          return false;
        }

        // if the email was not provided, return false
        if (!user.email) {
          console.error('no email');
          //return false;
        }

        // if a verification request email comes, let it through
        if (account.provider === 'email' && email?.verificationRequest) {
          return true;
        }

        // fetch the account of the user
        const existingAccount = await prisma.account.findFirst({
          where: {
            providerAccountId: account.providerAccountId,
          },
        });

        // if the account exists, let it through
        if (existingAccount) {
          return true;
        }
        // get the user
        const existingUser = await getUser(user.email);
        // if the user exists but it does not have accounts, create the account and let it through
        if (existingUser) {
          await prisma.account.create({
            data: {
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
              user: {
                connect: {
                  email: user.email ?? '',
                },
              },
            },
          });
          return true;
        }
        // if the user doesn't exist, create the user, create the account and let it through
        try {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              accounts: {
                create: {
                  provider: account.provider,
                  type: account.type,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  scope: account.scope,
                  token_type: account.token_type,
                  id_token: account.id_token,
                },
              },
            },
          });
          return true;
        } catch {
          return false;
        }
*/
      },
    },
    adapter: PrismaAdapter(prisma) as any,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 365 * 24 * 60 * 60, // 365 days
      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
      // The session token is usually either a random UUID or string, however if you
      // need a more customized session token string, you can define your own generate function.
      //generateSessionToken: () => {
      //    return randomUUID?.() ?? randomBytes(32).toString("hex")
      //}
    },
    providers: [
      /*
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: 'clpeskcno000089avfp9mig0x',
          name: 'Ming the man',
          email: 'mingster.tsai@gmail.com',
          image: 'https://i.pravatar.cc/150?u=m@ming.com',
          role: 'ADMIN',
        };
        return user;
      },
    }),
    */
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 2 * 60 * 60, // How long email links are valid for (default 24h)
        generateVerificationToken: async () => {
          return getToken(nanoid());
        },
      }),
      /*
    https://next-auth.js.org/providers/google
    https://console.cloud.google.com/?project=legod-397304
    */
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
      /*
    https://legod.vercel.app/api/auth/callback/facebook
    http://localhost:3001/api/auth/callback/facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
     */

      // https://blog.errorbaker.tw/posts/ruofan/next-auth/
      // https://developers.line.biz/console/channel/2000556006
      LineProdiver({
        clientId: process.env.LINE_ID,
        clientSecret: process.env.LINE_SECRET,
      }),
    ],
  }) as NextAuthOptions;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 365 * 24 * 60 * 60, // 365 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    //generateSessionToken: () => {
    //    return randomUUID?.() ?? randomBytes(32).toString("hex")
    //}
  },
  providers: [
    /*
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: 'clpeskcno000089avfp9mig0x',
          name: 'Ming the man',
          email: 'mingster.tsai@gmail.com',
          image: 'https://i.pravatar.cc/150?u=m@ming.com',
          role: 'ADMIN',
        };
        return user;
      },
    }),
    */
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 2 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    /*
    https://next-auth.js.org/providers/google
    https://console.cloud.google.com/?project=legod-397304
    */
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    /*
    https://legod.vercel.app/api/auth/callback/facebook
    http://localhost:3001/api/auth/callback/facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
     */

    // https://blog.errorbaker.tw/posts/ruofan/next-auth/
    // https://developers.line.biz/console/channel/2000556006
    LineProdiver({
      clientId: process.env.LINE_ID,
      clientSecret: process.env.LINE_SECRET,
    }),
  ],
  /*
  pages: {
    
      signIn: '/signin',
      signOut: '/signout',
      error: '/auth/error', // Error code passed in query string as ?error=
      verifyRequest: '/verify-request', // (used for check email message)
      newUser: '/signup' // New users will be directed here on first sign in (leave the property out if not of interest)
  },   
  */
  //Callbacks are asynchronous functions you can use to control what happens when an action is performed.
  callbacks: {
    async signIn({ user, account, email }) {
      if (process.env.NODE_ENV === 'development') {
        if (account) console.log('signIn account: ' + JSON.stringify(account));
        if (user) console.log('signIn user: ' + JSON.stringify(user));
        if (email) console.log('signIn email: ' + JSON.stringify(email));
      }

      return true;

      /*
signIn account: {"provider":"line","type":"oauth","providerAccountId":"Ud1753305b683cb1f5382dc195cffac67","access_token":"eyJhbGciOiJIUzI1NiJ9.RLaO56heD1NSLzaPE0T3FIaWqFzG06pU7o2oSN10NMcD4yhTH3NeMkr5gJelevlTtQp5mmeeBJxh5as8ziHoUUZGb7ruNTYK0IsJCU-DLVjyE4MOsGg-5lSlQ9LpVM5MKdVFVtJf1a20-4ZJy38c6otHiqFdi9rVNKfrizLuTyY.qfbZzDzfz5EIiybolS1uDLmSqL07xlZLnKlq-BGGDwc","token_type":"Bearer","refresh_token":"nYE8lqC4f2LpA2bFj1u1","expires_at":1707300538,"scope":"openid profile","id_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVWQxNzUzMzA1YjY4M2NiMWY1MzgyZGMxOTVjZmZhYzY3IiwiYXVkIjoiMjAwMDU1NjAwNiIsImV4cCI6MTcwNDcxMjEzOCwiaWF0IjoxNzA0NzA4NTM4LCJhbXIiOlsibGluZXNzbyJdLCJuYW1lIjoibWluZyB0c2FpIOiUoemKmOWNhyIsInBpY3R1cmUiOiJodHRwczovL3Byb2ZpbGUubGluZS1zY2RuLm5ldC8waHc5MUpoZ1lxS0JZTU16cTh3bHhYUVRCMkpudDdIUzVlZEFCaElDNWtJM1FrQUc1R01GQm5keTVuSmlaeEMyY1VNbHhrZUM0eGNIRnoifQ.PLK5hEDYY108PAfRpiGtR_BrNzrz3ljATQHV_q9gnZM"}
signIn user: {"id":"clqzb4l560000y896zp0nc6fu","name":"ming tsai 蔡銘升","email":null,"emailVerified":null,"image":"https://profile.line-scdn.net/0hw91JhgYqKBYMMzq8wlxXQTB2Jnt7HS5edABhIC5kI3QkAG5GMFBndy5nJiZxC2cUMlxkeC4xcHFz","createdAt":"2024-01-04T14:33:12.714Z","updatedAt":"2024-01-04T14:33:12.714Z","role":"USER"}

      // if the email was not provided, return false
      if (!account) {
        return false;
      }

      // if the email was not provided, return false
      if (!user.email) {
        return false;
      }

      // if a verification request email comes, let it through
      if (account.provider === 'email' && email?.verificationRequest) {
        return true;
      }

      // fetch the account of the user
      const existingAccount = await prisma.account.findFirst({
        where: {
          providerAccountId: account.providerAccountId,
        },
      });

      // if the account exists, let it through
      if (existingAccount) {
        return true;
      }


      // get the user
      const existingUser = await getUser(user.email);
      // if the user exists but it does not have accounts, create the account and let it through
      if (existingUser) {
        await prisma.account.create({
          data: {
            provider: account.provider,
            type: account.type,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            expires_at: account.expires_at,
            scope: account.scope,
            token_type: account.token_type,
            id_token: account.id_token,
            user: {
              connect: {
                email: user.email ?? '',
              },
            },
          },
        });
        return true;
      }

      // if the user doesn't exist, create the user, create the account and let it through
      try {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                provider: account.provider,
                type: account.type,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                scope: account.scope,
                token_type: account.token_type,
                id_token: account.id_token,
              },
            },
          },
        });
        return true;
      } catch {
        return false;
      }
      */
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      /*
      if (session) console.log('session: ' + JSON.stringify(session));
      if (user) console.log('user: ' + JSON.stringify(user));
      if (token) console.log('token: ' + JSON.stringify(token));
      */

      if (session.user && session.user.email) {
        //console.log('access_token: ' + access_token);
        const user = await prismadb.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        //ANCHOR - define session.user type in @/types/next.auth.d.ts
        session.user.id = user?.id + '';
        session.user.role = user?.role ?? '';
        //console.log('session: ' + JSON.stringify(session));
        //console.log('token: ' + JSON.stringify(token));
        //console.log('user: ' + JSON.stringify(user));

        //session.user.id = token.sub + '';
        return Promise.resolve(session);
      } else {
        session = {
          ...session,
          user: {
            ...session.user,
            id: token.id + '',
          },
        };

        return session;
      }
    },

    async jwt({ token, user, account, profile }) {
      // Persist the OAuth access_token and/or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }

      return token;
    },
  },
  debug: true,
};
