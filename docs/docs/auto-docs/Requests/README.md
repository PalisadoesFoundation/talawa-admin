[**talawa-admin**](README.md)

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

react-toastify

## Requires

components/Loader/Loader

## Requires

components/Avatar/Avatar

## Requires

subComponents/SortingButton

## Requires

shared-components/SearchBar/SearchBar

## Requires

GraphQl/Queries/EventVolunteerQueries

## Requires

GraphQl/Mutations/EventVolunteerMutation

## Requires

utils/interfaces

 requests

## Remarks

- Displays a loader while fetching data and handles errors gracefully.
- Uses Apollo Client's `useQuery` to fetch data and `useMutation` to update membership status.
- Provides search functionality with debouncing and sorting options.
- Displays volunteer details, request date, and action buttons for accepting or rejecting requests.
- Redirects to the home page if `orgId` or `eventId` is missing in the URL parameters.

## Example

```ts
<Requests />
```

## Functions

- [default](Requests\README\functions\default.md)
