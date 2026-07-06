# NAVIGATION

## Navigation System

The application uses Expo Router.

Navigation consists of:

- Stack Navigation
- Bottom Tab Navigation
- Modal Navigation (future)

---

# Bottom Tab Navigation

The bottom navigation bar must always be visible after the user logs in.

It must contain icons and labels.

---

## Client Tabs

🏠 Home
- Browse services
- Search freelancers

📋 Missions
- My missions
- Create mission

💬 Messages
- Conversations

🔔 Notifications
- Updates and alerts

👤 Profile
- My profile
- Settings

---

## Freelancer Tabs

🏠 Home
- Marketplace
- Recommended missions

💼 Services
- My services

📋 Missions
- Applied missions
- Active missions

💬 Messages
- Conversations

👤 Profile
- Professional profile
- Earnings
- Settings

---

# Navigation Rules

- Bottom tabs must remain consistent.
- Every tab must have an icon.
- Icons should come from @expo/vector-icons.
- Navigation should be smooth.
- The active tab must be highlighted.

---

# Screen Navigation

Authentication

Login
↓
Register
↓
Reset Password

After login

Client
↓
Home Dashboard

Freelancer
↓
Freelancer Dashboard

---

# AI Rules

When creating a new screen:

- Add it to the correct navigation flow.
- Update routing.
- Use the appropriate bottom tab.
- Never create isolated screens.