[Admin Docs](/)

***

# Interface: InterfaceTagData

Defined in: [src/utils/interfaces.ts:1480](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1480)

InterfaceTagData

## Description

Defines the structure for tag data.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:1481](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1481)

The unique identifier of the tag.

***

### ancestorTags

> **ancestorTags**: `object`[]

Defined in: [src/utils/interfaces.ts:1490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1490)

An array of ancestor tags.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### childTags

> **childTags**: `object`

Defined in: [src/utils/interfaces.ts:1487](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1487)

Information about child tags.

#### totalCount

> **totalCount**: `number`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1482](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1482)

The name of the tag.

***

### parentTag

> **parentTag**: `object`

Defined in: [src/utils/interfaces.ts:1483](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1483)

The parent tag object.

#### \_id

> **\_id**: `string`

***

### usersAssignedTo

> **usersAssignedTo**: `object`

Defined in: [src/utils/interfaces.ts:1484](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1484)

Information about users assigned to this tag.

#### totalCount

> **totalCount**: `number`
