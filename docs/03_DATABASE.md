# DATABASE (FIRESTORE)

users:
- id
- name
- email
- role
- photo
- skills
- createdAt

services:
- id
- freelanceId
- title
- price
- description

missions:
- id
- clientId
- freelanceId
- status

conversations:
- id
- participants[]

messages:
- id
- senderId
- text
- createdAt