import { NextResponse } from 'next/server';
import { decodeJWT } from '../../../lib/auth';

export async function GET(request) {
  try {
    const idToken = request.cookies.get('id_token')?.value;
    
    if (!idToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userClaims = decodeJWT(idToken);
    
    if (!userClaims) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({
      sub: userClaims.sub,
      email: userClaims.email,
      name: userClaims.name,
      given_name: userClaims.given_name,
      family_name: userClaims.family_name,
      picture: userClaims.picture,
      iss: userClaims.iss,
      aud: userClaims.aud,
      exp: userClaims.exp,
      iat: userClaims.iat,
    });
    
  } catch (error) {
    console.error('Error getting user info:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
