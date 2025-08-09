# Ultra-Simple FusionAuth Demo App

**Perfect for customer demos!** Shows how minimal FusionAuth integration can be.

## Why This Approach?

- **Zero OAuth complexity** - FusionAuth handles everything
- **Minimal code changes** - Perfect for existing apps
- **Customer-friendly** - Shows FusionAuth's ease of integration

## Setup

### 1. Environment Variables
Create `.env.local`:
```
FUSIONAUTH_ISSUER=http://localhost:9011
FUSIONAUTH_CLIENT_ID=your-client-id
FUSIONAUTH_CLIENT_SECRET=your-client-secret
```

### 2. FusionAuth Configuration
In your FusionAuth Application:
- **Authorized redirect URLs**: `http://localhost:3000/secure`
- **Authorized request origin URLs**: `http://localhost:3000`
- **Logout URL**: `http://localhost:3000`

### 3. Run
```bash
npm run dev
```

## That's It! 

- Visit `http://localhost:3000`
- Click login → Google OAuth via FusionAuth → Secure page
- Click logout → Back to login page

## Perfect Demo Points for Customers:

✅ **Only 3 environment variables needed**  
✅ **No custom OAuth code required**  
✅ **No token management needed**  
✅ **FusionAuth handles all security**  
✅ **Works with any OAuth provider (Google, GitHub, etc.)**  
✅ **Production-ready out of the box**
