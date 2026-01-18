[Admin Docs](/)

***

# Interface: IRegistrationFormProps

Defined in: [src/types/Auth/RegistrationForm/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L29)

Props for the RegistrationForm component

## Properties

### enableRecaptcha?

> `optional` **enableRecaptcha**: `boolean`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L33)

***

### onError()?

> `optional` **onError**: (`e`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L32)

#### Parameters

##### e

`Error`

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: (`signUpData`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L31)

#### Parameters

##### signUpData

[`InterfaceSignUpData`](InterfaceSignUpData.md)

#### Returns

`void`

***

### organizations

> **organizations**: [`InterfaceOrgOption`](../../../OrgSelector/interface/interfaces/InterfaceOrgOption.md)[]

Defined in: [src/types/Auth/RegistrationForm/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L30)
