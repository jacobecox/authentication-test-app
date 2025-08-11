import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuthFromCookies } from '../../lib/auth';

export default async function SecurePage() {
  // Get cookies on the server side
  const cookieStore = await cookies();
  
  // Verify authentication server-side
  const authResult = await verifyAuthFromCookies(cookieStore);
  
  // If not authenticated, redirect to login
  if (!authResult.authenticated) {
    redirect('/');
  }
  
  // User is authenticated, render the secure page
  return (
    <div>
      <h1>🔒 Secure Page</h1>
      <p>Success! You're authenticated.</p>
      <p>Welcome, {authResult.user.email}!</p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <a href="/">
          <button style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Go to Home Page
          </button>
        </a>
        
        <a href="/api/auth/logout">
          <button style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            Logout via FusionAuth
          </button>
        </a>
      </div>
    </div>
  );
}
