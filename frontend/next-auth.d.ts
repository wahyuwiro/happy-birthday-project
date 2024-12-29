import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  }

  interface Session {
    user: {
      id: number;
      email: string;
      firstName?: string;
      lastName?: string;
    };
  }

  interface JWT {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  }
}
