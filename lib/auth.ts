import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const authOptions: NextAuthConfig = {
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
      // Allow unauthenticated access to /auth/signin and /api/status
      if (!auth && (request.nextUrl.pathname === "/auth/signin" || request.nextUrl.pathname === "/api/status")) {
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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
