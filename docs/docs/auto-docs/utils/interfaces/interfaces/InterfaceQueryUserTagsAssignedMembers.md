[Admin Docs](/)

***

# Interface: InterfaceQueryUserTagsAssignedMembers

Defined in: [src/utils/interfaces.ts:1164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1164)

Defines the structure for a query result containing user tags and their assigned members.

## Properties

### ancestorTags

> **ancestorTags**: `object`[]

Defined in: [src/utils/interfaces.ts:1167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1167)

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### folder?

> `optional` **folder**: `object`

Defined in: [src/utils/interfaces.ts:1171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1171)

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

#### parentFolder?

> `optional` **parentFolder**: `object`

##### parentFolder.\_id

> **\_id**: `string`

##### parentFolder.name

> **name**: `string`

##### parentFolder.parentFolder?

> `optional` **parentFolder**: `object`

##### parentFolder.parentFolder.\_id

> **\_id**: `string`

##### parentFolder.parentFolder.name

> **name**: `string`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1165)

***

### usersAssignedTo

> **usersAssignedTo**: `InterfaceTagMembersData`

Defined in: [src/utils/interfaces.ts:1166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1166)
