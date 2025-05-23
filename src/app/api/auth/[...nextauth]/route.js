import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password");
          }

          // Find user by email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { studentId: credentials.email }
              ]
            }
          });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Compare password
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            studentId: user.studentId,
            isAdmin: user.isAdmin
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/',
    error: '/'
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.studentId = user.studentId;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.studentId = token.studentId;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
});

export { handler as GET, handler as POST };
