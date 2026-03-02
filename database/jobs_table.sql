-- Jobs Table SQL Schema
-- This table stores job postings submitted by users and admins

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
    type TEXT CHECK (type IN ('full-time', 'part-time', 'contract', 'temporary', NULL)),
    requirements TEXT,
    apply_url TEXT,
    apply_email TEXT,
    category TEXT CHECK (category IN ('retail', 'warehouse', 'hospitality', 'cleaning', 'security', 'office', 'other', NULL)),
    
    -- Status & Approval
    is_active BOOLEAN DEFAULT FALSE, -- Set to true after admin approval
    is_verified BOOLEAN DEFAULT FALSE, -- For verified employers
    is_featured BOOLEAN DEFAULT FALSE, -- For featured job postings
    
    -- Dates
    posted_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE, -- Optional: Job posting expiry date
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Tracking
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    -- User Tracking
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Additional Metadata
    contact_phone TEXT,
    contact_name TEXT,
    work_location_type TEXT CHECK (work_location_type IN ('on-site', 'remote', 'hybrid', NULL)),
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive', NULL)),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (apply_email IS NULL OR apply_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_url CHECK (apply_url IS NULL OR apply_url ~* '^https?://'),
    CONSTRAINT valid_salary CHECK (salary IS NULL OR salary ~* '^[£$€]?\d+')
);

-- Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured) WHERE is_featured = TRUE;

-- Create Full-Text Search Index
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(description, '') || ' ' || coalesce(location, ''))
);

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

-- Policy: Authenticated users can insert jobs (for public submissions)
CREATE POLICY "Authenticated users can insert jobs"
    ON jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Public can insert jobs (for anonymous submissions)
CREATE POLICY "Public can insert jobs"
    ON jobs
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all jobs"
    ON jobs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.user_id = auth.uid()
            AND user_profiles.is_admin = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.user_id = auth.uid()
            AND user_profiles.is_admin = TRUE
        )
    );

-- Policy: Users can view their own submitted jobs
CREATE POLICY "Users can view their own jobs"
    ON jobs
    FOR SELECT
    TO authenticated
    USING (created_by = auth.uid());

-- Comments for Documentation
COMMENT ON TABLE jobs IS 'Stores job postings submitted by users and admins';
COMMENT ON COLUMN jobs.is_active IS 'Job is active and visible to public (requires admin approval)';
COMMENT ON COLUMN jobs.is_verified IS 'Job is from a verified employer';
COMMENT ON COLUMN jobs.is_featured IS 'Job is featured and shown prominently';
COMMENT ON COLUMN jobs.views_count IS 'Number of times this job has been viewed';
COMMENT ON COLUMN jobs.applications_count IS 'Number of applications received';
COMMENT ON COLUMN jobs.work_location_type IS 'Type of work location: on-site, remote, or hybrid';
COMMENT ON COLUMN jobs.experience_level IS 'Required experience level for the job';











