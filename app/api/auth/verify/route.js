import { NextResponse } from 'next/server';

export async function GET(request) {
  // Check if user has authentication cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const idToken = request.cookies.get('id_token')?.value;
  
  if (accessToken || idToken) {
    // User has tokens, consider them authenticated
    return NextResponse.json({ authenticated: true });
  } else {
    // No tokens, not authenticated
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
