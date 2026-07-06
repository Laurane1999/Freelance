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