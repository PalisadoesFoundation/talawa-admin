[Admin Docs](/)

***

# Interface: InterfaceOAuthLinkResponse

Defined in: [src/types/Auth/auth.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L62)

Response data returned from linking an OAuth account.

## Properties

### emailAddress

> **emailAddress**: `string`

Defined in: [src/types/Auth/auth.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L68)

User's email address

***

### id

> **id**: `string`

Defined in: [src/types/Auth/auth.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L64)

User's unique identifier

***

### isEmailAddressVerified

> **isEmailAddressVerified**: `boolean`

Defined in: [src/types/Auth/auth.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L70)

Whether the user's email address has been verified

***

### name

> **name**: `string`

Defined in: [src/types/Auth/auth.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L66)

User's full name

***

### oauthAccounts

> **oauthAccounts**: [`InterfaceOAuthAccount`](InterfaceOAuthAccount.md)[]

Defined in: [src/types/Auth/auth.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L74)

List of linked OAuth accounts

***

### role

> **role**: [`UserRole`](../../../../utils/interfaces/enumerations/UserRole.md)

Defined in: [src/types/Auth/auth.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L72)

User's role in the system
