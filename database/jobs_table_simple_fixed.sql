-- Simple Jobs Table SQL Schema (Fixed Version)
-- This version works without requiring user_profiles table

CREATE TABLE IF NOT EXISTS jobs (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Required Fields
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Optional Fields
    salary TEXT,
    type TEXT, -- full-time, part-time, contract, temporary
    requirements TEXT,
    apply_url TEXT,
    apply_email TEXT,
    category TEXT, -- retail, warehouse, hospitality, cleaning, security, office, other
    contact_phone TEXT, -- Contact phone number
    
    -- Status
    is_active BOOLEAN DEFAULT FALSE, -- Set to true after admin approval
    
    -- Dates
    posted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User Tracking
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);

-- Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active jobs
CREATE POLICY "Anyone can view active jobs"
    ON jobs
    FOR SELECT
    USING (is_active = TRUE);

-- Policy: Public can insert jobs
CREATE POLICY "Public can insert jobs"
    ON jobs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Authenticated users can insert jobs
CREATE POLICY "Authenticated users can insert jobs"
    ON jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Service role (admin) can manage all jobs
-- This allows admin operations through the Supabase dashboard or service role
-- Note: This policy allows full access to service_role key (admin operations)
-- Regular users cannot use this policy

-- For admin operations, you can either:
-- 1. Use service_role key in your admin panel (bypasses RLS)
-- 2. Create a user_profiles table and update the policy below
-- 3. Manually update jobs through Supabase dashboard

-- Optional: Admin policy (uncomment and adjust if you have user_profiles table)
/*
CREATE POLICY "Admins can manage all jobs"
    ON jobs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()  -- Adjust column name as needed
            AND user_profiles.is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()  -- Adjust column name as needed
            AND user_profiles.is_admin = TRUE
        )
    );
*/











