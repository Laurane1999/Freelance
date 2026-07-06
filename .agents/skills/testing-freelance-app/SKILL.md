---
name: testing-freelance-app
description: Test the Freelance Expo app end-to-end — Firestore rules on the emulator, a UI golden path (register, marketplace, hire, mission, chat) against real Firebase, and role-based bottom-tab navigation. Use when verifying auth/marketplace/missions/chat, role-gating, or navigation changes.
---

# Testing the Freelance app

Layers: (1) Firestore rules on the emulator, (2) UI flows against real Firebase.
Do the layer(s) relevant to what changed.

## Devin Secrets Needed
- Real Firebase web config values (apiKey, authDomain, projectId, etc.). These live in
  `.env` as `EXPO_PUBLIC_FIREBASE_*` (gitignored). If absent, ask the user for the
  `firebaseConfig` object. `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false` for real-Firebase tests.

## Part 1 — Firestore rules (emulator, shell only, no recording)
Validate role gating on the emulator because the live project may be in open test mode
(rules not enforced there).
- Needs Java >= 21 for `firebase-tools` (install `openjdk-21-jre-headless` if needed).
- Start the Firestore emulator (loads repo `firestore.rules`) on :8080, or reuse a running one.
- Run an adversarial test with `@firebase/rules-unit-testing` via
  `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node tests/rules.test.mjs`. Each rule needs a
  positive (allowed) and negative (denied) control; expect `RESULT: N passed, 0 failed`.

## Part 2 — UI flows (real Firebase, recorded)
App URL: http://localhost:8081. Register with role Client or Freelancer.

### CRITICAL gotcha: EXPO_PUBLIC_* env is baked in at dev-server start
Changing `.env` (or installing a new dependency) does NOT affect an already-running
`expo start` server. A server left running from a previous session may still point at the
emulator, so UI writes silently go to the wrong backend. ALWAYS restart the web server
before testing: kill the process on :8081 (no `lsof` — use `pkill -f "expo start"` or
find the pid), then `npx expo start --web --port 8081` and wait for HTTP 200. After a new
`npm`/`expo install`, a restart is REQUIRED for Metro to bundle the new module.

### Golden path (auth/marketplace/missions/chat)
register freelancer -> publish service -> register client -> client sees NO "+ New" but a
"Hire" button -> hire creates a `pending` mission -> open conversation -> send message.
Collections: `services`, `missions`, `conversations` (+ `messages` subcollection).
Mission title is stored as `serviceTitle` (not `title`) — check that field in probes.

### Role-based bottom-tab navigation (docs/16_NAVIGATION)
The authenticated shell (`src/app/(app)/_layout.tsx`) renders `<Tabs>`; role gating hides
tabs with `href: null`. Expected tab sets:
- Freelancer: Home, **Services**, Missions, Messages, Profile (no Notifications).
- Client: Home, Missions, Messages, **Notifications**, Profile (no Services).
The presence of Services (freelancer) vs Notifications (client) is the discriminating
signal — a broken build shows identical tabs for both roles. Notifications is a
placeholder screen ("No notifications yet."); the NOTIFICATIONS feature is out of scope.
Verification tips:
- The stripped page DOM lists each tab as `<a aria-selected="true|false" href="/...">Label</a>`
  — read it to assert the exact tab set and which tab is active, rather than relying only
  on pixels.
- Use the computer `zoom` action on region ~`[0, 705, 1024, 745]` to read the tab bar
  labels/icons and confirm the active tab is brand navy `#0A1F44`.

### Detecting whether rules are deployed
If a client account can write a restricted doc (e.g. create a service) directly via the
web SDK, the live project is in open test mode and PR rule changes are NOT enforced there.
Report it and tell the user to deploy: `firebase deploy --only firestore:rules` (their login).

## Practical tips
- Use fresh unique emails per run (timestamp suffix) to avoid "email already in use".
- On the register screen, the first click on a text field can drop leading characters —
  re-check field values in the DOM before submitting.
- Session persists via localStorage; "Log out" from Home returns to /login for the next role.
  Logout can need a moment; if a click seems ignored, tap the Home tab first then Log out.
- Clean up probe/junk docs from the live DB before recording so the marketplace is tidy.
