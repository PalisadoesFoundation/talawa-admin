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

### Admin Portal Screens (8 screens)

#### Core Management Screens

- **Users** (`src/screens/AdminPortal/Users/Users.tsx`)
  - Empty user list
  - Icon: Material-UI component (dynamic)
  - Translations: Uses `common` namespace
  - Status: Implemented & Verified

- **Requests** (`src/screens/AdminPortal/Requests/Requests.tsx`)
  - No membership requests
  - Icon: Material-UI component (dynamic)
  - Translations: Uses `common` namespace
  - Status: Implemented & Verified

- **OrgList** (`src/screens/AdminPortal/OrgList/OrgList.tsx`)
  - No organizations available
  - Icon: Material-UI component (dynamic)
  - Translations: Uses `common` namespace
  - Notes: Admin / non-admin aware messaging
  - Status: Implemented & Verified

#### Fund & Campaign Management

- **Organization Fund Campaigns** (`src/screens/AdminPortal/OrganizationFundCampaign/OrganizationFundCampaigns.tsx`)
  - **Multiple EmptyStates (2):**
    - No campaigns found
      - Icon: `Campaign` (Material-UI)
      - Translation: `orgFundCampaign.noCampaignsFound`
      - Test ID: `campaigns-empty`
    - No search results
      - Icon: `Search` (Material-UI)
      - Translation: `noResultsFound` + dynamic query
      - Test ID: `campaigns-search-empty`
  - Status: Implemented & Verified

- **Organization Funds** (`src/screens/AdminPortal/OrganizationFunds/OrganizationFunds.tsx`)
  - **Multiple EmptyStates (2):**
    - No funds found
      - Icon: `AccountBalanceWallet` (Material-UI)
      - Translation: `funds.noFundsFound`
      - Test ID: `funds-empty`
    - No search results
      - Icon: `Search` (Material-UI)
      - Translation: `noResultsFound` + dynamic query
      - Test ID: `funds-search-empty`
  - Status: Implemented & Verified

#### People & Organization Management

- **Organization People** (`src/screens/AdminPortal/OrganizationPeople/OrganizationPeople.tsx`)
  - Organization members list
  - Icon: Material-UI component (dynamic)
  - Status: Implemented & Verified

#### Plugin & Notification Management

- **Plugin Store** (`src/screens/AdminPortal/PluginStore/components/PluginList.tsx`)
  - No plugins available/installed
  - Icon: `ExtensionOutlined` (Material-UI)
  - Translations: `pluginStore` namespace
  - Test ID: `plugins-empty-state`
  - Notes: Dynamic message based on filter (all/installed/not-installed)
  - Status: Implemented & Verified

- **Notifications** (`src/screens/AdminPortal/Notification/Notification.tsx`)
  - All notifications read/caught up
  - Icon: `NotificationsNone` (Material-UI)
  - Translation: `notifications.allCaughtUp`
  - Test ID: `notifications-empty-state`
  - Status: Implemented & Verified

### User Portal Screens

- **Campaigns** (`src/screens/UserPortal/Campaigns/Campaigns.tsx`)
  - No campaigns found
  - Icon: `Campaign`
  - EmptyState provides view-only state (no create action - campaigns are admin-only)
  - Translations: `userCampaigns.noCampaigns`, `userCampaigns.createFirstCampaign`
  - Test ID: `campaigns-empty-state`

- **Upcoming Events** (`src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.tsx`)
  - No upcoming events
  - Icon: `Event`
  - Translations: `userVolunteer.noEvents`
  - Test ID: `events-empty-state`
  - All hardcoded text replaced with translations

### Event Volunteer Screens

- **Volunteers** (`src/screens/EventVolunteers/Volunteers/Volunteers.tsx`)
  - No volunteers for event
  - Icon: `VolunteerActivism`
  - Translations: `eventVolunteers.noVolunteers`
  - Test ID: `volunteers-empty-state`

- **Volunteer Groups** (`src/screens/EventVolunteers/VolunteerGroups/VolunteerGroups.tsx`)
  - No volunteer groups for event
  - Icon: `Groups`
  - Translations: `eventVolunteers.noVolunteerGroups`
  - Test ID: `volunteerGroups-empty-state`

---

## Screens Not Migrated (With Reasons)

The following screens still use legacy patterns and were intentionally
left unchanged:

| Screen                           | Reason                                  |
| -------------------------------- | --------------------------------------- |
|                                  |                                         |
|                                  |                                         |

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
