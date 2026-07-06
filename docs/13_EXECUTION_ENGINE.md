# EXECUTION ENGINE

## Core Principle
The system is executed step-by-step using strict phases.

## Rules

- Only one active phase
- No skipping phases
- No feature outside current phase

## Execution Flow

1. Read PROJECT_STATE
2. Identify ACTIVE_PHASE
3. Load required docs
4. Implement only that phase
5. Stop

## Stop Conditions

- Missing info
- Dependency not ready
- Architecture violation