[Admin Docs](/)

***

# Interface: InterfaceLoginFormProps

Defined in: [src/types/LoginForm/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L4)

Props for the LoginForm component

## Properties

### initialEmail?

> `optional` **initialEmail**: `string`

Defined in: [src/types/LoginForm/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L12)

***

### isLoading

> **isLoading**: `boolean`

Defined in: [src/types/LoginForm/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L6)

***

### onSubmit()

> **onSubmit**: (`email`, `password`, `recaptchaToken`) => `Promise`\<`void`\>

Defined in: [src/types/LoginForm/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L7)

#### Parameters

##### email

`string`

##### password

`string`

##### recaptchaToken

`string`

#### Returns

`Promise`\<`void`\>

***

### role

> **role**: `"user"` \| `"admin"`

Defined in: [src/types/LoginForm/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L5)

***

### showRegisterLink?

> `optional` **showRegisterLink**: `boolean`

Defined in: [src/types/LoginForm/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/LoginForm/interface.ts#L13)
