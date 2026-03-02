-- Instructor Reviews Table Setup SQL
-- Run this in your Supabase SQL Editor

-- Create instructor_reviews table
CREATE TABLE IF NOT EXISTS instructor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instructor_id UUID NOT NULL REFERENCES driving_instructors(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255), -- Optional, for verification
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT false, -- Admin can verify reviews
    is_approved BOOLEAN DEFAULT true, -- Admin can approve/hide reviews
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id), -- Optional, if user is logged in
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_instructor_reviews_instructor ON instructor_reviews(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_reviews_active ON instructor_reviews(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_instructor_reviews_rating ON instructor_reviews(instructor_id, rating);
CREATE INDEX IF NOT EXISTS idx_instructor_reviews_created ON instructor_reviews(instructor_id, created_at DESC);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_instructor_reviews_updated_at
    BEFORE UPDATE ON instructor_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update instructor rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_instructor_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3, 2);
    total_reviews_count INTEGER;
BEGIN
    -- Calculate average rating and total reviews for the instructor
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, total_reviews_count
    FROM instructor_reviews
    WHERE instructor_id = COALESCE(NEW.instructor_id, OLD.instructor_id)
        AND is_active = true
        AND is_approved = true;

    -- Update the instructor's rating and total_reviews
    UPDATE driving_instructors
    SET 
        rating = ROUND(avg_rating::numeric, 2),
        total_reviews = total_reviews_count,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.instructor_id, OLD.instructor_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update instructor rating
CREATE TRIGGER update_rating_on_review_insert
    AFTER INSERT ON instructor_reviews
    FOR EACH ROW
    WHEN (NEW.is_active = true AND NEW.is_approved = true)
    EXECUTE FUNCTION update_instructor_rating();

CREATE TRIGGER update_rating_on_review_update
    AFTER UPDATE ON instructor_reviews
    FOR EACH ROW
    WHEN (NEW.is_active != OLD.is_active OR NEW.is_approved != OLD.is_approved OR NEW.rating != OLD.rating)
    EXECUTE FUNCTION update_instructor_rating();

CREATE TRIGGER update_rating_on_review_delete
    AFTER DELETE ON instructor_reviews
    FOR EACH ROW
    WHEN (OLD.is_active = true AND OLD.is_approved = true)
    EXECUTE FUNCTION update_instructor_rating();

-- Enable Row Level Security (RLS)
ALTER TABLE instructor_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read approved, active reviews)
CREATE POLICY "Public can read approved instructor reviews"
    ON instructor_reviews
    FOR SELECT
    USING (is_active = true AND is_approved = true);

-- Create policy for public insert (anyone can submit a review)
CREATE POLICY "Public can submit instructor reviews"
    ON instructor_reviews
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy for authenticated users to update their own reviews (optional)
CREATE POLICY "Users can update their own reviews"
    ON instructor_reviews
    FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

-- Create policy for authenticated users to delete their own reviews (optional)
CREATE POLICY "Users can delete their own reviews"
    ON instructor_reviews
    FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());

-- Create policy for authenticated admins to manage all reviews
CREATE POLICY "Admins can manage all reviews"
    ON instructor_reviews
    FOR ALL
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

-- Example: After creating reviews, ratings will be automatically calculated
-- You can test with:
-- INSERT INTO instructor_reviews (instructor_id, reviewer_name, rating, review_text) 
-- VALUES ('INSTRUCTOR_UUID', 'John Doe', 5, 'Great instructor!');


