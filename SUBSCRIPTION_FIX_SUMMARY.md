# Subscription Issues Fix Summary

## Issues Fixed

### 1. ON CONFLICT Error on Localhost
**Problem**: Error "there is no unique or exclusion constraint matching the ON CONFLICT specification" when subscribing to a plan.

**Root Cause**: The code was using Supabase's `upsert` with `onConflict: 'user_id'`, which requires a unique constraint. While the constraint exists in the schema, Supabase's upsert implementation can be finicky with this syntax.

**Solution**: 
- Changed from `upsert` with `onConflict` to a manual check-then-update-or-insert pattern
- First checks if a subscription exists for the user
- If exists: updates the existing record
- If not: inserts a new record
- This approach is more reliable and doesn't depend on the exact constraint name

**Files Changed**:
- `pages/Payment.tsx` - `saveSubscriptionToDatabase()` function
- `pages/Payment.tsx` - `handleWebPurchase()` function

### 2. Subscription Not Showing in Account Page
**Problem**: After subscribing, the account page still shows all plans as if the user is not subscribed.

**Root Cause**: 
- The subscription query was too strict (only checking for `status = 'active'`)
- Didn't handle expired subscriptions properly
- Didn't properly fallback to user_profiles table data
- Query might fail silently

**Solution**:
- Improved subscription loading logic to:
  - Query subscriptions ordered by `updated_at` (most recent first)
  - Check if subscription is expired (expires_at < now)
  - Properly handle both active and expired subscriptions
  - Better fallback to user_profiles table
  - Added comprehensive logging for debugging
- Changed from `.single()` to `.maybeSingle()` to handle cases where no subscription exists

**Files Changed**:
- `pages/Account.tsx` - `loadUserProfile()` function

### 3. Plan Not Activated After Payment
**Problem**: On mobile, payment screen shows success but plan is not activated and account doesn't show the subscribed plan.

**Root Cause**: 
- Subscription might be saved to database but profile not updated
- Subscription might be saved but query not finding it
- Race condition between saving subscription and loading profile

**Solution**:
- Ensured both `user_subscriptions` and `user_profiles` tables are updated
- Added proper error handling for both updates
- Improved the subscription loading to check both tables
- Added refresh after subscription save
- Better handling of user state updates

**Files Changed**:
- `pages/Payment.tsx` - `saveSubscriptionToDatabase()` function
- `pages/Account.tsx` - `loadUserProfile()` function

### 4. Restore Purchases Not Saving to Database
**Problem**: Restore purchases button finds purchases but doesn't save them to the database.

**Root Cause**: The `handleRestorePurchases()` function only checked for owned products but didn't save them to the database.

**Solution**:
- Updated `handleRestorePurchases()` to:
  - Save each owned product to `user_subscriptions` table
  - Update `user_profiles` table with subscription info
  - Use the same check-then-update-or-insert pattern
  - Refresh the profile after saving

**Files Changed**:
- `pages/Account.tsx` - `handleRestorePurchases()` function

## Database Setup

If you still encounter the ON CONFLICT error, run this SQL script in your Supabase SQL Editor:

```sql
-- Run: database/fix_user_subscriptions_constraint.sql
```

This ensures the unique constraint on `user_id` exists with the proper name.

## Testing Checklist

After these fixes, test the following:

1. **Localhost Subscription**:
   - [ ] Subscribe to a plan on localhost
   - [ ] Verify no ON CONFLICT error appears
   - [ ] Check that subscription appears in account page
   - [ ] Verify subscription status shows as "Active"

2. **Mobile Subscription**:
   - [ ] Subscribe to a plan on mobile device
   - [ ] Complete payment through Google Play
   - [ ] Verify payment success screen appears
   - [ ] Check account page shows subscribed plan
   - [ ] Verify plan features are accessible

3. **Restore Purchases**:
   - [ ] Click "Restore Purchases" button
   - [ ] Verify owned products are found
   - [ ] Check that subscription appears in account page
   - [ ] Verify subscription is active

4. **Edge Cases**:
   - [ ] Subscribe when already subscribed (should update existing)
   - [ ] Check expired subscriptions are handled correctly
   - [ ] Verify subscription persists after app restart

## Additional Improvements

- Added comprehensive logging throughout subscription flow
- Better error messages for debugging
- Improved handling of edge cases (expired subscriptions, missing data)
- More robust database operations (check before insert/update)





