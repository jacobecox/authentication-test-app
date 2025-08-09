export function decodeJWT(token) {
  try {
    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
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
