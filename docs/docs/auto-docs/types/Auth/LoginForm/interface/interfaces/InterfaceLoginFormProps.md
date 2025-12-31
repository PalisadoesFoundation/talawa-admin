[Admin Docs](/)

***

# Interface: InterfaceLoginFormProps

Defined in: src/types/Auth/LoginForm/interface.ts:18

Props for the LoginForm component.

## Remarks

LoginForm composes EmailField and PasswordField to create a reusable
login form with callback support for success/error handling.

## Properties

### isAdmin?

> `optional` **isAdmin**: `boolean`

Defined in: src/types/Auth/LoginForm/interface.ts:20

Whether this is an admin login form (affects heading text)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: src/types/Auth/LoginForm/interface.ts:24

Callback fired when login fails with error details

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`token`) => `void`

Defined in: src/types/Auth/LoginForm/interface.ts:22

Callback fired on successful login with authentication token

#### Parameters

##### token

`string`

#### Returns

`void`

***

### testId?

> `optional` **testId**: `string`

Defined in: src/types/Auth/LoginForm/interface.ts:26

Test ID for testing purposes
