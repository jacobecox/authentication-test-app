import { jwtVerify, createRemoteJWKSet } from 'jose';

export async function verifyJWT(token) {
  try {
    // Step 1: Get FusionAuth's JWKS URL
    const issuer = process.env.FUSIONAUTH_ISSUER;
    const jwksUrl = `${issuer}/.well-known/jwks.json`;
    
    // Step 2: Create a JWKS client that can fetch and cache keys automatically
    // This handles key rotation and caching for us
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));
    
    // Step 3: Verify the JWT using the JWKS
    // jose library handles all the complexity: key fetching, format conversion, verification
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.FUSIONAUTH_ISSUER,            // Use the full issuer without modification
      audience: process.env.FUSIONAUTH_CLIENT_ID,        // Verify the token was issued for our app
      algorithms: ['RS256']                              // Only accept RS256 algorithm (RSA + SHA256)
    });
    
    // Step 4: Return the decoded payload
    // jwtVerify automatically handles: signature verification, expiration, issuer, audience
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    console.error('🚀 ERROR DETAILS:', {
      expectedIssuer: process.env.FUSIONAUTH_ISSUER,
      errorMessage: error.message
    });
    return null;
  }
}

// Helper function to verify authentication from cookies
export async function verifyAuthFromCookies(cookies) {
  try {
    // Get tokens from cookies
    const accessToken = cookies.get('access_token')?.value;
    const idToken = cookies.get('id_token')?.value;
    
    // Check if we have at least one token
    if (!accessToken && !idToken) {
      return { authenticated: false, error: 'No authentication tokens found' };
    }
    
    // Prefer ID token for user info, fall back to access token
    const tokenToVerify = idToken || accessToken;
    
    // Verify the JWT signature with FusionAuth's public key
    const payload = await verifyJWT(tokenToVerify);
    
    if (!payload) {
      return { authenticated: false, error: 'Token signature verification failed' };
    }
    
    // Token is valid (signature verification already checked expiration and issuer)
    return { 
      authenticated: true,
      user: {
        sub: payload.sub,
        email: payload.email,
        // Add other claims as needed
      }
    };
    
  } catch (error) {
    console.error('Authentication verification error:', error);
    return { authenticated: false, error: 'Authentication verification failed' };
  }
}

export async function exchangeCodeForTokens(code, redirectUri) {
  const issuer = process.env.FUSIONAUTH_ISSUER;
  const clientId = process.env.FUSIONAUTH_CLIENT_ID;
  const clientSecret = process.env.FUSIONAUTH_CLIENT_SECRET;

  if (!issuer || !clientId || !clientSecret) {
    throw new Error('Missing required FusionAuth environment variables');
  }
  
  const response = await fetch(`${issuer}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}
