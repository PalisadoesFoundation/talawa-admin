[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceAuthenticationPayload

Defined in: [src/types/Auth/auth.ts:36](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Auth/auth.ts#L36)

Payload returned after successful authentication.

## Properties

### authenticationToken

> **authenticationToken**: `string`

Defined in: [src/types/Auth/auth.ts:38](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Auth/auth.ts#L38)

Token used for authenticating API requests

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [src/types/Auth/auth.ts:40](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Auth/auth.ts#L40)

Optional token for refreshing the authentication token

***

### user

> **user**: `InterfaceAuthUser`

Defined in: [src/types/Auth/auth.ts:42](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/Auth/auth.ts#L42)

Authenticated user information
