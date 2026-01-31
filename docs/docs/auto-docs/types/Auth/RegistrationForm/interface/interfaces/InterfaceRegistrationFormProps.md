[Admin Docs](/)

***

# Interface: InterfaceRegistrationFormProps

Defined in: [src/types/Auth/RegistrationForm/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L22)

Props for the RegistrationForm component

## Properties

### onError()

> **onError**: (`error`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L36)

Callback fired on registration error

#### Parameters

##### error

`string`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`userData`) => `void`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L31)

Callback fired on successful registration with complete user data

#### Parameters

##### userData

[`InterfaceUserData`](../../../LoginForm/interface/interfaces/InterfaceUserData.md)

#### Returns

`void`

***

### organizations

> **organizations**: [`InterfaceOrganizationOption`](InterfaceOrganizationOption.md)[]

Defined in: [src/types/Auth/RegistrationForm/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L26)

List of organizations for selection

***

### pendingInvitationToken?

> `optional` **pendingInvitationToken**: `string`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L46)

Pending invitation token from URL

***

### recaptchaSiteKey?

> `optional` **recaptchaSiteKey**: `string`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L41)

reCAPTCHA site key for bot protection

***

### testId?

> `optional` **testId**: `string`

Defined in: [src/types/Auth/RegistrationForm/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/RegistrationForm/interface.ts#L51)

Test ID for testing purposes
