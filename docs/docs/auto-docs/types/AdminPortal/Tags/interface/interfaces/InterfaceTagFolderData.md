[Admin Docs](/)

***

# Interface: InterfaceTagFolderData

Defined in: [src/types/AdminPortal/Tags/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L55)

## Properties

### childFolders

> **childFolders**: `object`

Defined in: [src/types/AdminPortal/Tags/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L63)

#### edges

> **edges**: `object`[]

#### pageInfo

> **pageInfo**: `object`

##### pageInfo.endCursor

> **endCursor**: `string`

##### pageInfo.hasNextPage

> **hasNextPage**: `boolean`

***

### id

> **id**: `string`

Defined in: [src/types/AdminPortal/Tags/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L56)

***

### name

> **name**: `string`

Defined in: [src/types/AdminPortal/Tags/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L57)

***

### parentFolder?

> `optional` **parentFolder**: `object`

Defined in: [src/types/AdminPortal/Tags/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L72)

#### id

> **id**: `string`

#### name

> **name**: `string`

#### parentFolder?

> `optional` **parentFolder**: `object`

##### parentFolder.id

> **id**: `string`

##### parentFolder.name

> **name**: `string`

##### parentFolder.parentFolder?

> `optional` **parentFolder**: `object`

##### parentFolder.parentFolder.id

> **id**: `string`

##### parentFolder.parentFolder.name

> **name**: `string`

***

### tags?

> `optional` **tags**: `object`

Defined in: [src/types/AdminPortal/Tags/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tags/interface.ts#L58)

#### edges?

> `optional` **edges**: `object`[]
