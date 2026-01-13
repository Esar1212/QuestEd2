import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getServerSession } from "next-auth";
import dbConnect from '../../../../../lib/dbConnect';
import Student from '../../../../../models/Student';
import Teacher from '../../../../../models/Teacher';
import { authOptions } from "../../../../../lib/authOptions";

const JWT_SECRET = process.env.JWT_SECRET||'your-secret-key';

export async function GET(request) {
  try {
    await dbConnect();

    /* ----------------------------------------------------
       1. TRY NEXTAUTH SESSION (Google OAuth)
    ---------------------------------------------------- */
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const email = session.user.email;

      const student = await Student.findOne({ email });
      const teacher = await Teacher.findOne({ email });

      if (student) {
        return NextResponse.json({
          image: session.user.image,
          authenticated: true,
          userType: "student",
          userId: student._id,
          _id: student._id,
          fullName: student.fullName,
          studentType: student.studentType,
          rollNumber: student.rollNumber,
          class: student.class,
          stream: student.stream,
          year: student.year,
        });
      }

      if (teacher) {
        return NextResponse.json({
          authenticated: true,
          userType: "teacher",
          userId: teacher._id,
          _id: teacher._id,
          fullName: teacher.fullName,
          subject: teacher.subject,
          qualification: teacher.qualification,
        });
      }
      // Session exists but onboarding not done yet
      return NextResponse.json(
        { authenticated: false, error: "User not onboarded" },
        { status: 403 }
      );
    }
    /* ----------------------------------------------------
       2. FALLBACK: MANUAL JWT (Credentials Login)
    ---------------------------------------------------- */
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;// Retrieve the token from cookies
    
    if (!token) {
      console.log('No token found in cookies');
      return NextResponse.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }


    const decoded = jwt.verify(token, JWT_SECRET);
    
    await dbConnect();
    
    // Fetch user details based on userType
    let userDetails;
    if (decoded.userType === 'teacher') {
      userDetails = await Teacher.findById(decoded.userId);
    } else {
      userDetails = await Student.findById(decoded.userId);
    }

    // Base response
    const response = {
      authenticated: true,
      userType: decoded.userType,
      userId: decoded.userId,
      fullName: decoded.fullName,
      _id: decoded.userId
    };

    // Add type-specific fields
    if (decoded.userType === 'teacher') {
      response.subject = userDetails.subject;
      response.qualification = userDetails.qualification;
    } else {
      response.studentType = userDetails.studentType;
      response.rollNumber = userDetails.rollNumber;
      response.class = userDetails.class;
      response.stream = userDetails.stream;
      response.year = userDetails.year;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 401 }
    );
  }
}