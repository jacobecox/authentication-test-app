'use client';

import { useEffect, useState } from 'react';

export default function SecurePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Check if user has authentication cookies
    fetch('/api/auth/verify')
      .then(response => {
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Not authenticated, redirect to login
          window.location.href = '/';
        }
      })
      .catch(() => {
        // Error checking auth, redirect to login
        window.location.href = '/';
      });
  }, []);

  if (isAuthenticated === null) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div>
      <h1>🔒 Secure Page</h1>
      <p>Success! You're authenticated.</p>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/api/auth/logout">
          <button>Logout via FusionAuth</button>
        </a>
      </div>
    </div>
  );
}
