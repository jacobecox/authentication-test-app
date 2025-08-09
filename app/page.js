'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [loginUrl, setLoginUrl] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fusionAuthIssuer = process.env.NEXT_PUBLIC_FUSIONAUTH_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID;
    
    const builtLoginUrl = `${fusionAuthIssuer}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(`${window.location.origin}/api/auth/callback`)}`;
    setLoginUrl(builtLoginUrl);
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    if (urlError) {
      setError(urlError);
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
      
      {error === 'login_failed' && (
        <p style={{ color: 'red', marginBottom: '20px' }}>
          Login failed. Please try again.
        </p>
      )}
      
      <div>
        {loginUrl ? (
          <a href={loginUrl}>
            <button>Login via FusionAuth</button>
          </a>
        ) : (
          <p>Loading login...</p>
        )}
      </div>
    </div>
  );
}
