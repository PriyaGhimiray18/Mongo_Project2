import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        loginInput: { label: "Email / Student ID / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const loginId = credentials?.loginInput;
        const password = credentials?.password;

        if (!loginId || !password) return null;

        // Find user by email, studentId or username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: loginId },
              { studentId: loginId },
              { username: loginId },
            ],
          },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Optional dev log
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ User logged in:", user);
        }

        // Return user info (without password)
        return {
          id: user.id,
          email: user.email,
          studentId: user.studentId,
          username: user.username,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.studentId = user.studentId;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          isAdmin: token.isAdmin,
          studentId: token.studentId,
          username: token.username,
          name: token.username || token.studentId || "n/a", // For UI display
        };
      }
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
