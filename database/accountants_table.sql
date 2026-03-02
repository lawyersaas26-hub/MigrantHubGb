-- Accountants table for accountant listings
CREATE TABLE IF NOT EXISTS accountants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    firm_name TEXT,
    specialization TEXT, -- tax, bookkeeping, audit, financial_planning, general
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
CREATE INDEX IF NOT EXISTS idx_accountants_is_active ON accountants(is_active);
CREATE INDEX IF NOT EXISTS idx_accountants_created_at ON accountants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_accountants_location ON accountants(location);
CREATE INDEX IF NOT EXISTS idx_accountants_specialization ON accountants(specialization);

-- Enable Row Level Security
ALTER TABLE accountants ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active accountants
CREATE POLICY "Anyone can view active accountants"
    ON accountants FOR SELECT
    USING (is_active = true);

-- Policy: Anyone can insert accountants (pending approval)
CREATE POLICY "Anyone can insert accountants"
    ON accountants FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can update accountants (for admin approval via service role or admin dashboard)
CREATE POLICY "Anyone can update accountants"
    ON accountants FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy: Anyone can delete accountants (for admin deletion via service role or admin dashboard)
CREATE POLICY "Anyone can delete accountants"
    ON accountants FOR DELETE
    USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_accountants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_accountants_updated_at
    BEFORE UPDATE ON accountants
    FOR EACH ROW
    EXECUTE FUNCTION update_accountants_updated_at();










