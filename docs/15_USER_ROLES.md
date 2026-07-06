# USER ROLES

## Overview

The application has two primary user roles:

- Client
- Freelancer

Each role has different permissions, dashboards and workflows.

---

# CLIENT

A client is a user who hires freelancers.

## Capabilities

Authentication
- Register
- Login
- Reset password
- Logout

Profile
- Create profile
- Edit profile
- Upload profile picture

Marketplace
- Browse freelancer services
- Search services
- Filter services
- View freelancer profile
- Save favorite services

Missions
- Create a mission
- Edit a mission
- Delete a mission
- View own missions
- Close a mission

Hiring
- Invite freelancers
- Accept applications
- Reject applications
- Assign a freelancer

Chat
- Start conversations
- Send text messages
- Send images
- Receive messages
- View conversation history

Notifications
- Receive mission updates
- Receive chat notifications
- Receive hiring notifications

Dashboard
- View active missions
- View completed missions
- View spending
- View hired freelancers

---

# FREELANCER

A freelancer is a user who offers professional services.

## Capabilities

Authentication
- Register
- Login
- Reset password
- Logout

Profile
- Create professional profile
- Edit profile
- Upload profile picture
- Add biography
- Add skills
- Add portfolio

Services
- Create services
- Edit services
- Delete services
- Publish services
- Unpublish services

Marketplace
- View other services
- Search opportunities

Missions
- Browse available missions
- Apply to missions
- Accept invitations
- Decline invitations
- Mark mission completed

Chat
- Start conversations
- Reply to clients
- Send images
- View conversation history

Dashboard
- View earnings
- View active missions
- View completed missions
- View service statistics

Notifications
- Receive new mission alerts
- Receive chat notifications
- Receive payment notifications

---

# Shared Features

Both Client and Freelancer can:

- Authenticate
- Edit profile
- Chat
- Receive notifications
- Manage account settings
- Upload profile image

---

# Access Rules

Clients cannot:

- Create services
- Edit freelancer services
- Apply to missions

Freelancers cannot:

- Hire themselves
- Create missions as clients
- Manage client-only dashboard

---

# AI Rules

The AI must always:

- Check the user's role before generating UI or business logic.
- Display only features available for that role.
- Protect restricted actions.
- Keep client and freelancer experiences separated.