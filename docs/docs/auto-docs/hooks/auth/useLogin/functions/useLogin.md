[Admin Docs](/)

***

# Function: useLogin()

> **useLogin**(`opts?`): `object`

Defined in: [src/hooks/auth/useLogin.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useLogin.ts#L28)

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

## Throws

Error - Always rethrows errors after setting error state and calling onError callback.
                Callers should either wrap login() in try/catch or rely on error state + onError.

## Example

```tsx
const { login, loading, error } = useLogin({
  onSuccess: (result) => console.log('Logged in:', result.user.name),
  onError: (err) => console.error('Login failed:', err)
});
await login({ email: 'user@example.com', password: 'password123' });
```
