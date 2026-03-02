# Implementation Plan - Fix Subscription Unique Constraint

The user is encountering an error when subscribing: `there is no unique or exclusion constraint matching the ON CONFLICT specification`.

This is caused by the following code in `Payment.tsx`:
```typescript
.upsert({...}, { onConflict: 'user_id' })
```

The `user_subscriptions` table likely does not have a unique constraint on `user_id`, causing the `ON CONFLICT` clause to fail.

## Proposed Changes

### Database

1.  **Add Unique Constraint:** Create a SQL migration to add a unique constraint on `user_id` to the `user_subscriptions` table. This ensures each user can have only one active subscription record (or at least one record if we resolve conflicts by `user_id`).

### SQL Script

Create a file `ADD_UNIQUE_CONSTRAINT.sql` with the following content:

```sql
-- Add unique constraint to user_subscriptions table to support upsert
-- This is required for the ON CONFLICT (user_id) clause to work

-- First, remove any duplicate entries if they exist (keeping the most recent one)
DELETE FROM user_subscriptions a USING (
      SELECT MIN(ctid) as ctid, user_id
      FROM user_subscriptions 
      GROUP BY user_id HAVING COUNT(*) > 1
      ) b
      WHERE a.user_id = b.user_id 
      AND a.ctid <> b.ctid;

-- Now add the constraint
ALTER TABLE user_subscriptions
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
```

## Verification Plan

### Manual Verification
1.  Ask the user to run the `ADD_UNIQUE_CONSTRAINT.sql` script in their Supabase SQL Editor.
2.  Ask the user to retry the subscription process.
