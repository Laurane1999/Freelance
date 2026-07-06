# AUTH SYSTEM

Firebase Authentication system.

## Flow

Register:
- Create Firebase user
- Create Firestore user document

Login:
- Authenticate user
- Load profile

Logout:
- Firebase signOut

Reset:
- Send email reset

## Rules
- Session must persist
- User stored in Firestore