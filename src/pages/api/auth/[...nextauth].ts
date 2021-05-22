import NextAuth from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import prisma from "../../../lib/db";
import { LoginSchema } from "../../../schemas/AuthSchema";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(payload: Record<string, string>, req) {
        const input = LoginSchema.parse({
          email: payload.email,
          password: payload.password,
          from: Number(payload.from),
          organizationId: payload.organizationId,
        });

        return prisma.user.findFirst({
          where: {
            email: input.email,
            password: input.password,
            organizationId: input.organizationId,
          },
        });
      },
    }),
  ],

  callbacks: {
    async session(session, token) {
      const user = await prisma.user.findUnique({
        where: {
          id: token.sub as string,
        },
        select: {
          id: true,
          email: true,
          role: true,
          organization: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      if (user) {
        return {
          user,
          expires: session.expires,
        };
      }

      return session;
    },
  },

  session: {
    jwt: true,
  },

  secret: process.env.NEXTAUTH_SECRET,
  adapter: Adapters.Prisma.Adapter({ prisma }),
});
