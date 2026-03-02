-- Driving Instructors Table Setup SQL
-- Run this in your Supabase SQL Editor

-- Create driving_instructors table
CREATE TABLE IF NOT EXISTS driving_instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    location VARCHAR(255) NOT NULL, -- e.g., "London", "Manchester", "Birmingham"
    postcode VARCHAR(20), -- UK postcode for better location filtering
    languages_spoken TEXT[], -- Array of languages: ['ku', 'ar', 'en']
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00, -- Rating from 0.00 to 5.00
    total_reviews INTEGER DEFAULT 0,
    price_per_hour DECIMAL(10, 2), -- Price in GBP
    vehicle_type VARCHAR(50), -- 'manual', 'automatic', 'both'
    availability VARCHAR(50), -- 'full-time', 'part-time', 'weekends-only'
    bio TEXT, -- Instructor bio/description
    specialties TEXT[], -- Array of specialties: ['beginner', 'advanced', 'test-prep', 'refresher']
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false, -- Verified by admin
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_driving_instructors_location ON driving_instructors(location);
CREATE INDEX IF NOT EXISTS idx_driving_instructors_postcode ON driving_instructors(postcode);
CREATE INDEX IF NOT EXISTS idx_driving_instructors_active ON driving_instructors(is_active);
CREATE INDEX IF NOT EXISTS idx_driving_instructors_verified ON driving_instructors(is_verified);
CREATE INDEX IF NOT EXISTS idx_driving_instructors_rating ON driving_instructors(rating DESC);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_driving_instructors_updated_at
    BEFORE UPDATE ON driving_instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE driving_instructors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read active instructors)
CREATE POLICY "Public can read active driving instructors"
    ON driving_instructors
    FOR SELECT
    USING (is_active = true);

-- Create policy for authenticated users to insert (for admin)
CREATE POLICY "Authenticated users can insert driving instructors"
    ON driving_instructors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update (for admin)
CREATE POLICY "Authenticated users can update driving instructors"
    ON driving_instructors
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for authenticated users to delete (for admin)
CREATE POLICY "Authenticated users can delete driving instructors"
    ON driving_instructors
    FOR DELETE
    TO authenticated
    USING (true);

-- Example insert (you can add more via admin dashboard later)
-- INSERT INTO driving_instructors (
--     name, phone, email, location, postcode, languages_spoken, 
--     experience_years, rating, total_reviews, price_per_hour, 
--     vehicle_type, availability, bio, specialties, is_verified
-- ) VALUES (
--     'John Smith',
--     '+44 7700 900123',
--     'john.smith@example.com',
--     'London',
--     'SW1A 1AA',
--     ARRAY['en', 'ku'],
--     10,
--     4.8,
--     45,
--     35.00,
--     'both',
--     'full-time',
--     'Experienced driving instructor with 10 years of teaching experience. Specializes in helping nervous learners and test preparation.',
--     ARRAY['beginner', 'test-prep'],
--     true
-- );


