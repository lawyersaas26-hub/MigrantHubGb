# Converting to Expo/React Native for Expo Go

## What Needs to Change

### Current (React Web) → React Native

1. **Replace HTML Elements:**
   - `<div>` → `<View>`
   - `<button>` → `<Pressable>` or `<TouchableOpacity>`
   - `<input>` → `<TextInput>`
   - `<span>`, `<p>` → `<Text>`
   - `<header>`, `<main>`, `<section>` → `<View>`

2. **Replace Styling:**
   - Tailwind CSS classes → `StyleSheet` or `styled-components`
   - `className` → `style` prop

3. **Replace Icons:**
   - `lucide-react` → `@expo/vector-icons` or `react-native-vector-icons`

4. **Replace Context/DOM APIs:**
   - `document.documentElement.lang` → React Native equivalent
   - RTL support needs `react-native-i18n` or similar

5. **Add Navigation:**
   - Need `@react-navigation/native` for navigation

## Estimated Time: 2-3 days of work

