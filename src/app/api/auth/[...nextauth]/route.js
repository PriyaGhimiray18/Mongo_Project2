import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email or Student ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Please enter both email and password");
          }

          console.log("Attempting login for:", credentials.email);

          // First try to find user by email
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { studentId: credentials.email }
              ]
            }
          });

          if (!user) {
            console.log("No user found for:", credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log("User found:", { id: user.id, email: user.email, studentId: user.studentId });

          if (!user.password) {
            console.log("User has no password:", credentials.email);
            throw new Error("Invalid user configuration");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Password validation result:", isValid);

          if (!isValid) {
            console.log("Invalid password for:", credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log("Login successful for:", credentials.email);
          return {
            id: user.id,
            email: user.email,
            studentId: user.studentId,
            username: user.username,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],

  pages: {
    signIn: '/',
    error: '/',
  },

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
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.isAdmin = token.isAdmin;
        session.user.studentId = token.studentId;
        session.user.username = token.username;
        session.user.name = token.username || token.studentId || "n/a";
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
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
