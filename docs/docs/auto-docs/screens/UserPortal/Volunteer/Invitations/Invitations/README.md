[**talawa-admin**](README.md)

***

# screens/UserPortal/Volunteer/Invitations/Invitations

**`Function`**

## File

Invitations.tsx

## Description

This component renders the Invitations screen for the user portal,
allowing users to view, search, sort, and manage their volunteer invitations.
It integrates with GraphQL queries and mutations to fetch and update invitation data.

## Description

Enum for filtering invitations by type.

## Description

Renders the Invitations screen, displaying a list of volunteer invitations
with options to search, sort, filter, and accept/reject invitations.

## Remarks

- Redirects to the homepage if `orgId` or `userId` is missing.
- Displays a loader while fetching data and handles errors gracefully.
- Uses `useQuery` to fetch invitations and `useMutation` to update invitation status.
- Provides search and sorting functionality using `SearchBar` and `SortingButton` components.

## Dependencies

- `react`, `react-router-dom`, `react-bootstrap`, `react-toastify`
- `@apollo/client` for GraphQL queries and mutations
- `@mui/icons-material`, `react-icons` for icons
- Custom hooks: `useLocalStorage`
- Custom components: `Loader`, `SearchBar`, `SortingButton`

## Example

```tsx
<Invitations />
```

## Functions

- [default](screens\UserPortal\Volunteer\Invitations\Invitations\README\functions\default.md)
