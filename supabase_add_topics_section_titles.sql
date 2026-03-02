-- Add topics section title fields to categories table
-- This allows custom section titles like "Settling in the UK" instead of default "Topics"

ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS topics_section_title_ku text NULL,
ADD COLUMN IF NOT EXISTS topics_section_title_ar text NULL,
ADD COLUMN IF NOT EXISTS topics_section_title_en text NULL;

-- Add comment to explain the fields
COMMENT ON COLUMN public.categories.topics_section_title_ku IS 'Custom title for topics section in Kurdish (e.g., "Settling in the UK")';
COMMENT ON COLUMN public.categories.topics_section_title_ar IS 'Custom title for topics section in Arabic';
COMMENT ON COLUMN public.categories.topics_section_title_en IS 'Custom title for topics section in English';

