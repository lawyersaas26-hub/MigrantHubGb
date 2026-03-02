# Fix RLS Policy Error for Jobs Table

## Error: `new row violates row-level security policy for table "jobs"`

This error occurs because Row Level Security (RLS) policies are blocking the insert operation.

## Quick Fix

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Public can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own jobs" ON jobs;

-- Recreate policies with correct permissions

-- Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
    ON jobs
    FOR SELECT
    USING (is_active = TRUE);

-- Public (anonymous) users can insert jobs
CREATE POLICY "Public can insert jobs"
    ON jobs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Authenticated users can insert jobs
CREATE POLICY "Authenticated users can insert jobs"
    ON jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Anyone can insert jobs (most permissive)
CREATE POLICY "Anyone can insert jobs"
    ON jobs
    FOR INSERT
    TO public
    WITH CHECK (true);
```

## Or Use the Migration File

Run `database/fix_jobs_rls_policies.sql` - it contains all the fixes above.

## Verify Policies

After running the SQL, verify policies exist:

```sql
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'jobs';
```

You should see policies for:
- SELECT (view active jobs)
- INSERT (for anon, authenticated, and public)

## Alternative: Temporarily Disable RLS (Not Recommended)

If you need to test quickly, you can temporarily disable RLS:

```sql
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning:** This makes the table accessible to everyone. Re-enable it after testing:

```sql
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
```

## After Fixing

1. Refresh your Supabase dashboard
2. Try submitting a job again
3. The form should now work correctly

## Common Issues

### Issue: Policies exist but still getting error
- Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'jobs';`
- Verify policy roles match your user type (anon vs authenticated)

### Issue: Can insert but can't view
- Make sure the SELECT policy allows viewing active jobs
- Check if `is_active = TRUE` for the job you're trying to view











