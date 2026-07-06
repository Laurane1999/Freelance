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

## CHAT
- New `conversations` collection; messages stored as a `messages` subcollection.
- Conversation list (with other participant's name + last message preview).
- Real-time message thread via Firestore `onSnapshot`.
- Start/open a 1:1 conversation from a mission's "Message" button.
- `chat-service.ts` + `use-chat.ts` (`useConversations`, `useConversation`,
  `useOpenConversation`).
- Firestore rules for `conversations` + `conversations/{id}/messages`: access
  limited to participants; message sender must be a participant.
- Assumptions (no dedicated phase spec; derived from 03_DATABASE):
  - Messages are a subcollection of a conversation so message docs keep exactly
    the schema fields (senderId, text, createdAt); the conversation id is the path.
  - Added `lastText`, `createdAt`, `updatedAt` to conversations for list preview/order.
  - Conversations are 1:1 (exactly two participants).

## ROLE_HARDENING (docs/15_USER_ROLES)
- Enforce role-restricted actions at the Firestore rules layer (not just UI):
  - Only freelancers can create services (clients cannot).
  - Only clients can create missions; a client cannot hire themselves
    (clientId != freelanceId).
  - Mission status transitions are role-gated: the freelancer may
    accept/complete/decline; the client may only cancel.
- Adds `userRole`/`isClient`/`isFreelancer` rule helpers (via `get()` on the
  user doc). No data-model or UI changes; UI already gated these features by role.

## NAVIGATION (docs/16_NAVIGATION)
- Replaced the authenticated Stack with a role-aware bottom **tab bar**
  (`@expo/vector-icons` Ionicons, active-tab highlight in brand colors).
  - Shared tabs: Home, Missions, Messages, Profile.
  - Freelancer-only tab: **Services** (marketplace).
  - Client-only tab: **Notifications**.
  - Non-tab routes stay reachable with the tab bar visible: `service-new`
    (hidden), and chat detail via a nested Stack under the Messages tab.
- Assumptions / deviations:
  - **Notifications is a placeholder screen** ("No notifications yet") — the
    NOTIFICATIONS feature and its data model remain out of scope, so there is no
    backend wiring. Kept to match the client tab list in the nav spec.
  - The freelancer "Services" tab points at the existing marketplace screen
    (which already marks "Your listing" and gates "+ New"); no separate
    "my services" screen was added (no model changes).
  - Clients reach the marketplace from the Home screen button (marketplace is
    not a client tab per the spec); no data-model or rules changes.