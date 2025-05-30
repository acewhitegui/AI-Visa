import {DefaultSession} from 'next-auth';
import {DefaultJWT} from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      username: string;
      first_name: string;
      last_name: string;
      access_token: string;
      expired_at: number;
    } & DefaultSession['user'];
  }

  interface User {
    first_name: string;
    last_name: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    email: string;
    first_name: string;
    last_name: string;
  }
}