# Expo Migration (partial) — phimmoi

This repository contains a migration of the Vite React web app to an Expo (React Native) project targeting Expo SDK 54 (Expo Go 54.0.6).

What I converted so far
- Root `App.js` (React Navigation stack)
- `app.json` with `sdkVersion: 54.0.0`
- Basic RN screens: `screens/HomeScreen.js`, `screens/MovieDetailScreen.js`
- RN components: `components/MovieCard.js`, `components/Navbar.js`, `components/Footer.js`
- `utils/storage.js` — AsyncStorage wrapper
- `assets/README.md`

Install and run (Expo SDK 54):

1) Install dependencies

```bash
npm install
npx expo install @expo/vector-icons react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack @tanstack/react-query @supabase/supabase-js
If you plan to play video on the Watch screen, also install:

```bash
npx expo install expo-av
```
```

2) Start Expo

```bash
npx expo start
```

Icons
-----
This migration replaces `lucide-react` icons with `@expo/vector-icons`. A mapping module is provided at `components/ui/icons.tsx` that exports commonly used icons under the same names used in the original code (e.g. `Search`, `User`, `Heart`, `Menu`).
3. Copy the RN files from this repository into your new Expo app (merge with the template):
- `App.js`, `app.json`, `screens/*`, `components/*`, `utils/*`, `assets/*`

4. Start Expo:
```bash
npx expo start
```

Notes on environment variables
- For Supabase, set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY` in your environment or in `app.json` under `extra` and access them with `expo-constants` or `process.env` depending on your setup.

Supabase quick env example (Unix/macOS):
```bash
export EXPO_PUBLIC_SUPABASE_URL="https://..."
export EXPO_PUBLIC_SUPABASE_KEY="public-..."
```



Notes and assumptions
- This migration aims to preserve application logic and services while replacing web UI with React Native primitives. Core screens and many UI components have been implemented in `components/` and `components/ui/`.
- The original `src/` web code has been backed up to `src_backup/`.
- Some advanced UI behaviors (complex popovers, web-only event models) were simplified into RN-friendly components. You may want to refine visual styles and interactions for production.

If you want me to continue, I can:
- Replace remaining references to web-only libraries and remove unused web files.
- Implement visual refinements and map every page's styles to `StyleSheet`.
- Run a validation `npx expo start` and iterate on runtime issues.

Next steps I can take (choose):
- Continue converting the remaining `src/pages/*` and `src/components/*` into RN equivalents.
- Create a script to move/rename web source into a `web/` folder and place RN source in `/app`.
- Replace all `localStorage` usage in `src/` with `utils/storage.js` wrappers and remove DOM/CSS imports.
