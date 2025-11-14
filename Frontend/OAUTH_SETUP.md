# OAuth Setup Guide

## Overview
This Next.js application uses NextAuth v5 (Auth.js) for OAuth authentication with Google and Microsoft Azure AD.

## Environment Variables

Copy the `.env.local` file and fill in your OAuth credentials:

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to `.env.local`

### Microsoft Azure AD OAuth Setup
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" → "App registrations" → "New registration"
3. Set redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
4. Go to "Certificates & secrets" → "New client secret"
5. Copy the Application (client) ID, Client Secret, and Directory (tenant) ID to `.env.local`

### AUTH_SECRET
Generate a secure random string for AUTH_SECRET:
```bash
openssl rand -base64 32
```

## Environment Variables Required

```env
AUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=your-azure-tenant-id
```

## Running the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000` to see the login page.

## Features

- ✅ OAuth login with Google
- ✅ OAuth login with Microsoft
- ✅ Beautiful UI with shadcn/ui
- ✅ Protected dashboard route
- ✅ Session management
- ✅ Dark mode support

## Routes

- `/` - Login page
- `/dashboard` - Protected dashboard (requires authentication)
- `/api/auth/*` - NextAuth API routes

## Tech Stack

- Next.js 16
- NextAuth v5 (Auth.js)
- shadcn/ui
- Tailwind CSS
- TypeScript
