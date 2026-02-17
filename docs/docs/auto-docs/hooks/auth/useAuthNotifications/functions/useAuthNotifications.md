[Admin Docs](/)

***

# Function: useAuthNotifications()

> **useAuthNotifications**(`t`, `config`): `object`

Defined in: [src/hooks/auth/useAuthNotifications.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useAuthNotifications.ts#L18)

Hook providing standardized toast notifications for auth flows with i18n support.

## Parameters

### t

`TFunction`

Translation function from useTranslation

### config

[`InterfaceToastConfig`](../interfaces/InterfaceToastConfig.md) = `{}`

Optional toast display configuration

## Returns

`object`

### showAuthError()

> **showAuthError**: (`error`) => `Id`

#### Parameters

##### error

`Error`

#### Returns

`Id`

### showLoginSuccess()

> **showLoginSuccess**: (`name?`) => `Id`

#### Parameters

##### name?

`string`

#### Returns

`Id`

### showNetworkError()

> **showNetworkError**: () => `Id`

#### Returns

`Id`

### showSignupSuccess()

> **showSignupSuccess**: () => `Id`

#### Returns

`Id`

### showValidationError()

> **showValidationError**: (`field`, `message`) => `Id`

#### Parameters

##### field

`string`

##### message

`string`

#### Returns

`Id`
