[**talawa-admin**](../../../../../README.md)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx:56](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/screens/UserPortal/LeaveOrganization/LeaveOrganization.tsx#L56)

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
