# User Profile and Subscription Guarantee

This document ensures that all users are properly inserted into `user_profiles` and subscriptions are saved to `user_subscriptions`.

## Guarantees

### ✅ 1. New User Signup → user_profiles
**Location**: `lib/userAuth.ts` - `signUpUser()`

**Process**:
1. User signs up via email/password
2. Auth user is created in `auth.users` table
3. Database trigger creates profile (automatic)
4. Code also creates profile if trigger fails (fallback)
5. Profile is guaranteed to exist

**Code Flow**:
```typescript
signUpUser() → 
  - Creates auth user
  - Waits 500ms for trigger
  - Checks if profile exists
  - Creates profile if missing
  - Retries after 2s if first attempt fails
```

### ✅ 2. Google OAuth Signup → user_profiles
**Locations**: 
- `App.tsx` - OAuth callback handlers
- `pages/Account.tsx` - OAuth callback handler
- `lib/userAuth.ts` - `getCurrentUserProfile()`

**Process**:
1. User signs in with Google
2. OAuth callback sets session
3. `getCurrentUserProfile()` is called automatically
4. Profile is created if missing
5. Profile is guaranteed to exist

**Code Flow**:
```typescript
OAuth Callback → 
  - Sets session
  - Calls getCurrentUserProfile()
  - Creates profile if missing
  - Profile guaranteed to exist
```

### ✅ 3. Subscription → user_subscriptions + user_profiles
**Location**: `pages/Payment.tsx` - `saveSubscriptionToDatabase()`

**Process**:
1. User subscribes to a plan
2. **STEP 1**: Ensure profile exists (create if missing)
3. **STEP 2**: Save subscription to `user_subscriptions` (upsert)
4. **STEP 3**: Update `user_profiles` with subscription info
5. Both tables are updated

**Code Flow**:
```typescript
saveSubscriptionToDatabase() →
  STEP 1: Check if profile exists → Create if missing
  STEP 2: Upsert to user_subscriptions
  STEP 3: Update user_profiles with subscription info
```

## Database Trigger

The database trigger `on_auth_user_created` automatically creates profiles when users sign up, but the code has multiple fallbacks:

1. **Primary**: Database trigger (automatic)
2. **Fallback 1**: `getCurrentUserProfile()` creates if missing
3. **Fallback 2**: `signUpUser()` creates if trigger fails
4. **Fallback 3**: OAuth handlers create if missing
5. **Fallback 4**: Payment flow creates if missing before subscription

## Verification

To verify everything is working:

1. **Check user_profiles table**:
   ```sql
   SELECT * FROM user_profiles WHERE email = 'user@example.com';
   ```

2. **Check user_subscriptions table**:
   ```sql
   SELECT * FROM user_subscriptions WHERE user_id = 'user-uuid';
   ```

3. **Check both tables are in sync**:
   ```sql
   SELECT 
     up.id,
     up.email,
     up.subscription_plan,
     up.subscription_status,
     us.plan_type,
     us.status
   FROM user_profiles up
   LEFT JOIN user_subscriptions us ON up.id = us.user_id
   WHERE up.id = 'user-uuid';
   ```

## Testing Checklist

- [ ] Sign up new user → Check `user_profiles` table
- [ ] Sign in with Google → Check `user_profiles` table
- [ ] Subscribe to plan → Check both `user_profiles` and `user_subscriptions`
- [ ] Verify subscription appears in account page
- [ ] Verify access is granted to protected content

## Troubleshooting

If a user is missing from `user_profiles`:
1. Run `database/fix_missing_user_profiles.sql` to create missing profiles
2. User will be created automatically on next app access via `getCurrentUserProfile()`

If subscription is missing:
1. Check `user_subscriptions` table
2. Check `user_profiles` table
3. Use "Restore Purchases" button in Account page
4. Subscription will sync automatically




