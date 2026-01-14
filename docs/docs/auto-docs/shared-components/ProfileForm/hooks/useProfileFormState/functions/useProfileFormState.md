[Admin Docs](/)

***

# Function: useProfileFormState()

> **useProfileFormState**(`tCommon`): `object`

Defined in: [src/shared-components/ProfileForm/hooks/useProfileFormState.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/hooks/useProfileFormState.ts#L12)

## Parameters

### tCommon

`any`

## Returns

`object`

### fileInputRef

> **fileInputRef**: `RefObject`\<`HTMLInputElement`\>

### formState

> **formState**: [`FormStateType`](../../../../../types/ProfileForm/type/interfaces/FormStateType.md)

### handleFieldChange()

> **handleFieldChange**: (`fieldName`, `value`) => `void`

#### Parameters

##### fieldName

`string`

##### value

`string`

#### Returns

`void`

### handleFileUpload()

> **handleFileUpload**: (`e`) => `void`

#### Parameters

##### e

`ChangeEvent`\<`HTMLInputElement`\>

#### Returns

`void`

### initializeFormState()

> **initializeFormState**: (`userData`) => `void`

#### Parameters

##### userData

`any`

#### Returns

`void`

### isUpdated

> **isUpdated**: `boolean`

### originalImageState

> **originalImageState**: `RefObject`\<`string`\>

### resetChanges()

> **resetChanges**: (`userData`) => `void`

#### Parameters

##### userData

`any`

#### Returns

`void`

### selectedAvatar

> **selectedAvatar**: `File`

### setFormState

> **setFormState**: `Dispatch`\<`SetStateAction`\<[`FormStateType`](../../../../../types/ProfileForm/type/interfaces/FormStateType.md)\>\>

### setIsUpdated

> **setIsUpdated**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

### setSelectedAvatar

> **setSelectedAvatar**: `Dispatch`\<`SetStateAction`\<`File`\>\>
