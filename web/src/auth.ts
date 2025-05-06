import NextAuth from 'next-auth';
import {authConfig} from '../auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import {login} from "@/app/library/services/auth_service";

export const {auth, signIn, signOut, handlers} = NextAuth({
  ...authConfig,
  providers: [
    Credentials(
      {
        name: 'Credentials',
        // Define the credentials schema
        credentials: {
          username: {label: "username", type: "text"},
          password: {label: "password", type: "password"}
        },
        async authorize(credentials) {
          let user = null
          const parsedCredentials = z
            .object({username: z.string(), password: z.string().min(6)})
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error("Invalid credentials format:", parsedCredentials.error.errors);
            return null;
          }

          const {username, password} = parsedCredentials.data;
          user = await login(username, password);
          if (!user) return null;

          return user;
        },
      }),]
});