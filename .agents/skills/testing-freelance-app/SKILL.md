---
name: testing-freelance-app
description: Test the Freelance Expo app end-to-end — Firestore rules on the emulator plus a UI golden path (register, marketplace, hire, mission, chat) against real Firebase. Use when verifying auth/marketplace/missions/chat or role-gating changes.
---

# Testing the Freelance app

Two complementary layers. Do both when a change touches rules AND UI.

## Devin Secrets Needed
- Real Firebase web config values (apiKey, authDomain, projectId, etc.). These live in
  `.env` as `EXPO_PUBLIC_FIREBASE_*` (gitignored). If absent, ask the user for the
  `firebaseConfig` object. `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false` for real-Firebase tests.

## Part 1 — Firestore rules (emulator, shell only, no recording)
Rules are the source of truth for role gating; validate them on the emulator because the
live project may be in open test mode (rules not enforced).
- Needs Java >= 21 for `firebase-tools` (install `openjdk-21-jre-headless` if needed).
- Start the Firestore emulator (loads repo `firestore.rules`) on :8080, or reuse a running one.
- Run an adversarial test with `@firebase/rules-unit-testing`, e.g. `tests/rules.test.mjs`,
  via `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node tests/rules.test.mjs`.
- Each rule should have a positive (allowed) and negative (denied) control. Expect a
  `RESULT: N passed, 0 failed` summary. Example checks: client cannot create a service;
  freelancer cannot create a mission; no self-hire; mission status transitions role-gated.

## Part 2 — UI golden path (real Firebase, recorded)
Proves the product works and that the UI enforces role separation.
Flow: register freelancer -> publish service -> register client -> client sees NO "+ New"
but a "Hire" button -> hire creates a `pending` mission -> open conversation -> send message.

### CRITICAL gotcha: EXPO_PUBLIC_* env is baked in at dev-server start
Changing `.env` does NOT affect an already-running `expo start` server. A server left
running from a previous session may still point at the emulator, so your UI writes silently
go to the wrong backend and appear as confusing per-user/disjoint data.
- Before recording, ALWAYS restart the web server so it picks up the current `.env`:
  kill the process on :8081, then `npx expo start --web --port 8081`, wait for HTTP 200.
- Verify the backend is real Firebase: the marketplace should reflect the live DB. Confirm a
  freshly published service actually lands in the live project with a small probe script
  (`initializeApp(config)` + `getDocs(collection(db,'services'))`) — collections: `services`,
  `missions`, `conversations` (+ `messages` subcollection).

### Detecting whether rules are deployed
If a client account can write a restricted doc (e.g. create a service) directly via the web
SDK, the live project is in open test mode and PR rule changes are NOT enforced there. Report
this and tell the user to deploy: `firebase deploy --only firestore:rules` (needs their login).

## Practical tips
- Use fresh unique emails per run (timestamp suffix) to avoid "email already in use".
- On the register screen, the first click on a text field can drop leading characters —
  re-check field values in the DOM before submitting; clear + retype if needed.
- Session persists via localStorage; "Log out" from home returns to /login for the next role.
- Clean up probe/junk docs from the live DB before recording so the marketplace is tidy.
