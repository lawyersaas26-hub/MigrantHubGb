# Fix Jobs Table Error

## Error: `column user_profiles.user_id does not exist`

This error occurs because the SQL is trying to reference a `user_profiles` table that either:
1. Doesn't exist
2. Has a different column name (e.g., `id` instead of `user_id`)

## Quick Fix

### Option 1: Use the Fixed SQL File (Recommended)

Run `database/jobs_table_simple_fixed.sql` instead. This version:
- ✅ Works without requiring user_profiles table
- ✅ Allows public job submissions
- ✅ Allows viewing active jobs
- ✅ Admin operations can be done through Supabase dashboard or service_role key

### Option 2: Drop and Recreate Policies

If you already ran the SQL, drop the problematic policy:

```sql
-- Drop the admin policy that's causing the error
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;
```

Then the table will work for public submissions. Admin operations can be done through:
- Supabase Dashboard (bypasses RLS)
- Service role key in your admin panel

### Option 3: Fix user_profiles Reference

If you have a `user_profiles` table but with different column names:

1. Check your user_profiles table structure:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';
```

2. Update the policy based on your actual column names:

```sql
-- Drop old policy
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;

-- Create new policy with correct column name
CREATE POLICY "Admins can manage all jobs"
    ON jobs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()  -- Change 'id' to your actual column name
            AND user_profiles.is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()  -- Change 'id' to your actual column name
            AND user_profiles.is_admin = TRUE
        )
    );
```

## Current Status

After running `jobs_table_simple_fixed.sql`:
- ✅ Public users can submit jobs
- ✅ Anyone can view active jobs
- ✅ Jobs are created with `is_active = FALSE` (pending approval)
- ✅ Admins can approve jobs through Supabase dashboard

## Approving Jobs Manually

To approve a job through Supabase Dashboard:

1. Go to **Table Editor** → **jobs**
2. Find the job you want to approve
3. Edit the row
4. Set `is_active` to `TRUE`
5. Save

Or use SQL:
```sql
UPDATE jobs 
SET is_active = TRUE 
WHERE id = 'job-uuid-here';
```











