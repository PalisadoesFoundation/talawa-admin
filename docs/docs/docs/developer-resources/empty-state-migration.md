---
id: empty-state-migration
title: EmptyState Migration Tracking
slug: /developer-resources/empty-state-migration
sidebar_position: 37
---

This document tracks the migration of legacy empty-state implementations
(e.g. `.notFound` CSS-based patterns) to the shared `EmptyState` component.

It serves as a reference for:

- Completed migrations
- Known exceptions
- Discovered edge cases
- Guidance for future extensions

---

## Screens Migrated to `EmptyState`

The following screens have been successfully migrated to use the shared
`EmptyState` component:

### Admin Screens

- **Requests**
  - No organizations
  - No membership requests
  - No search results

- **OrgList**
  - No organizations available
  - No search results (admin / non-admin aware)

- **Users**
  - Empty user list
  - Empty search results

---

## Screens Not Migrated (With Reasons)

The following screens still use legacy patterns and were intentionally
left unchanged:

| Screen                           | Reason                                  |
| -------------------------------- | --------------------------------------- |
| src/screens/UserPortal/Campaigns | Will be implemented through Issue #5126 |
| src/screens/BlockUser            | Will be implemented through Issue #5126 |

> Note: Any future exclusions should be documented here with rationale.

---

## Edge Cases Discovered

During migration, the following edge cases were identified:

- **Search vs empty data distinction**
  - Search-based empty states require dynamic descriptions
  - Handled via `description` prop with interpolated i18n values

- **Admin vs non-admin messaging**
  - Certain screens (e.g. OrgList) require role-aware messaging
  - Implemented without branching EmptyState logic

- **Grid / table overlays**
  - DataGrid empty overlays must use `EmptyState` via `noRowsOverlay`
  - Avoid duplicating empty UI outside grid context

---

## Guidance for Future EmptyState Extensions

When extending or introducing new EmptyState usage:

- Always prefer the shared `EmptyState` component over custom markup
- Do not reintroduce `.notFound` CSS patterns
- Extend `EmptyState` via props, not forks or variants
- Keep icons semantic and consistent with context
- Ensure i18n keys exist for all user-visible text
- Add tests for:
  - Base empty state
  - Search empty state (if applicable)

For new empty state patterns, update:

- `reusable-components.md`
- This migration tracking document (if relevant)

---

## Related References

- **Parent Issue:** Phase 1: Create EmptyState Migration (#5087)
- **Component Docs:** Reusable Components → EmptyState
