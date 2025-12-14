[Admin Docs](/)

***

# Interface: InterfaceRegistrationFormProps

Defined in: [src/types/RegistrationForm/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L4)

Props for the RegistrationForm component

## Properties

### isLoading

> **isLoading**: `boolean`

Defined in: [src/types/RegistrationForm/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L6)

***

### onSubmit()

> **onSubmit**: (`userData`, `recaptchaToken`) => `Promise`\<`boolean`\>

Defined in: [src/types/RegistrationForm/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L7)

#### Parameters

##### userData

[`IRegistrationData`](IRegistrationData.md)

##### recaptchaToken

`string`

#### Returns

`Promise`\<`boolean`\>

***

### organizations

> **organizations**: `object`[]

Defined in: [src/types/RegistrationForm/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L12)

#### id

> **id**: `string`

#### label

> **label**: `string`

***

### showLoginLink?

> `optional` **showLoginLink**: `boolean`

Defined in: [src/types/RegistrationForm/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L11)

***

### userType

> **userType**: `"user"` \| `"admin"`

Defined in: [src/types/RegistrationForm/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/RegistrationForm/interface.ts#L5)
