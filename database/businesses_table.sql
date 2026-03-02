-- Businesses table for business listings (sell/rent)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL,
    business_type TEXT, -- restaurant, shop, service, retail, other
    category TEXT, -- food, retail, beauty, automotive, services, other
    location TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    website TEXT,
    images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT FALSE, -- Admin approval status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_business_type ON businesses(business_type);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active businesses
CREATE POLICY "Anyone can view active businesses"
    ON businesses FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert businesses (pending approval)
CREATE POLICY "Anyone can insert businesses"
    ON businesses FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update businesses (for admin approval via service role or admin dashboard)
CREATE POLICY "Anyone can update businesses"
    ON businesses FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete businesses (for admin deletion via service role or admin dashboard)
CREATE POLICY "Anyone can delete businesses"
    ON businesses FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_businesses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_businesses_updated_at();









