import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '../../../../lib/auth';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=login_failed', request.url));
  }

  try {
    const redirectUri = `${origin}/api/auth/callback`;
    const tokenData = await exchangeCodeForTokens(code, redirectUri);
    
    const response = NextResponse.redirect(new URL('/secure', request.url));
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 3600,
    };

    response.cookies.set('access_token', tokenData.access_token, cookieOptions);
    
    if (tokenData.id_token) {
      response.cookies.set('id_token', tokenData.id_token, cookieOptions);
    }

    return response;
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect(new URL('/?error=login_failed', request.url));
  }
}
