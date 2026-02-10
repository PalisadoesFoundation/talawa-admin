[Admin Docs](/)

***

# Interface: InterfaceSignInResult

Defined in: [src/types/Auth/LoginForm/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L15)

Shape of the signIn result from SIGNIN_QUERY, passed to onSuccess so the
parent can handle session, redirect, and invitation logic.

## Properties

### authenticationToken

> **authenticationToken**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L25)

***

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L26)

***

### user

> **user**: `object`

Defined in: [src/types/Auth/LoginForm/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L16)

#### avatarURL

> **avatarURL**: `string`

#### countryCode

> **countryCode**: `string`

#### emailAddress

> **emailAddress**: `string`

#### id

> **id**: `string`

#### isEmailAddressVerified

> **isEmailAddressVerified**: `boolean`

#### name

> **name**: `string`

#### role

> **role**: `string`
