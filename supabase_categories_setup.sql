-- Categories Table Setup SQL
-- Run this in your Supabase SQL Editor after running supabase_admin_setup.sql
-- 
-- IMPORTANT: After running this script, also run fix_resources_category_constraint.sql
-- to remove the hardcoded category check constraint and allow dynamic categories.

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name_ku TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    color VARCHAR(50) NOT NULL DEFAULT 'bg-indigo-600',
    icon_name VARCHAR(50) NOT NULL DEFAULT 'FileText',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    description_ku TEXT,
    description_ar TEXT,
    description_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Public can read active categories"
    ON categories
    FOR SELECT
    TO authenticated, anon
    USING (is_active = true);

-- Admins can read all categories
CREATE POLICY "Admins can read all categories"
    ON categories
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Admins can insert categories
CREATE POLICY "Admins can insert categories"
    ON categories
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Admins can update categories
CREATE POLICY "Admins can update categories"
    ON categories
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Admins can delete categories
CREATE POLICY "Admins can delete categories"
    ON categories
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid()
        )
    );

-- Insert default categories (matching current constants)
INSERT INTO categories (id, name_ku, name_ar, name_en, color, icon_name, display_order) VALUES
('immigration', 'کۆچبەری', 'الهجرة', 'Immigration', 'bg-blue-600', 'FileText', 1),
('housing', 'خانە', 'السكن', 'Housing', 'bg-purple-600', 'Home', 2),
('employment', 'کار', 'العمل', 'Employment', 'bg-teal-600', 'Briefcase', 3),
('education', 'پەروەردە', 'التعليم', 'Education', 'bg-rose-600', 'GraduationCap', 4),
('healthcare', 'چاودێری تەندروستی', 'الرعاية الصحية', 'Healthcare', 'bg-pink-500', 'Heart', 5),
('legal', 'یاسایی', 'قانوني', 'Legal', 'bg-orange-600', 'Scale', 6),
('financial', 'دارایی', 'المالية', 'Financial', 'bg-purple-600', 'Wallet', 7),
('culture', 'کلتور', 'الثقافة', 'Culture', 'bg-teal-600', 'Globe', 8),
('emergency', 'ناوچە', 'طوارئ', 'Emergency', 'bg-blue-600', 'Phone', 9)
ON CONFLICT (id) DO NOTHING;

