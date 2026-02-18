[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx#L58)

LeaveOrganization Component

This component allows a user to leave an organization they are a member of.
It includes email verification for confirmation and handles the removal process via GraphQL mutations.

Features:
- Uses Apollo Client's `useQuery` to fetch organization details.
- Uses Apollo Client's `useMutation` to remove the user from the organization.
- Displays a modal for user confirmation and email verification.
- Handles errors and loading states gracefully.

## Returns

`Element`

The rendered LeaveOrganization component.

## Example

```tsx
<LeaveOrganization />
```
