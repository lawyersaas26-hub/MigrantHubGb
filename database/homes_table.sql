-- Homes for Rent Table SQL Schema
CREATE TABLE IF NOT EXISTS homes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Required Fields
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    
    -- Optional Fields
    bedrooms INTEGER,
    bathrooms INTEGER,
    property_type TEXT, -- house, flat, apartment, studio, room
    furnished TEXT, -- furnished, unfurnished, part-furnished
    available_from DATE,
    minimum_tenancy_months INTEGER,
    deposit_amount DECIMAL(10, 2),
    bills_included BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT FALSE,
    garden_available BOOLEAN DEFAULT FALSE,
    pets_allowed BOOLEAN DEFAULT FALSE,
    
    -- Contact Information
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    
    -- Images
    images TEXT[], -- Array of image URLs
    
    -- Status & Approval
    is_active BOOLEAN DEFAULT FALSE, -- Set to true after admin approval
    
    -- Dates
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- User Tracking
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_homes_is_active ON homes(is_active);
CREATE INDEX IF NOT EXISTS idx_homes_created_at ON homes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_homes_location ON homes(location);
CREATE INDEX IF NOT EXISTS idx_homes_city ON homes(city);

-- Enable Row Level Security
ALTER TABLE homes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active homes
CREATE POLICY "Anyone can view active homes"
    ON homes FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert homes (pending approval)
CREATE POLICY "Anyone can insert homes"
    ON homes FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update homes (for admin approval)
CREATE POLICY "Anyone can update homes"
    ON homes FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete homes (for admin deletion)
CREATE POLICY "Anyone can delete homes"
    ON homes FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_homes_updated_at
    BEFORE UPDATE ON homes
    FOR EACH ROW
    EXECUTE FUNCTION update_homes_updated_at();






