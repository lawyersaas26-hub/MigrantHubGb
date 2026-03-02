-- Cars table for car advertisements
CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    fuel_type TEXT, -- petrol, diesel, electric, hybrid
    transmission TEXT, -- manual, automatic
    color TEXT,
    condition TEXT, -- new, used, certified-pre-owned
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT FALSE, -- Admin approval status
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cars_is_active ON cars(is_active);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active cars
CREATE POLICY "Anyone can view active cars"
    ON cars FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert cars (pending approval)
CREATE POLICY "Anyone can insert cars"
    ON cars FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update cars (for admin approval via service role or admin dashboard)
-- Note: In production, you may want to restrict this to authenticated admins only
-- For now, allowing updates so admin can approve/reject cars
CREATE POLICY "Anyone can update cars"
    ON cars FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete cars (for admin deletion via service role or admin dashboard)
-- Note: In production, you may want to restrict this to authenticated admins only
-- For now, allowing deletes so admin can remove cars
CREATE POLICY "Anyone can delete cars"
    ON cars FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_cars_updated_at();

