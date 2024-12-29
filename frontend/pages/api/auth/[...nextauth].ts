import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user; // Return the user object
        }
        return null; // Return null if login fails
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT-based sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;

       }
      return token;
    },
    async session({ session, token }) {
      const user = token as { id: number; email: string; firstName?: string | undefined; lastName?: string | undefined; };
      session.user = user;
      return session;
    },
  },
});
