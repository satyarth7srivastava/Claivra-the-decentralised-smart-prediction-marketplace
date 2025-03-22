import connect from '@/config/connect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
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

        const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
        if (!isValidPassword) {
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
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        await connect();
        console.log("reached 1")
        const existingUser = await User.findOne({ email: user.email });
        console.log("reached 2")
        if (!existingUser) {
          console.log("reached 3")
          const baseUsername = user.name.replace(/\s+/g, "").toLowerCase();
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          const username = `${baseUsername}${randomSuffix}`;

          console.log("reached 4");
          console.log(user.email, user.name);
          const newUser = await User.create({
            email : user.email,
            fullName : user.name,
            username,
            password: " "
        });
        console.log("reached 5")
        newUser.save();

        console.log("New user created:", newUser);
        } else {
          console.log("User already exists:", existingUser.email);
        }
      }
      return true; // Allow sign-in
    },
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
