import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "@/lib/db";
import { accounts, sessions, users, verificationTokens, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        const db = getDb();
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id!),
        });
        if (dbUser?.orgId) {
          token.orgId = dbUser.orgId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      if (token.orgId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).orgId = token.orgId as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const db = getDb();
      const slug = (user.email?.split("@")[0] || "org") + "-" + Date.now().toString(36);
      const [org] = await db
        .insert(organizations)
        .values({
          name: user.name || "My Organization",
          slug,
        })
        .returning();
      await db
        .update(users)
        .set({ orgId: org.id })
        .where(eq(users.id, user.id!));
    },
  },
});
