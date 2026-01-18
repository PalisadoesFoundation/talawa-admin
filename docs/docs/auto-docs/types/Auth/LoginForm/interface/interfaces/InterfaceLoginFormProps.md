[Admin Docs](/)

***

# Interface: InterfaceLoginFormProps

Defined in: [src/types/Auth/LoginForm/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L35)

Props for the LoginForm component.

## Remarks

LoginForm composes EmailField and PasswordField to create a reusable
login form with callback support for success/error handling.

## Properties

### isAdmin?

> `optional` **isAdmin**: `boolean`

Defined in: [src/types/Auth/LoginForm/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L37)

Whether this is an admin login form (affects heading text)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L41)

Callback fired when login fails with error details

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`signInData`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L39)

Callback fired on successful login with complete user data

#### Parameters

##### signInData

[`InterfaceSignInData`](InterfaceSignInData.md)

#### Returns

`void`

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L43)

Test ID for testing purposes
