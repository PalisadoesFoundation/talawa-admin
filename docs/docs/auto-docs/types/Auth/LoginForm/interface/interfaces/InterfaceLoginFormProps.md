[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceLoginFormProps

Defined in: [src/types/Auth/LoginForm/interface.ts:18](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/Auth/LoginForm/interface.ts#L18)

Props for the LoginForm component.

## Remarks

LoginForm composes EmailField and PasswordField to create a reusable
login form with callback support for success/error handling.

## Properties

### isAdmin?

> `optional` **isAdmin**: `boolean`

Defined in: [src/types/Auth/LoginForm/interface.ts:20](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/Auth/LoginForm/interface.ts#L20)

Whether this is an admin login form (affects heading text)

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:24](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/Auth/LoginForm/interface.ts#L24)

Callback fired when login fails with error details

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`token`) => `void`

Defined in: [src/types/Auth/LoginForm/interface.ts:22](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/Auth/LoginForm/interface.ts#L22)

Callback fired on successful login with authentication token

#### Parameters

##### token

`string`

#### Returns

`void`

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/LoginForm/interface.ts:26](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/Auth/LoginForm/interface.ts#L26)

Test ID for testing purposes
