[Admin Docs](/)

***

# Interface: InterfaceLoginFormProps

Defined in: [src/types/Auth/LoginForm/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L36)

Props for the LoginForm component.

## Remarks

LoginForm composes EmailField and PasswordField to create a reusable
login form with callback support for success/error handling.

## Properties

### enableRecaptcha?

> `optional` **enableRecaptcha**: `boolean`

Defined in: [src/types/Auth/LoginForm/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L46)

When true, render ReCAPTCHA and send token with sign-in request

***

### isAdmin?

> `optional` **isAdmin**: `boolean`

Defined in: [src/types/Auth/LoginForm/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L38)

Whether this is an admin login form (affects heading text)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L42)

Callback fired when login fails with error details

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`signInResult`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L40)

Callback fired on successful login with full signIn result (user + tokens)

#### Parameters

##### signInResult

[`InterfaceSignInResult`](InterfaceSignInResult.md)

#### Returns

`void`

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/LoginForm/interface.ts#L44)

Test ID for testing purposes
