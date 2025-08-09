'use client';

export default function SecurePage() {

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
