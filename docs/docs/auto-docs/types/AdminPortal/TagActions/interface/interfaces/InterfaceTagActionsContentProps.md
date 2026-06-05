[Admin Docs](/)

***

# Interface: InterfaceTagActionsContentProps

Defined in: [src/types/AdminPortal/TagActions/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L130)

Props for rendering the folder/tag content area of the TagActions modal.

## Properties

### breadcrumbFolderIds

> **breadcrumbFolderIds**: `string`[]

Defined in: [src/types/AdminPortal/TagActions/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L133)

***

### checkedTags

> **checkedTags**: `Set`\<`string`\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L145)

***

### currentFolder

> **currentFolder**: [`InterfaceTagFolderItem`](InterfaceTagFolderItem.md)

Defined in: [src/types/AdminPortal/TagActions/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L143)

***

### currentFolderId

> **currentFolderId**: `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L132)

***

### folderStateMap

> **folderStateMap**: `Map`\<`string`, [`InterfaceTagFolderItem`](InterfaceTagFolderItem.md)\>

Defined in: [src/types/AdminPortal/TagActions/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L134)

***

### hasAssignees

> **hasAssignees**: `boolean`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L131)

***

### manageTagTranslator()

> **manageTagTranslator**: (`key`) => `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L137)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### onGoToRoot()

> **onGoToRoot**: () => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L136)

#### Returns

`void`

***

### onOpenFolder()

> **onOpenFolder**: (`folderId`) => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L135)

#### Parameters

##### folderId

`string`

#### Returns

`void`

***

### onToggleTagSelection()

> **onToggleTagSelection**: (`tag`, `isSelected`) => `void`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L146)

#### Parameters

##### tag

[`InterfaceTagSelectionItem`](InterfaceTagSelectionItem.md)

##### isSelected

`boolean`

#### Returns

`void`

***

### organizationTagsTranslator()

> **organizationTagsTranslator**: (`key`) => `string`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L138)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### rootFolderIds

> **rootFolderIds**: `string`[]

Defined in: [src/types/AdminPortal/TagActions/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L140)

***

### rootFoldersError?

> `optional` **rootFoldersError**: `Error`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L141)

***

### rootFoldersLoading

> **rootFoldersLoading**: `boolean`

Defined in: [src/types/AdminPortal/TagActions/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L139)

***

### visibleFolderIds

> **visibleFolderIds**: `string`[]

Defined in: [src/types/AdminPortal/TagActions/interface.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L142)

***

### visibleTags

> **visibleTags**: [`InterfaceTagSelectionItem`](InterfaceTagSelectionItem.md)[]

Defined in: [src/types/AdminPortal/TagActions/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/TagActions/interface.ts#L144)
