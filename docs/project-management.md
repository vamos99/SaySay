# Project Management

This document keeps the product work visible in GitHub Issues and GitHub Projects without replacing the original sprint notes.

## Live Board

- GitHub Project: https://github.com/users/vamos99/projects/4

## Workflow

Use a GitHub Projects board with these fields:

| Field | Values |
| --- | --- |
| Status | Backlog, Ready, In Progress, Review, Done |
| Priority | P0, P1, P2 |
| Area | product, frontend, backend, ai-content, analytics, docs, ci |
| Size | S, M, L |
| Sprint | Sprint 1, Sprint 2, Sprint 3 |

Recommended board columns:

1. Backlog: product ideas, tech debt, and follow-up improvements.
2. Ready: scoped tasks with acceptance criteria.
3. In Progress: one or two active tasks only.
4. Review: PR opened, checks passing or under review.
5. Done: merged or intentionally closed.

## Definition of Ready

- The issue states the user role: parent, child, admin, or developer.
- Expected UI/API behavior is clear.
- Required env variables or mocked service behavior are named.
- Acceptance criteria include browser, typecheck, or backend compile verification.

## Definition of Done

- Code or documentation is committed on a feature branch.
- `npm run typecheck` passes for frontend changes.
- `python -m compileall -q backend/generator` passes for backend changes.
- Env/secrets are not committed; examples are updated when config changes.
- PR summary includes what changed and how it was verified.

## Current Backlog

| Priority | Area | Task | Acceptance Criteria |
| --- | --- | --- | --- |
| P1 | product | Define parent dashboard KPIs | Weekly game activity, completion, and child progress metrics are documented. |
| P2 | ai-content | Add prompt version registry | Prompt name, model, purpose, fallback behavior, and owner are documented. |
| P2 | frontend | Add env-missing empty states | Login and portal flows explain missing config without crashing. |
| P2 | docs | Add product walkthrough screenshots | README shows parent portal, game flow, and reporting views. |

## Recently Done

| Area | Task | Evidence |
| --- | --- | --- |
| analytics | Add game event schema | `docs/analytics-events.md` |
| backend | Add health and readiness checks | `/health`, `/ready` in `backend/generator/api.py` |

## Sprint Plan

### Sprint 1 - Portfolio Baseline

- Env and secret hygiene
- CI checks
- Portfolio setup docs

### Sprint 2 - Product Analytics

- Event schema
- Parent dashboard KPIs
- Report validation notes

### Sprint 3 - AI Content Reliability

- Prompt registry
- Backend readiness checks
- Fallback behavior documentation

## Labels

- `type: task`, `type: bug`, `type: docs`
- `area: product`, `area: frontend`, `area: backend`, `area: ai-content`, `area: analytics`, `area: ci`
- `priority: P0`, `priority: P1`, `priority: P2`

## GitHub Projects Setup

The project board already exists. Keep future issues small and link PRs back to
the board items when implementation starts.
