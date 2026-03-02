-- Complete Jobs Table SQL Schema (Fixed Version)
-- This version ensures UUID generation works correctly

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop table if exists (use with caution - will delete all data!)
-- DROP TABLE IF EXISTS jobs CASCADE;

CREATE TABLE IF NOT EXISTS jobs (
    -- Primary Key with UUID generation
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

DROP TRIGGER IF EXISTS trigger_update_jobs_updated_at ON jobs;
CREATE TRIGGER trigger_update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Public can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can manage all jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own jobs" ON jobs;
DROP POLICY IF EXISTS "Anyone can insert jobs" ON jobs;

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

-- Policy: Anyone can insert jobs (most permissive)
CREATE POLICY "Anyone can insert jobs"
    ON jobs
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Verify the table structure
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'jobs'
ORDER BY ordinal_position;











