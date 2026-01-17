import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import Student from "../models/Student";
import Teacher from "../models/Teacher";

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
        token.userId = student._id.toString();
      }

      if (teacher) {
        token.userType = "teacher";
        token.userId = teacher._id.toString();
      }



      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...(session.user || {}),
        userId: token.userId,
        userType: token.userType,
        email: token.email,
        name: token.name,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};