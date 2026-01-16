import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  // Explicitly clear cookies by setting them with Max-Age=0 and matching attributes.
  // This helps when cookies were originally set with Secure/HttpOnly/SameSite attributes.
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  };

  // Common cookie names to clear (adjust if you use different names or domain)
  response.cookies.set('authToken', '', cookieOptions);
  response.cookies.set('next-auth.session-token', '', cookieOptions);
  response.cookies.set('__Secure-next-auth.session-token', '', cookieOptions);
  response.cookies.set('next-auth.csrf-token', '', cookieOptions);
  response.cookies.set('next-auth.callback-url', '', cookieOptions);

  return response;
}