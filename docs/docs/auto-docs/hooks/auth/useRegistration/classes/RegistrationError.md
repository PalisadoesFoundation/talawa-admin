[Admin Docs](/)

***

# Class: RegistrationError

Defined in: [src/hooks/auth/useRegistration.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useRegistration.ts#L19)

Error thrown when registration validation fails. Callers can use error.code
with t(error.code) for translated messages.

## Extends

- `Error`

## Constructors

### Constructor

> **new RegistrationError**(`code`, `message?`): `RegistrationError`

Defined in: [src/hooks/auth/useRegistration.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useRegistration.ts#L20)

#### Parameters

##### code

[`RegistrationErrorCodeType`](../type-aliases/RegistrationErrorCodeType.md)

##### message?

`string`

#### Returns

`RegistrationError`

#### Overrides

`Error.constructor`

## Properties

### code

> `readonly` **code**: [`RegistrationErrorCodeType`](../type-aliases/RegistrationErrorCodeType.md)

Defined in: [src/hooks/auth/useRegistration.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/hooks/auth/useRegistration.ts#L21)
