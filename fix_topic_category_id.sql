-- Fix topic category_id: Change 'driving' to 'immigration'
-- This will move topics from the driving category to the immigration category

UPDATE public.topics
SET category_id = 'immigration'
WHERE category_id = 'driving';

-- Verify the update
SELECT 
    id,
    category_id,
    title_ku,
    title_ar,
    slug,
    is_active,
    display_order
FROM public.topics
WHERE category_id = 'immigration'
ORDER BY display_order, title_ku;


