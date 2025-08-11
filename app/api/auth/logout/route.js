import { NextResponse } from 'next/server';

export async function GET(request) {
  // This is a direct logout request - clear cookies first, then redirect to FusionAuth logout
  const { origin } = new URL(request.url);
  const fusionAuthIssuer = process.env.FUSIONAUTH_ISSUER;
  const clientId = process.env.FUSIONAUTH_CLIENT_ID;
  
  // Use the home page as the post-logout redirect to avoid redirect loops
  const logoutUrl = `${fusionAuthIssuer}/oauth2/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(origin + '/')}`;
  
  // Create response that redirects to FusionAuth logout
  const response = NextResponse.redirect(logoutUrl);
  
  // Clear cookies immediately before redirecting to FusionAuth
  response.cookies.delete('access_token', { 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  response.cookies.delete('id_token', { 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  return response;
}
