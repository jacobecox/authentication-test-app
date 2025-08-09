'use client'; // This is a client-side React component (runs in browser)

import { useEffect, useState } from 'react';

// This is the SECURE PAGE - only authenticated users can see this
export default function SecurePage() {
  // State to store the logout URL (built in browser only)
  const [logoutUrl, setLogoutUrl] = useState('');
  // State to store user information from OpenID Connect
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fusionAuthIssuer = process.env.NEXT_PUBLIC_FUSIONAUTH_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_FUSIONAUTH_CLIENT_ID;
    
    const builtLogoutUrl = `${fusionAuthIssuer}/oauth2/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
    setLogoutUrl(builtLogoutUrl);
    
    fetch('/api/user')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          window.location.href = '/';
          return null;
        } else {
          throw new Error('Failed to fetch user info');
        }
      })
      .then(userData => {
        if (userData) {
          setUser(userData);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>🔒 Secure Page</h1>
      <p>Success! You're authenticated with OpenID Connect.</p>
      
      {loading ? (
        <p>Loading user information...</p>
      ) : user ? (
        <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>👤 User Information</h3>
          <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
          <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
          <p><strong>First Name:</strong> {user.given_name || 'Not provided'}</p>
          <p><strong>Last Name:</strong> {user.family_name || 'Not provided'}</p>
          <p><strong>User ID:</strong> {user.sub}</p>
          {user.picture && (
            <p><strong>Profile Picture:</strong> <img src={user.picture} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /></p>
          )}
          <details style={{ marginTop: '10px' }}>
            <summary>Technical Details</summary>
            <p><strong>Issuer:</strong> {user.iss}</p>
            <p><strong>Audience:</strong> {user.aud}</p>
            <p><strong>Issued At:</strong> {new Date(user.iat * 1000).toLocaleString()}</p>
            <p><strong>Expires At:</strong> {new Date(user.exp * 1000).toLocaleString()}</p>
          </details>
        </div>
      ) : (
        <p style={{ color: 'red' }}>Failed to load user information</p>
      )}
      
      <div style={{ marginTop: '20px' }}>
        {logoutUrl ? (
          <a href={logoutUrl}>
            <button>Logout via FusionAuth</button>
          </a>
        ) : (
          <p>Loading logout...</p>
        )}
      </div>

    </div>
  );
}
