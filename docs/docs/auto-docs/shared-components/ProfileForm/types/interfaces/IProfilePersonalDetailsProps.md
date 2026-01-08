[Admin Docs](/)

***

# Interface: IProfilePersonalDetailsProps

Defined in: [src/shared-components/ProfileForm/types.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L38)

## Properties

### fileInputRef

> **fileInputRef**: `RefObject`\<`HTMLInputElement`\>

Defined in: [src/shared-components/ProfileForm/types.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L46)

***

### formState

> **formState**: [`IProfileFormState`](IProfileFormState.md)

Defined in: [src/shared-components/ProfileForm/types.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L39)

***

### handleFieldChange()

> **handleFieldChange**: (`fieldName`, `value`) => `void`

Defined in: [src/shared-components/ProfileForm/types.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L41)

#### Parameters

##### fieldName

keyof [`IProfileFormState`](IProfileFormState.md)

##### value

`string`

#### Returns

`void`

***

### handleFileUpload()

> **handleFileUpload**: (`e`) => `void`

Defined in: [src/shared-components/ProfileForm/types.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L47)

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

***

### selectedAvatar

> **selectedAvatar**: `File`

Defined in: [src/shared-components/ProfileForm/types.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L45)

***

### setFormState

> **setFormState**: `Dispatch`\<`SetStateAction`\<[`IProfileFormState`](IProfileFormState.md)\>\>

Defined in: [src/shared-components/ProfileForm/types.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L40)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/shared-components/ProfileForm/types.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/types.ts#L48)
