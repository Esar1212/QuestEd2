import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import dbConnect from "../../../lib/dbConnect";
import Student from "../../../models/Student";
import Teacher from "../../../models/Teacher";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  await dbConnect();

  const email = session.user.email;

  const student = await Student.findOne({ email });
  const teacher = await Teacher.findOne({ email });

  if (!student && !teacher) {
    redirect("/onboarding");
  }

  if (teacher) {
    redirect("/teacher-dashboard");
  }
  console.log("Student token:", session)
  redirect("/student-dashboard");
}
