# ARCHITECTURE

## Structure

app/ → UI screens
hooks/ → logic layer
services/ → Firebase/API layer
context/ → global state
utils/ → helpers
types/ → TypeScript models

## Data Flow

UI → hooks → services → Firebase

## Rule

UI must NEVER access Firebase directly.