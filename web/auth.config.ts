import type {NextAuthConfig} from 'next-auth';

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({session, token}) {
      session.user = token.user as never;
      return session;
    },
    // Authorized runs on protected routes
    async authorized({auth, request: {nextUrl}}) {
      console.log(auth);
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;