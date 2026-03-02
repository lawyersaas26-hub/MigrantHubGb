# Content Management Guide

## 📚 How to Add and Manage Content Sources

This guide explains how to add new resources to the app, manage content sources, and whether you need a database like Supabase.

---

## 🎯 Current Setup: Static Content (No Database Required)

**Your app currently uses static content** stored in `constants/categoryContent.ts`. This means:
- ✅ **No database needed** - All content is in code
- ✅ **Simple to update** - Just edit the file
- ✅ **Fast** - No API calls, loads instantly
- ✅ **Works offline** - Content is bundled with app
- ⚠️ **Requires app update** - To change content, you need to rebuild the app

---

## 📝 How to Add New Resources

### Step 1: Open the Content File
```
constants/categoryContent.ts
```

### Step 2: Find the Category
Each category has content in both Kurdish (`ku`) and Arabic (`ar`).

### Step 3: Add a New Resource
Add a new object to the `resources` array:

```typescript
{
    title: 'Title in Kurdish/Arabic',
    description: 'Description of the resource',
    link: 'https://example.com',  // Optional: Website URL
    phone: '0800 123 456',        // Optional: Phone number
    email: 'info@example.com',    // Optional: Email address
    source: 'Organization Name',   // Optional: Source of information
}
```

### Example: Adding a New Resource

**Before:**
```typescript
immigration: {
    description: 'زانیاری دەربارەی کۆچکردن...',
    resources: [
        {
            title: 'ماڵپەڕی کۆچکردنی بەریتانیا',
            description: 'زانیاری فەرمی...',
            link: 'https://www.gov.uk/browse/visas-immigration',
            source: 'UK Government',
        },
    ],
},
```

**After (Adding new resource):**
```typescript
immigration: {
    description: 'زانیاری دەربارەی کۆچکردن...',
    resources: [
        {
            title: 'ماڵپەڕی کۆچکردنی بەریتانیا',
            description: 'زانیاری فەرمی...',
            link: 'https://www.gov.uk/browse/visas-immigration',
            source: 'UK Government',
        },
        {
            title: 'یارمەتی کۆچکردن - ناوەندێکی نوێ',
            description: 'زانیاری دەربارەی یارمەتی کۆچکردن',
            link: 'https://example.com/immigration-help',
            phone: '0800 123 456',
            source: 'Immigration Help Center',
        },
    ],
},
```

### Step 4: Add Translation
**Important:** Add the same resource in both languages (Kurdish and Arabic).

**Kurdish section:**
```typescript
ku: {
    immigration: {
        resources: [
            // ... Kurdish content
        ],
    },
}
```

**Arabic section:**
```typescript
ar: {
    immigration: {
        resources: [
            // ... Arabic content
        ],
    },
}
```

### Step 5: Rebuild and Test
```bash
npm run build
npx cap sync
# Test on device
```

---

## 📋 Content Source Guidelines

### 1. **Reliable Sources**
Use official and trusted sources:
- ✅ UK Government websites (`gov.uk`)
- ✅ NHS (`nhs.uk`)
- ✅ Official charities (Citizens Advice, Shelter, etc.)
- ✅ Local councils
- ❌ Avoid personal blogs or unverified websites

### 2. **Source Information**
Always include the `source` field:
```typescript
source: 'UK Government'        // Official government
source: 'NHS'                  // National Health Service
source: 'Citizens Advice'      // Charity organization
source: 'Local Council'        // Local authority
source: 'Community Organization' // Community group
```

### 3. **Keep Information Updated**
- Check links regularly (they might break)
- Update phone numbers if they change
- Verify information is still accurate
- Remove outdated resources

---

## 🔄 When Do You Need Supabase (or Another Database)?

### ❌ **You DON'T Need Supabase If:**
- ✅ Content doesn't change frequently
- ✅ You're okay rebuilding the app to update content
- ✅ Content is relatively small (< 1000 resources)
- ✅ You want simple, fast setup
- ✅ You don't need real-time updates

**Current setup is perfect for this!**

### ✅ **You DO Need Supabase If:**
- 🔄 Content changes frequently (daily/weekly)
- 🔄 You want to update content without rebuilding the app
- 🔄 Multiple people need to edit content
- 🔄 You need a content management interface
- 🔄 Content is very large (> 1000 resources)
- 🔄 You want to track content analytics
- 🔄 You need user-generated content

---

## 🗄️ How to Use Supabase (If Needed)

If you decide you need dynamic content management, here's how to set it up:

### Step 1: Install Supabase
```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Tables

```sql
-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name_ku TEXT,
  name_ar TEXT,
  description_ku TEXT,
  description_ar TEXT,
  icon TEXT,
  color TEXT
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT REFERENCES categories(id),
  title_ku TEXT,
  title_ar TEXT,
  description_ku TEXT,
  description_ar TEXT,
  link TEXT,
  phone TEXT,
  email TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Create API Service

```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCategoryContent(categoryId: string, language: 'ku' | 'ar') {
    const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category_id', categoryId);
    
    if (error) throw error;
    
    return data.map(resource => ({
        title: resource[`title_${language}`],
        description: resource[`description_${language}`],
        link: resource.link,
        phone: resource.phone,
        email: resource.email,
        source: resource.source,
    }));
}
```

### Step 4: Update Components
Replace static content loading with API calls.

---

## 📊 Comparison: Static vs. Database

| Feature | Static Content (Current) | Supabase/Database |
|---------|-------------------------|-------------------|
| **Setup Time** | ✅ 5 minutes | ⚠️ 1-2 hours |
| **Update Content** | ⚠️ Rebuild app | ✅ Update in database |
| **Cost** | ✅ Free | ⚠️ $0-25/month |
| **Speed** | ✅ Instant | ⚠️ Network request |
| **Offline** | ✅ Works offline | ❌ Needs internet |
| **Complexity** | ✅ Simple | ⚠️ More complex |
| **Content Management** | ⚠️ Code editor | ✅ Web interface |
| **Real-time Updates** | ❌ No | ✅ Yes |

---

## 🎯 Recommendation

**For your current app: Stick with static content!**

**Why?**
1. ✅ Your content doesn't change daily
2. ✅ Simple to manage
3. ✅ Fast and works offline
4. ✅ No extra costs
5. ✅ No database setup needed

**Consider Supabase later if:**
- You get hundreds of requests to update content
- You need multiple content editors
- You want to add user-generated content
- Content needs to update in real-time

---

## 📝 Content Update Workflow (Current Setup)

1. **Edit** `constants/categoryContent.ts`
2. **Add** new resources in both languages
3. **Test** locally: `npm run dev`
4. **Build**: `npm run build`
5. **Sync**: `npx cap sync`
6. **Deploy** new app version

---

## 🔍 Finding Reliable Sources

### Government Resources:
- `gov.uk` - Official UK government
- `nhs.uk` - National Health Service
- Local council websites

### Charities & Organizations:
- Citizens Advice
- Shelter
- Refugee Council
- Local community centers

### How to Verify:
1. Check the website is official
2. Look for `.gov.uk` or `.org.uk` domains
3. Verify phone numbers work
4. Check information is current
5. Test links before adding

---

## 📞 Example: Adding a New Emergency Service

```typescript
emergency: {
    resources: [
        // ... existing resources
        {
            title: 'یارمەتی قەیرانی نوێ', // Kurdish
            description: 'ژمارەی یارمەتی قەیران',
            phone: '0800 123 456',
            source: 'Crisis Support Line',
        },
    ],
},
```

And in Arabic:
```typescript
emergency: {
    resources: [
        // ... existing resources
        {
            title: 'خط المساعدة للأزمات', // Arabic
            description: 'رقم خط المساعدة للأزمات',
            phone: '0800 123 456',
            source: 'Crisis Support Line',
        },
    ],
},
```

---

## ✅ Summary

1. **Current Setup**: Static content in `categoryContent.ts` ✅
2. **No Database Needed**: Unless you need frequent updates ✅
3. **Easy to Update**: Just edit the file and rebuild ✅
4. **Reliable Sources**: Use official websites and organizations ✅
5. **Bilingual**: Always add content in both Kurdish and Arabic ✅

**Your current approach is perfect for this app!** 🎉

