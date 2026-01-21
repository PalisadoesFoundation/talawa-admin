[Admin Docs](/)

***

# Function: useProfileLogic()

> **useProfileLogic**(): `object`

Defined in: [src/shared-components/ProfileForm/hooks/useProfileLogic.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileForm/hooks/useProfileLogic.ts#L19)

## Returns

`object`

### fileInputRef

> **fileInputRef**: `RefObject`\<`HTMLInputElement`\>

### formState

> **formState**: `IProfileFormState`

### handlers

> **handlers**: `object`

#### handlers.handleEventsAttendedModal()

> **handleEventsAttendedModal**: () => `void`

##### Returns

`void`

#### handlers.handleFieldChange()

> **handleFieldChange**: (`fieldName`, `value`) => `void`

##### Parameters

###### fieldName

`string`

###### value

`string`

##### Returns

`void`

#### handlers.handleFileUpload()

> **handleFileUpload**: (`e`) => `void`

##### Parameters

###### e

`ChangeEvent`\<`HTMLInputElement`\>

##### Returns

`void`

#### handlers.handleUserUpdate()

> **handleUserUpdate**: () => `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### handlers.resetChanges()

> **resetChanges**: () => `void`

##### Returns

`void`

### hideDrawer

> **hideDrawer**: `boolean`

### isAdmin

> **isAdmin**: `boolean`

### isUpdated

> **isUpdated**: `boolean`

### isUser

> **isUser**: `boolean`

### loading

> **loading**: `boolean`

### selectedAvatar

> **selectedAvatar**: `File`

### setHideDrawer

> **setHideDrawer**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

### setShow

> **setShow**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

### show

> **show**: `boolean`

### t

> **t**: `TFunction`\<`"translation"`, `"memberDetail"`\>

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

### userData

> **userData**: `any`
