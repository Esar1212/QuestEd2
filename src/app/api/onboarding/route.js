import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import dbConnect from "../../../../lib/dbConnect";
import Student from "../../../../models/Student";
import Teacher from "../../../../models/Teacher";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  console.log("Onboarding session:", session);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  await dbConnect();
  const email = session.user.email;
  const fullName = session.user.name;
  const body = await req.json();
  const { userType } = body;


  let user;
//Need to fix this part
  if (userType === "student") {
    const {
      studentType,
      rollNumber,
      schoolClass,
      stream,
      year
    } = body;

    if (!studentType || !rollNumber) {
      return NextResponse.json(
        { message: "Missing required student fields" },
        { status: 400 }
      );
    }

    user = await Student.create({
      fullName,
      email,
      studentType,
      rollNumber,
      class: studentType === "school" ? schoolClass : "",
      stream: studentType === "college" ? stream : "",
      year: studentType === "college" ? year : "",
      authProvider: "google",
    });
  }

  else if (userType === "teacher") {
    const { subject, qualification } = body;

    if (!subject || !qualification) {
      return NextResponse.json(
        { message: "Missing required teacher fields" },
        { status: 400 }
      );
    }

    user = await Teacher.create({
      fullName,
      email,
      subject,
      qualification,
      authProvider: "google",
    });
  }

  else {
    return NextResponse.json(
      { message: "Invalid userType" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Onboarding completed",
      userId: user._id,
      userType,
    },
    { status: 201 }
  );
}
