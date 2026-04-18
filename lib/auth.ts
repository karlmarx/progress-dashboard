import { type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthConfig = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async authorized({ request, auth }) {
      // Require GitHub login for dashboard
      if (!auth) {
        return false;
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
