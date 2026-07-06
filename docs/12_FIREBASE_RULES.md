# FIREBASE RULES

- Firebase ONLY in services/
- Never in UI
- Never direct access in hooks

Flow:
UI → hooks → services → Firebase

Rules:
- Firestore = single source of truth
- Validate before writing
- Secure user data