# Clerk to Supabase Auth Migration - Complete

## What Was Changed

### ✅ Authentication System
- **Removed**: Clerk authentication (@clerk/nextjs)
- **Added**: Supabase Authentication with email/password and OAuth support

### ✅ Files Created
1. `lib/supabase/browser-client.ts` - Browser-side Supabase client
2. `lib/supabase/auth-context.tsx` - React context for auth state
3. `lib/supabase/server-client.ts` - Server-side Supabase client with helpers
4. `app/sign-in/page.tsx` - New email/password sign-in page
5. `app/sign-up/page.tsx` - New email/password sign-up page
6. `app/auth/callback/route.ts` - OAuth callback handler
7. `supabase-migration-clerk-to-auth.sql` - Database migration script

### ✅ Files Modified
1. `app/providers.tsx` - Replaced ClerkProvider with SupabaseAuthProvider
2. `middleware.ts` - Replaced Clerk middleware with Supabase session checks
3. `components/Navbar.tsx` - Replaced Clerk components with custom auth UI
4. `app/swipe/SwipeClient.tsx` - Updated to use Supabase auth hooks
5. All server actions in `app/actions/`:
   - `pets.ts` - Updated to use Supabase auth
   - `user.ts` - Updated to use Supabase auth
   - `matches.ts` - Updated to use Supabase auth
   - `messages.ts` - Updated to use Supabase auth

### ✅ Files Deleted
1. `app/sign-in/[[...sign-in]]/page.tsx` - Old Clerk sign-in page
2. `app/sign-up/[[...sign-up]]/page.tsx` - Old Clerk sign-up page
3. `app/api/webhooks/clerk/route.ts` - Clerk webhook handler

### ✅ Dependencies Removed
- `@clerk/nextjs`
- `svix` (Clerk webhook library)

## Next Steps

### 1. Run Database Migration
Execute the migration script in your Supabase SQL Editor:
```bash
# File: supabase-migration-clerk-to-auth.sql
```

This will:
- Remove `clerk_user_id` column from users table
- Update all RLS policies to use `auth.uid()` instead
- Ensure proper access control with Supabase Auth

### 2. Enable Email Auth in Supabase
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable **Email** provider
4. Configure email templates if desired

### 3. (Optional) Enable OAuth Providers
To enable Google sign-in:
1. Go to Authentication > Providers in Supabase Dashboard
2. Enable **Google** provider
3. Add your OAuth credentials
4. Update redirect URL to: `https://your-domain.com/auth/callback`

### 4. Update Environment Variables
Your `.env` file now has:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...
```

No Clerk variables are needed anymore.

### 5. Test the Application
```bash
npm run dev
```

Test these flows:
1. ✅ Sign up with email/password
2. ✅ Sign in with email/password
3. ✅ Sign out
4. ✅ Protected routes redirect to /sign-in
5. ✅ Authenticated users can access /swipe, /matches, etc.
6. ✅ Profile dropdown shows user email
7. ✅ OAuth (if enabled)

## Key Changes in Authentication Flow

### Before (Clerk):
```typescript
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

// Client
const { user } = useUser();

// Server
const { userId } = await auth();
```

### After (Supabase):
```typescript
import { useUser } from "@/lib/supabase/auth-context";
import { getUser } from "@/lib/supabase/server-client";

// Client
const { user } = useUser();

// Server
const user = await getUser();
```

### User ID Mapping:
- **Before**: `clerk_user_id` stored in users table
- **After**: `users.id` directly matches `auth.uid()` from Supabase Auth

## Database Schema Changes

### Users Table:
- **Removed**: `clerk_user_id VARCHAR(255)`
- **Using**: `id UUID` (matches Supabase auth.users.id)

### RLS Policies:
- **Before**: `WHERE clerk_user_id = auth.uid()::text`
- **After**: `WHERE id = auth.uid()`

## Troubleshooting

### Issue: "Unauthorized" errors
**Solution**: Ensure user is signed in and Supabase session is valid. Check browser cookies.

### Issue: RLS policy violations
**Solution**: Run the migration script to update all RLS policies to use `auth.uid()`.

### Issue: Missing user in database
**Solution**: The `getCurrentUser()` helper in pets.ts automatically creates user records for new auth users.

### Issue: OAuth not working
**Solution**: 
1. Verify OAuth provider is enabled in Supabase
2. Check redirect URL is set to `/auth/callback`
3. Ensure OAuth credentials are correct

## Benefits of Supabase Auth

1. ✅ **Native Integration**: Auth users sync automatically with database
2. ✅ **RLS Support**: Built-in Row Level Security with `auth.uid()`
3. ✅ **No External Dependencies**: One less service to manage
4. ✅ **Better Performance**: No webhook delays for user sync
5. ✅ **More Control**: Full access to auth configuration and customization

## Migration Complete! 🎉

Your application now uses Supabase Auth exclusively. All Clerk dependencies have been removed and the codebase is simplified.
