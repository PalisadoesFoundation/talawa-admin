[Admin Docs](/)

***

# Interface: InterfaceAuthenticationPayload

Defined in: [src/types/Auth/auth.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L36)

Payload returned after successful authentication.

## Properties

### authenticationToken

> **authenticationToken**: `string`

Defined in: [src/types/Auth/auth.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L38)

Token used for authenticating API requests

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [src/types/Auth/auth.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L40)

Optional token for refreshing the authentication token

***

### user

> **user**: `InterfaceAuthUser`

Defined in: [src/types/Auth/auth.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L42)

Authenticated user information
