[Admin Docs](/)

***

# Interface: InterfaceAuthenticationPayload

Defined in: [src/types/Auth/auth.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L21)

Payload returned after successful authentication.

## Properties

### authenticationToken

> **authenticationToken**: `string`

Defined in: [src/types/Auth/auth.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L23)

Token used for authenticating API requests

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [src/types/Auth/auth.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L25)

Optional token for refreshing the authentication token

***

### user

> **user**: `object`

Defined in: [src/types/Auth/auth.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L27)

Authenticated user information

#### emailAddress

> **emailAddress**: `string`

#### id

> **id**: `string`

#### name?

> `optional` **name**: `string`
