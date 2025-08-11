'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [loginUrl, setLoginUrl] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fusionAuthIssuer = process.env.NEXT_PUBLIC_FUSIONAUTH_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID;
    
    const builtLoginUrl = `${fusionAuthIssuer}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(`http://localhost:3000/api/auth/callback`)}`;
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
      
      <div style={{ marginBottom: '20px' }}>
        {loginUrl ? (
          <a href={loginUrl}>
            <button>Login via FusionAuth</button>
          </a>
        ) : (
          <p>Loading login...</p>
        )}
      </div>
      
      <div>
        <a href="/secure">
          <button style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Go to Secure Page
          </button>
        </a>
      </div>
    </div>
  );
}
