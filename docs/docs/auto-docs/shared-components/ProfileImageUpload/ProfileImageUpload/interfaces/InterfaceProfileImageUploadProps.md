[Admin Docs](/)

***

# Interface: InterfaceProfileImageUploadProps

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L31)

Props for the ProfileImageUpload component.

## Properties

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L35)

Current avatar URL (optional)

***

### dataTestId?

> `optional` **dataTestId**: `string`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L43)

Test ID prefix for testing

***

### name

> **name**: `string`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L33)

User's name for fallback avatar generation

***

### onFileSelect()

> **onFileSelect**: (`file`) => `void`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L39)

Callback when a valid file is selected

#### Parameters

##### file

`File`

#### Returns

`void`

***

### selectedFile?

> `optional` **selectedFile**: `File`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L37)

Newly selected file for preview (optional)

***

### size?

> `optional` **size**: `"small"` \| `"medium"` \| `"large"`

Defined in: [src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ProfileImageUpload/ProfileImageUpload.tsx#L41)

Avatar size preset (default: 'large')
