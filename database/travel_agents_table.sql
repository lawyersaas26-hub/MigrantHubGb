-- Travel Agents table for travel agent listings
CREATE TABLE IF NOT EXISTS travel_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    agency_name TEXT,
    services TEXT[], -- Array of services: flights, hotels, visas, packages, insurance, etc.
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
CREATE INDEX IF NOT EXISTS idx_travel_agents_is_active ON travel_agents(is_active);
CREATE INDEX IF NOT EXISTS idx_travel_agents_created_at ON travel_agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_agents_location ON travel_agents(location);

-- Enable Row Level Security
ALTER TABLE travel_agents ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active travel agents
CREATE POLICY "Anyone can view active travel agents"
    ON travel_agents FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert travel agents (pending approval)
CREATE POLICY "Anyone can insert travel agents"
    ON travel_agents FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update travel agents (for admin approval via service role or admin dashboard)
CREATE POLICY "Anyone can update travel agents"
    ON travel_agents FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete travel agents (for admin deletion via service role or admin dashboard)
CREATE POLICY "Anyone can delete travel agents"
    ON travel_agents FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_travel_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_travel_agents_updated_at
    BEFORE UPDATE ON travel_agents
    FOR EACH ROW
    EXECUTE FUNCTION update_travel_agents_updated_at();










