[Admin Docs](/)

***

# Interface: InterfaceUserData

Defined in: [src/types/Auth/LoginForm/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L9)

Essential user data returned on successful authentication

## Properties

### refreshToken?

> `optional` **refreshToken**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L11)

***

### token

> **token**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L10)

***

### user

> **user**: `object`

Defined in: [src/types/Auth/LoginForm/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L12)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### countryCode?

> `optional` **countryCode**: `string`

#### emailAddress

> **emailAddress**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### role

> **role**: `"administrator"` \| `"user"`
