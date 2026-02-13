[Admin Docs](/)

***

# Interface: IRegistrationFormProps

Defined in: [src/types/Auth/RegistrationForm/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L18)

Props for the RegistrationForm component

## Properties

### enableRecaptcha?

> `optional` **enableRecaptcha**: `boolean`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L23)

***

### onError()?

> `optional` **onError**: (`e`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L22)

#### Parameters

##### e

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`result`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L21)

Called on successful signup with result so parent can handle session/redirect

#### Parameters

##### result

[`IRegistrationSuccessResult`](../../../../../hooks/auth/useRegistration/interfaces/IRegistrationSuccessResult.md)

#### Returns

`void`

***

### organizations

> **organizations**: [`InterfaceOrgOption`](../../../OrgSelector/interface/interfaces/InterfaceOrgOption.md)[]

Defined in: [src/types/Auth/RegistrationForm/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L19)
