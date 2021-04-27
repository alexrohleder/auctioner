import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async (session, user) => {
      session.sub = user.sub;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
