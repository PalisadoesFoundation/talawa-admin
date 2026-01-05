[Admin Docs](/)

***

# Requests

**`Function`**

## File

Requests.tsx

## Description

This component renders a table displaying volunteer membership requests for a specific event.
It allows administrators to search, sort, and manage these requests by accepting or rejecting them.

## Requires

react

## Requires

react-i18next

## Requires

react-bootstrap

## Requires

react-router-dom

## Requires

@apollo/client

## Requires

@mui/x-data-grid

## Requires

dayjs

## Requires

NotificationToast

## Requires

shared-components/LoadingState/LoadingState

## Requires

components/Avatar/Avatar

## Requires

components/AdminSearchFilterBar/AdminSearchFilterBar

## Requires

GraphQl/Queries/EventVolunteerQueries

## Requires

GraphQl/Mutations/EventVolunteerMutation

## Requires

utils/interfaces

 Requests

## Remarks

- Displays a loader while fetching data and handles errors gracefully.
- Uses Apollo Client's `useQuery` to fetch data and `useMutation` to update membership status.
- Uses AdminSearchFilterBar for unified search and filter interface with debouncing.
- Provides sorting by creation date (latest/earliest) and filtering by request type (all/individuals/groups).
- Displays volunteer details with accessible avatar alt text, request type, request date, and action buttons.
- All UI text is internationalized using i18n translation keys.
- Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.

## Example

```ts
<Requests />
```

## Functions

- [default](functions/default-1.md)
