# Freelance App

A freelancing marketplace mobile app built with Expo (React Native) + TypeScript
+ Firebase. The project is built phase-by-phase following the specs in [`docs/`](./docs).

**Current phase: `AUTH_SYSTEM`** (see [`docs/00_PROJECT_STATE.md`](./docs/00_PROJECT_STATE.md)).

## Architecture

Strict layering (see [`docs/02_ARCHITECTURE.md`](./docs/02_ARCHITECTURE.md) and
[`docs/12_FIREBASE_RULES.md`](./docs/12_FIREBASE_RULES.md)):

```
UI (src/app) → hooks (src/hooks) → services (src/services) → Firebase
```

- `src/app/` — screens & routing (Expo Router). Never touches Firebase directly.
- `src/hooks/` — logic layer (`useAuth`, session state).
- `src/services/` — the ONLY layer that talks to Firebase (`firebase.ts`, `auth-service.ts`, `user-service.ts`).
- `src/context/` — global state (`AuthProvider`, session persistence).
- `src/types/` — TypeScript models.
- `src/utils/` — helpers (validation, error mapping).
- `src/components/` — reusable UI (`Button`, `TextField`, `Screen`, `RoleSelector`).

## Auth system (this phase)

- Register → create Firebase auth user → create Firestore `users/{uid}` document.
- Login → authenticate → load Firestore profile.
- Logout → Firebase `signOut`.
- Reset → send password reset email.
- Session persists across restarts (AsyncStorage on native, local persistence on web).

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Firebase web config
npm run start          # or: npm run android / npm run ios / npm run web
```

### Firebase configuration

Copy `.env.example` to `.env` and fill in the values from the Firebase console
(Project settings → General → Your apps → Web app → SDK setup and configuration):

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Enable **Email/Password** sign-in in Firebase Authentication and deploy the
Firestore security rules in [`firestore.rules`](./firestore.rules).

## Quality checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
```
