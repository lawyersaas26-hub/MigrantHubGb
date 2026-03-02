# App Development Roadmap

## ✅ What's Currently Working

- ✅ Basic UI structure (Header, HeroBanner, CategoryGrid, BottomNav)
- ✅ Language switching (Kurdish ↔ Arabic)
- ✅ Category display with icons
- ✅ Mobile app running on Android/iOS
- ✅ RTL layout support

---

## 🚀 Next Development Steps (Prioritized)

### **Phase 1: Core Navigation & Routing** (Priority: 🔴 HIGH)

**Goal**: Enable navigation between different screens

#### 1.1 Add Routing System
- Install React Router: `npm install react-router-dom`
- Set up routes for:
  - Home page (current view)
  - Category detail pages
  - Favorites page
  - Account page
  - Search results page

#### 1.2 Update RTL Direction on Language Change
- Fix `document.documentElement.dir` to switch between 'rtl' and 'ltr'
- Update HTML direction attribute when language changes

**Estimated Time**: 2-3 hours

---

### **Phase 2: Category Detail Pages** (Priority: 🔴 HIGH)

**Goal**: Show content when users tap a category

#### 2.1 Create Category Detail Page Component
- Create `CategoryDetail.tsx` component
- Display category information
- Show resources/links for that category
- Add back navigation

#### 2.2 Add Category Content Data
- Create `constants/categoryContent.ts` with resources for each category:
  - Immigration: Visa info, documentation, government links
  - Housing: Rental guides, council housing, support services
  - Employment: Job search, CV help, work permits
  - Education: Schools, courses, qualifications
  - Healthcare: NHS registration, GP finder, health services
  - Legal: Legal aid, immigration lawyers, rights
  - Financial: Banking, benefits, money management
  - Culture: Community centers, events, cultural resources
  - Emergency: Emergency numbers, crisis support, helplines

#### 2.3 Make Categories Clickable
- Add onClick handler to CategoryItem
- Navigate to category detail page
- Pass category data via route params

**Estimated Time**: 4-6 hours

---

### **Phase 3: Search Functionality** (Priority: 🟡 MEDIUM)

**Goal**: Enable users to search for resources

#### 3.1 Implement Search
- Add search state management
- Create search results page
- Filter categories and resources by search query
- Add search input functionality in HeroBanner

#### 3.2 Search Features
- Search across all categories
- Search within category content
- Highlight search terms in results
- Show "No results" message

**Estimated Time**: 3-4 hours

---

### **Phase 4: Favorites/Bookmarks** (Priority: 🟡 MEDIUM)

**Goal**: Let users save favorite resources

#### 4.1 Create Favorites Page
- Create `Favorites.tsx` component
- Display saved favorites
- Show empty state when no favorites

#### 4.2 Add Favorites Functionality
- Install/use localStorage or Capacitor Storage
- Add "Add to Favorites" button on resource items
- Save favorites to local storage
- Remove from favorites functionality

#### 4.3 Update Bottom Navigation
- Show favorites page when clicked
- Display favorites count badge (optional)

**Estimated Time**: 3-4 hours

---

### **Phase 5: Account/Profile Page** (Priority: 🟢 LOW)

**Goal**: User profile and settings

#### 5.1 Create Account Page
- Create `Account.tsx` component
- Display user profile (name, avatar)
- Settings section

#### 5.2 Account Features
- Language preference (save selection)
- Notification settings
- About/Help section
- App version info

**Estimated Time**: 2-3 hours

---

### **Phase 6: Data & Content** (Priority: 🔴 HIGH)

**Goal**: Add real, useful content for Iraqi immigrants

#### 6.1 Research & Add Content
- UK government resources
- Official immigration websites
- NHS information
- Housing support services
- Employment services
- Legal aid resources
- Financial support information
- Cultural organizations
- Emergency contacts

#### 6.2 Content Structure
- Title (bilingual)
- Description (bilingual)
- Links/URLs
- Contact information
- Categories/tags

**Estimated Time**: 8-12 hours (research + data entry)

---

### **Phase 7: Enhanced Features** (Priority: 🟢 LOW)

#### 7.1 Local Storage
- Save language preference
- Save favorites
- Cache content (offline support)

#### 7.2 Improved UI/UX
- Loading states
- Error handling
- Empty states
- Animations/transitions
- Pull to refresh

#### 7.3 Mobile-Specific Features
- Haptic feedback on button presses
- Status bar styling
- Splash screen customization
- App icons

**Estimated Time**: 4-6 hours

---

## 📋 Recommended Development Order

### **Week 1: Core Functionality**
1. ✅ **Day 1-2**: Add routing system (Phase 1)
2. ✅ **Day 3-4**: Create category detail pages (Phase 2)
3. ✅ **Day 5**: Make categories clickable and test navigation

### **Week 2: Features & Content**
1. ✅ **Day 1-2**: Add search functionality (Phase 3)
2. ✅ **Day 3-4**: Implement favorites (Phase 4)
3. ✅ **Day 5**: Add account page (Phase 5)

### **Week 3: Content & Polish**
1. ✅ **Day 1-3**: Research and add real content (Phase 6)
2. ✅ **Day 4-5**: Enhance UI/UX and mobile features (Phase 7)

---

## 🛠️ Technical Requirements

### Packages to Install:
```bash
# Routing
npm install react-router-dom
npm install --save-dev @types/react-router-dom

# Storage (optional, Capacitor has built-in storage)
npm install @capacitor/preferences

# Icons (already have lucide-react)
# No additional packages needed
```

### New Files to Create:
```
src/
├── pages/
│   ├── Home.tsx
│   ├── CategoryDetail.tsx
│   ├── Favorites.tsx
│   ├── Account.tsx
│   └── SearchResults.tsx
├── constants/
│   └── categoryContent.ts
└── utils/
    └── storage.ts (for favorites)
```

---

## 🎯 Quick Wins (Do These First)

1. **Add React Router** - Enables all navigation
2. **Fix RTL direction switching** - Better UX
3. **Make one category clickable** - Proof of concept
4. **Add basic category content** - Show value immediately

---

## 📱 Testing Checklist

After each phase:
- [ ] Test on Android device
- [ ] Test on iOS device (if available)
- [ ] Test language switching
- [ ] Test RTL layout
- [ ] Test navigation flow
- [ ] Test on different screen sizes

---

## 🚀 Ready to Start?

I recommend starting with **Phase 1: Core Navigation & Routing**. This will unlock all other features.

Would you like me to:
1. ✅ Set up React Router and navigation?
2. ✅ Create the first category detail page?
3. ✅ Add search functionality?
4. ✅ Something else?

Let me know which phase you'd like to start with!

