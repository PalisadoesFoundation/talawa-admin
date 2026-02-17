[Admin Docs](/)

***

# Function: useLogin()

> **useLogin**(`opts?`): `object`

Defined in: [src/hooks/auth/useLogin.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useLogin.ts#L21)

Custom hook for user login.
Encapsulates login GraphQL logic with consistent error/success handling.

## Parameters

### opts?

[`IUseLoginOptions`](../interfaces/IUseLoginOptions.md)

## Returns

`object`

### error

> **error**: `Error`

### loading

> **loading**: `boolean`

### login()

> **login**: (`credentials`) => `Promise`\<[`InterfaceSignInResult`](../../../../types/Auth/LoginForm/interface/interfaces/InterfaceSignInResult.md)\>

#### Parameters

##### credentials

[`ILoginCredentials`](../interfaces/ILoginCredentials.md)

#### Returns

`Promise`\<[`InterfaceSignInResult`](../../../../types/Auth/LoginForm/interface/interfaces/InterfaceSignInResult.md)\>
