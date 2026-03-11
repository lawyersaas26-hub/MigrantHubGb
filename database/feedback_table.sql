-- Create enum for feedback types
CREATE TYPE feedback_type AS ENUM ('bug_report', 'feature_request', 'general_feedback');

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    feedback_type feedback_type NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unreviewed', -- 'unreviewed', 'in_progress', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated users can insert feedback
CREATE POLICY "Anyone can insert feedback" 
ON public.user_feedback 
FOR INSERT 
WITH CHECK (true);

-- Only admins/app logic can read all feedback (you can refine this later if needed)
CREATE POLICY "Users can view their own feedback" 
ON public.user_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

