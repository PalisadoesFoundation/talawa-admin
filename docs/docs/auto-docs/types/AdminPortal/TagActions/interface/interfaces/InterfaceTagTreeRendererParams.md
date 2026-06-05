[Admin Docs](/)

***

# Interface: InterfaceTagTreeRendererParams

Defined in: [src/types/AdminPortal/TagActions/interface.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L151)

## Properties

### checkedTags

> **checkedTags**: `Set`\<`string`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L154)

***

### collapseFolderAriaLabel

> **collapseFolderAriaLabel**: `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L164)

***

### expandedFolderIds

> **expandedFolderIds**: `Set`\<`string`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L153)

***

### expandFolderAriaLabel

> **expandFolderAriaLabel**: `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L163)

***

### folderStateMap

> **folderStateMap**: `Map`\<`string`, [`InterfaceTagFolderItem`](InterfaceTagFolderItem.md)\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L152)

***

### noTagsFoundText

> **noTagsFoundText**: `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L162)

***

### onToggleFolderExpansion()

> **onToggleFolderExpansion**: (`folderId`) => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L157)

#### Parameters

##### folderId

`string`

#### Returns

`void`

***

### onToggleTagSelection()

> **onToggleTagSelection**: (`tag`, `isSelected`) => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L158)

#### Parameters

##### tag

[`InterfaceTagSelectionItem`](InterfaceTagSelectionItem.md)

##### isSelected

`boolean`

#### Returns

`void`

***

### searchTerm

> **searchTerm**: `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L155)

***

### styles

> **styles**: `Record`\<`string`, `string`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L156)
