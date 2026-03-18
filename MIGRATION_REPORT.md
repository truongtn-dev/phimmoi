# Migration Report — partial automated migration to Expo SDK 54

Date: 2026-03-15

Summary
- Total source files scanned: 88 (original `src/`)
- Files converted to React Native (added/created under project root): ~50
- UI primitives stubbed (to satisfy imports): ~40
- Files removed: 0 (original `src/` preserved in `src_backup`)

Key changes
- Added `App.js` wired to `navigation/AppNavigator.js` (React Navigation native stack)
- Wrapped app with `@tanstack/react-query` provider
- Created `context/AuthContext.js` (supabase-compatible, uses AsyncStorage)
- Converted core screens: Home, MovieDetail, Watch, Search, Favorites, Profile, Login, Register, Admin, NotFound
- Converted many visible components: MovieCard, MovieCarousel, HeroBanner, PhimCard, PhimCarousel, AdBanner, Footer, Navbar, ProtectedRoute
- Added `services/` copies (`phimapi.js`, `tmdb.js`) for network API calls
- Replaced localStorage usage with `utils/storage.js` (AsyncStorage wrapper)
- Supabase client updated at `integrations/supabase/client.js` to use AsyncStorage
- Created RN-compatible UI stubs for ~40 web-only components under `components/ui/` to avoid import errors

Libraries replaced / notes
- Routing: `react-router` → `@react-navigation/native` + `@react-navigation/native-stack`
- Storage: `localStorage` → `@react-native-async-storage/async-storage`
- Supabase: client configured to use AsyncStorage for auth storage
- Icons: original `lucide-react` usage not fully mapped; install `@expo/vector-icons` and map icons as needed
- Radix / shadcn UI components: stubbed — recommend replacing with RN libraries or custom RN implementations

Files created (high level)
- `App.js`, `app.json`
- `navigation/AppNavigator.js`
- `context/AuthContext.js`
- `screens/*.js` (HomeScreen, MovieDetailScreen, SearchScreen, WatchScreen, FavoritesScreen, ProfileScreen, LoginScreen, RegisterScreen, AdminScreen, NotFoundScreen)
- `components/*.js` (MovieCard, MovieCarousel, MovieCardSkeleton, HeroBanner, Footer, AdBanner, PhimHeroBanner, PhimCard, PhimCarousel, NavLink, Navbar, ProtectedRoute, SEOHead)
- `components/ui/*` — many RN stubs
- `services/*` — `phimapi.js`, `tmdb.js`
- `utils/storage.js`

Remaining TODOs (to reach >=90% migration)
1. Replace all `lucide-react` icons across code with `@expo/vector-icons` equivalents (automatable but requires mapping decisions).
2. Convert full implementations for `components/ui/*` stubs — many are Radix or shadcn web-only and need RN counterparts.
3. Migrate or port any CSS/Tailwind styles into RN `StyleSheet` where visual parity is required.
4. Remove web-only files or place them under a `web/` folder if you need to keep the web app.
5. Thoroughly test Supabase flows on device (native network and auth flows may differ); set `EXPO_PUBLIC_SUPABASE_*` env vars.
6. Add `@expo/vector-icons` and map icons used in `Navbar`, buttons, lists, etc.
7. Install `expo-webview` if you need to embed external players (`iframe` replacement) and update Watch screen to use `WebView`.

How to finish and run
1. Create new Expo app and copy files into it (or use this folder as the Expo project root):
```bash
npx create-expo-app myApp
cd myApp
```
2. Install dependencies:
```bash
npm install @react-navigation/native @react-navigation/native-stack @tanstack/react-query @supabase/supabase-js @expo/vector-icons
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-masked-view/masked-view @react-native-async-storage/async-storage
```
3. Set Supabase env vars and start:
```bash
export EXPO_PUBLIC_SUPABASE_URL="..."
export EXPO_PUBLIC_SUPABASE_KEY="..."
npx expo start
```

If you want, I can now:
- Map `lucide-react` icons to `@expo/vector-icons` automatically (I will add replacements),
- Convert `components/ui/*` stubs to real RN implementations for the most-used ones,
- Remove CSS/Tailwind and translate critical styles into RN `StyleSheet`.
