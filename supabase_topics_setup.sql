-- Topics/Subcategories Table Setup SQL
-- Run this in your Supabase SQL Editor
-- This allows creating subcategories/topics under main categories (e.g., "Settling in the UK" under Immigration)

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title_ku TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    description_ku TEXT,
    description_ar TEXT,
    description_en TEXT,
    slug VARCHAR(500) NOT NULL, -- URL-friendly identifier
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique slug per category
    CONSTRAINT topics_slug_unique UNIQUE (category_id, slug)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category_id);
CREATE INDEX IF NOT EXISTS idx_topics_active ON topics(is_active);
CREATE INDEX IF NOT EXISTS idx_topics_display_order ON topics(category_id, display_order);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read active topics)
CREATE POLICY "Public can read active topics"
    ON topics
    FOR SELECT
    USING (is_active = true);

-- Create policy for authenticated users to insert (for admin)
CREATE POLICY "Authenticated users can insert topics"
    ON topics
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy for authenticated users to update (for admin)
CREATE POLICY "Authenticated users can update topics"
    ON topics
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy for authenticated users to delete (for admin)
CREATE POLICY "Authenticated users can delete topics"
    ON topics
    FOR DELETE
    TO authenticated
    USING (true);

-- Create topic_resources junction table to link topics with resources
-- This allows resources to belong to both a category and a topic
CREATE TABLE IF NOT EXISTS topic_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a resource can only be linked to a topic once
    CONSTRAINT topic_resources_unique UNIQUE (topic_id, resource_id)
);

-- Create indexes for topic_resources
CREATE INDEX IF NOT EXISTS idx_topic_resources_topic ON topic_resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_resources_resource ON topic_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_topic_resources_display_order ON topic_resources(topic_id, display_order);

-- Enable RLS on topic_resources
ALTER TABLE topic_resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can read topic resources"
    ON topic_resources
    FOR SELECT
    USING (true);

-- Create policy for authenticated users to manage topic resources (for admin)
CREATE POLICY "Authenticated users can manage topic resources"
    ON topic_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Example: Create "Settling in the UK" topic under immigration category
-- INSERT INTO topics (category_id, title_ku, title_ar, title_en, slug, description_ku, description_ar, display_order)
-- VALUES (
--     'immigration',
--     'نیشتەجێبوون لە بەریتانیا',
--     'الاستقرار في المملكة المتحدة',
--     'Settling in the UK',
--     'settling-in-the-uk',
--     'زانیاری دەربارەی نیشتەجێبوون و دامەزراندن لە بەریتانیا',
--     'معلومات حول الاستقرار والتوطين في المملكة المتحدة',
--     1
-- );


