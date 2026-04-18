import { type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export { auth } from "next-auth";

export const authOptions: NextAuthConfig = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
    async authorized({ request, auth }) {
      // Allow unauthenticated access to /auth/signin
      if (!auth && request.nextUrl.pathname === "/auth/signin") {
        return true;
      }

      // Require auth for all other routes
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
