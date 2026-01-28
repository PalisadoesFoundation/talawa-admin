[**talawa-admin**](../../../../../README.md)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx:57](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx#L57)

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
