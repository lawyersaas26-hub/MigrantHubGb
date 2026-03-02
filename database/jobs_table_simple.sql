-- Simple Jobs Table SQL Schema (Minimal Version)
-- Use this if you want a simpler version without all the extra features

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

-- Policy: Admins can manage all jobs
-- Note: Adjust this policy based on your user_profiles table structure
-- If user_profiles table doesn't exist or has different column names, 
-- you can temporarily disable admin policies or adjust them accordingly
CREATE POLICY "Admins can manage all jobs"
    ON jobs
    FOR ALL
    TO authenticated
    USING (
        -- Check if user_profiles table exists and has the correct structure
        -- If your user_profiles table uses 'id' instead of 'user_id', change it
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE (user_profiles.user_id = auth.uid() OR user_profiles.id = auth.uid())
            AND user_profiles.is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE (user_profiles.user_id = auth.uid() OR user_profiles.id = auth.uid())
            AND user_profiles.is_admin = TRUE
        )
    );

