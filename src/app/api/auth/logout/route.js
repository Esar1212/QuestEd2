import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  response.cookies.delete('authToken');
  /* ---------------------------------------
     NextAuth session cookies
  --------------------------------------- */
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");

  /* ---------------------------------------
     Optional cleanup cookies
  --------------------------------------- */
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("next-auth.callback-url");
  return response;
}