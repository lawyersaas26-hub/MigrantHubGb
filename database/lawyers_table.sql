-- Lawyers table for lawyer listings
CREATE TABLE IF NOT EXISTS lawyers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    firm_name TEXT,
    specialization TEXT, -- immigration, family, criminal, etc.
    location TEXT NOT NULL,
    description TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    website TEXT,
    languages TEXT[], -- Array of languages spoken
    experience_years INTEGER,
    consultation_fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT FALSE, -- Admin approval status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lawyers_is_active ON lawyers(is_active);
CREATE INDEX IF NOT EXISTS idx_lawyers_created_at ON lawyers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lawyers_location ON lawyers(location);
CREATE INDEX IF NOT EXISTS idx_lawyers_specialization ON lawyers(specialization);

-- Enable Row Level Security
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active lawyers
CREATE POLICY "Anyone can view active lawyers"
    ON lawyers FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert lawyers (pending approval)
CREATE POLICY "Anyone can insert lawyers"
    ON lawyers FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update lawyers (for admin approval via service role or admin dashboard)
CREATE POLICY "Anyone can update lawyers"
    ON lawyers FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete lawyers (for admin deletion via service role or admin dashboard)
CREATE POLICY "Anyone can delete lawyers"
    ON lawyers FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lawyers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_lawyers_updated_at
    BEFORE UPDATE ON lawyers
    FOR EACH ROW
    EXECUTE FUNCTION update_lawyers_updated_at();

