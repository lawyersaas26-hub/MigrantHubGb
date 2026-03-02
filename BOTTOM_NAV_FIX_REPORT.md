# Bottom Navigation Stability Fix

## Issue
The Bottom Navigation bar was disappearing on Android devices when scrolling. This was caused by `fixed` positioning interacting with mobile browser viewport resizing (address bar show/hide) and potentially stacking context issues.

## Fix Implemented
We have switched from a `fixed` positioning model to a **Flexbox App Shell** model.

### 1. App Layout (`App.tsx`)
- Changed the main app container to use `flex-col` with `height: 100dvh` (Dynamic Viewport Height).
- This ensures the container always fills the visible screen, adapting to mobile browser UI bars.
- `Content` area is `flex-1` and handles its own scrolling (`overflow-y-auto`).

### 2. Components (`Header.tsx`, `BottomNav.tsx`)
- Removed `position: fixed` from both components.
- They are now standard block elements within the flex container.
- `Header` stays at the top.
- `BottomNav` stays at the bottom.
- Removed manual `padding-top` and `padding-bottom` from the main content area, as the flex layout handles spacing naturally.

### 3. CSS Cleanup (`index.css`)
- Removed aggressive `!important` overrides that were forcing `fixed` positioning on the navigation bar.
- Restored `html, body { overflow: hidden }` to ensure only the app container scrolls.

## Verification
1. Open the app on Android (or resize browser to mobile size).
2. Scroll up and down in the main content area.
3. Verify that:
   - The **Bottom Navigation** remains anchored to the bottom of the screen.
   - The **Header** remains anchored to the top.
   - Only the content between them scrolls.
   - No content is hidden behind the nav bar (check the very bottom of the list).
