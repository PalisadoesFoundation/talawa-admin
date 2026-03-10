[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/screens/AdminPortal/MemberDetail/Security.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/MemberDetail/Security.tsx#L29)

Security component.

## Returns

`Element`

A card containing password management controls.

## Remarks

Displays security settings for a user, allowing them to update their password.
Administrators can also reset passwords for other users without requiring the
current password. The component opens a [PasswordUpdateModal](../../../../../shared-components/Auth/PasswordUpdate/PasswordUpdateModal/variables/PasswordUpdateModal.md) for handling
password updates and performs validation before executing the appropriate
GraphQL mutation.
