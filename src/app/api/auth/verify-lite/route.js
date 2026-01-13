import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET||'your-secret-key';

export async function GET(request) {
  try {

    
    /* ----------------------------------------------------
           MANUAL JWT (Credentials Login)
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


    // Base response
    const response = {
      authenticated: true,
      userType: decoded.userType,
     
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 401 }
    );
  }
}