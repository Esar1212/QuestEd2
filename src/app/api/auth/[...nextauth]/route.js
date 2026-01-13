
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../../../lib/dbConnect";
import Student from "../../../../../models/Student";
import Teacher from "../../../../../models/Teacher";

export const authOptions = {
  session: { strategy: "jwt" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {


      if (account.provider !== "google") return false;

          return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
      }

      if (!token.email || token.userType) return token;

      await dbConnect();

      const student = await Student.findOne({ email: token.email });
      const teacher = await Teacher.findOne({ email: token.email });

      if (student) {
        token.userType = "student";
      }

      if (teacher) {
        token.userType = "teacher";
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        userType: token.userType,
        email: token.email,
        name: token.name,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

