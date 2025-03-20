import connect from '@/db/connect';
import User from '@/db/models/User';
// import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';


export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Enter email id' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter password' },
      },
      async authorize(credentials) {
        await connect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }

        // const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (credentials.password!=user.password) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user } : any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token } : any) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
