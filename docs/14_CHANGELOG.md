# CHANGELOG

## v1.0
- Initial docs system created
- Architecture defined
- Firebase rules added
- Auth system specified
- Execution engine added

## AUTH_SYSTEM
- Expo Router + TypeScript app scaffolded
- Firebase auth (register / login / logout / reset) in services layer
- Firestore `users` document created on registration
- Session persistence + global auth context
- Firestore security rules for `users`

## USER_PROFILE
- View own profile on home (email, role, skills)
- Edit profile screen: name, photo URL, skills
- `updateUserProfile` service + `useProfile` hook + auth-context `refresh()`
- Assumptions (no dedicated phase spec; derived from 03_DATABASE):
  - Editable fields: name, photo, skills. Role and email are immutable after registration.
  - Skills edited as a comma-separated field, stored as string[].
  - Profile reuses the existing `users` collection, so no new Firestore rules.

## MARKETPLACE
- New `services` collection (id, freelanceId, title, price, description).
- Browse marketplace screen (list of all services, newest first).
- Create service screen (freelancers only): title, price, description.
- `service-service.ts` + `use-services.ts` (list) / `use-create-service` hooks.
- Firestore rules for `services`: read by any signed-in user; create/update/delete
  only by the owning freelancer (freelanceId == uid).
- Assumptions (no dedicated phase spec; derived from 03_DATABASE):
  - Added `createdAt` to services for stable ordering (not in the schema field list).
  - Only users with role `freelance` may publish services (enforced in UI;
    ownership enforced in rules).
  - Price stored as a non-negative number (USD).

## MISSIONS
- New `missions` collection (id, clientId, freelanceId, status).
- Hire flow: clients hire from a marketplace service card → mission (`pending`).
- Missions screen: participants track and advance status
  (freelancer accepts/declines/completes; client cancels).
- `mission-service.ts` + `use-missions.ts` (`useMissions`, `useMissionActions`).
- Firestore rules for `missions`: read/update by either participant; create only
  by the client as `pending`; participants immutable; no delete.
- Assumptions (no dedicated phase spec; derived from 03_DATABASE):
  - `status` values: pending → accepted → completed, plus cancelled.
  - Added `createdAt`, `serviceId`, `serviceTitle` (denormalized for display/ordering).
  - Missions are opened by a client hiring a freelancer's service.