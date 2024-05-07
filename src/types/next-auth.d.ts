import 'next-auth/jwt';
import NextAuth, { DefaultSession } from 'next-auth';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Profile {
    email_verified: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: string;
      /** Oauth access token */
      token?: accessToken;
    } & DefaultSession['user'];
  }
}
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    accessToken?: string;
    providerId?: string;
    userRole?: 'user';
  }
}

declare module 'next-auth/providers' {
  interface providers {
    provider: provider[];
  }
  interface provider {
    id?: string;
    name?: string;
  }
}
