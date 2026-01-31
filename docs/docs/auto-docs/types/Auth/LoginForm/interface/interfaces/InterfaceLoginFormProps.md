[Admin Docs](/)

***

# Interface: InterfaceLoginFormProps

Defined in: [src/types/Auth/LoginForm/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L25)

Props for the LoginForm component

## Properties

### isAdmin

> **isAdmin**: `boolean`

Defined in: [src/types/Auth/LoginForm/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L29)

Whether this is an admin login form

***

### onError()

> **onError**: (`error`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L39)

Callback fired on login error

#### Parameters

##### error

`string`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`userData`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L34)

Callback fired on successful login with complete user data

#### Parameters

##### userData

[`InterfaceUserData`](InterfaceUserData.md)

#### Returns

`void`

***

### recaptchaSiteKey?

> `optional` **recaptchaSiteKey**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L44)

reCAPTCHA site key for bot protection

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L49)

Test ID for testing purposes
