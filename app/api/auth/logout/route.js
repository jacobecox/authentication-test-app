import { NextResponse } from 'next/server';

export async function GET(request) {

  const { origin } = new URL(request.url);
  
  const fusionAuthIssuer = process.env.FUSIONAUTH_ISSUER;
  const clientId = process.env.FUSIONAUTH_CLIENT_ID;
  const debugLogoutUrl = `${fusionAuthIssuer}/oauth2/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(origin)}`;

  
  // Redirect to FusionAuth logout which will then redirect back to our home page
  const response = NextResponse.redirect(debugLogoutUrl);
  
  // Clear the authentication cookies
  response.cookies.delete('access_token');
  response.cookies.delete('id_token');
  
  return response;
}
