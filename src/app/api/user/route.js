import { getServerSession } from 'next-auth';
import NextAuth from 'next-auth';
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        identifier: {
          label: "Student ID/Email",
          type: "text",
          placeholder: "Enter your Student ID or Email"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password"
        }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { studentId: credentials.identifier },
              { email: credentials.identifier }
            ]
          }
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, user.password);
        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          studentId: user.studentId,
          isAdmin: user.isAdmin
        };
      }
    }
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    return new Response(
      JSON.stringify(session.user),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 