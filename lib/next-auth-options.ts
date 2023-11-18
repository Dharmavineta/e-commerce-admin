import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import prismaDB from "./db";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

type User = { id: string };
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any) {
        try {
          const user = await prismaDB.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
          if (!user) {
            return null;
          }

          const isPassword = await bcrypt.compare(
            credentials.password,
            user.password!
          );

          if (!isPassword) {
            return null;
          }
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }
        if (account?.provider === "google") {
          const isUser = await prismaDB.user.findUnique({
            where: {
              email: user.email!,
            },
          });
          if (isUser) {
            return true;
          }
          const newUser = await prismaDB.user.create({
            data: {
              email: user.email!,
              name: user.email!,
              image: user.image,
            },
          });
          return true;
        }
      } catch (error) {
        console.log(error);
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      const Dbuser = await prismaDB.user.findUnique({
        where: {
          email: token.email!,
        },
      });

      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = Dbuser?.image || user.image;
        token.id = Dbuser?.id!;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.image = token.picture;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  // debug: true,
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
