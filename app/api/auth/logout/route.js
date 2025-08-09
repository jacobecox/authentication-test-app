import { NextResponse } from 'next/server';

export async function GET(request) {
  const { origin } = new URL(request.url);
  
  // Build FusionAuth logout URL
  const fusionAuthIssuer = process.env.FUSIONAUTH_ISSUER;
  const clientId = process.env.FUSIONAUTH_CLIENT_ID;
  const logoutUrl = `${fusionAuthIssuer}/oauth2/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(origin)}`;
  
  // Create response that redirects to FusionAuth logout
  const response = NextResponse.redirect(logoutUrl);
  
  // Clear the authentication cookies
  response.cookies.delete('access_token');
  response.cookies.delete('id_token');
  
  return response;
}
