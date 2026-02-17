[Admin Docs](/)

***

# Function: useLogin()

> **useLogin**(`opts?`): `object`

Defined in: [src/hooks/auth/useLogin.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useLogin.ts#L17)

Custom hook for user login.
Encapsulates login GraphQL logic with consistent error/success handling.

## Parameters

### opts?

[`IUseLoginOptions`](../../../../types/Auth/useLogin/interface/interfaces/IUseLoginOptions.md)

Optional callbacks for success and error handling

## Returns

`object`

Object containing login function, loading state, and error state

### error

> **error**: `Error`

### loading

> **loading**: `boolean`

### login()

> **login**: (`credentials`) => `Promise`\<[`InterfaceSignInResult`](../../../../types/Auth/LoginForm/interface/interfaces/InterfaceSignInResult.md)\>

#### Parameters

##### credentials

[`ILoginCredentials`](../../../../types/Auth/useLogin/interface/interfaces/ILoginCredentials.md)

#### Returns

`Promise`\<[`InterfaceSignInResult`](../../../../types/Auth/LoginForm/interface/interfaces/InterfaceSignInResult.md)\>
