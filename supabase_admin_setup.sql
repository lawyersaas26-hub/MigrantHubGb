-- Admin Dashboard Setup SQL
-- Run this in your Supabase SQL Editor

-- Create admin_users table to track which users have admin access
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own admin status
CREATE POLICY "Users can read own admin status"
    ON admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow users to insert themselves into admin_users (for signup)
CREATE POLICY "Users can insert themselves as admin"
    ON admin_users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Drop existing policies on resources if they exist
DROP POLICY IF EXISTS "Authenticated users can insert resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can update resources" ON resources;
DROP POLICY IF EXISTS "Authenticated users can delete resources" ON resources;

-- Create new admin-only policies for resources
CREATE POLICY "Admins can insert resources"
    ON resources
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

CREATE POLICY "Admins can update resources"
    ON resources
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete resources"
    ON resources
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Allow admins to read all resources (including inactive ones)
CREATE POLICY "Admins can read all resources"
    ON resources
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Note: Public can still read active resources (existing policy remains)
-- The "Public can read active resources" policy should already exist from your initial setup

-- IMPORTANT: With the new signup page, you no longer need to manually insert admin users.
-- Users can now sign up directly at /admin/signup and will be automatically added to admin_users.
-- 
-- However, if you need to manually add an admin user (optional):
-- INSERT INTO admin_users (id, email) 
-- VALUES ('USER_UUID_FROM_AUTH', 'admin@example.com');

