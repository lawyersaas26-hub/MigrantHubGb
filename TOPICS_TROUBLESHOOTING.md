# Topics Not Showing - Troubleshooting Guide

## Common Reasons Topics Don't Show

### 1. **Topic is Inactive (`is_active = false`)**
The app only displays topics where `is_active = true`. 

**Fix:**
```sql
UPDATE topics 
SET is_active = true 
WHERE id = 'your-topic-id';
```

### 2. **Wrong Category ID**
The topic's `category_id` doesn't match the category you're viewing.

**Check:**
```sql
SELECT id, title_ku, category_id, is_active 
FROM topics 
WHERE id = 'your-topic-id';
```

**Fix:**
```sql
UPDATE topics 
SET category_id = 'immigration' 
WHERE id = 'your-topic-id';
```

### 3. **Missing Required Fields**
Topics must have:
- `title_ku` (required)
- `title_ar` (required)  
- `slug` (required)
- `category_id` (required)

**Check:**
```sql
SELECT id, title_ku, title_ar, slug, category_id, is_active 
FROM topics 
WHERE id = 'your-topic-id';
```

### 4. **NULL is_active Value**
If `is_active` is NULL, it won't match `is_active = true`.

**Fix:**
```sql
UPDATE topics 
SET is_active = true 
WHERE is_active IS NULL;
```

## Debugging Steps

1. **Check if topic exists:**
```sql
SELECT * FROM topics WHERE id = 'your-topic-id';
```

2. **Check all topics for a category:**
```sql
SELECT id, title_ku, is_active, slug, category_id 
FROM topics 
WHERE category_id = 'immigration'
ORDER BY display_order, title_ku;
```

3. **Check active topics only:**
```sql
SELECT id, title_ku, is_active, slug 
FROM topics 
WHERE category_id = 'immigration' 
  AND is_active = true
ORDER BY display_order, title_ku;
```

4. **Check browser console** for error messages when loading the category page.

## Verify Your Topic

Run this query to check all important fields:
```sql
SELECT 
    id,
    category_id,
    title_ku,
    title_ar,
    slug,
    is_active,
    display_order,
    created_at
FROM topics 
WHERE category_id = 'immigration'
ORDER BY display_order, title_ku;
```

## Quick Fix SQL

To activate a topic and ensure it has correct values:
```sql
UPDATE topics 
SET 
    is_active = true,
    category_id = 'immigration',  -- Make sure this matches your category
    display_order = COALESCE(display_order, 0)
WHERE id = 'your-topic-id';
```


