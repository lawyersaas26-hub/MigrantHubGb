-- Fix RLS Policies for Jobs Table
-- Run this to fix Row Level Security policy violations

-- First, drop all existing policies on jobs table
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Public can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own jobs" ON jobs;

-- Recreate policies with correct permissions

-- Policy 1: Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
    ON jobs
    FOR SELECT
    USING (is_active = TRUE);

-- Policy 2: Public (anonymous) users can insert jobs
CREATE POLICY "Public can insert jobs"
    ON jobs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy 3: Authenticated users can insert jobs
CREATE POLICY "Authenticated users can insert jobs"
    ON jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 4: Anyone can insert jobs (most permissive)
-- This ensures both anonymous and authenticated users can submit
CREATE POLICY "Anyone can insert jobs"
    ON jobs
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'jobs';











