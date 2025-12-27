[Admin Docs](/)

***

# Interface: InterfaceTagData

Defined in: [src/utils/interfaces.ts:1440](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1440)

InterfaceTagData

## Description

Defines the structure for tag data.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:1441](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1441)

The unique identifier of the tag.

***

### ancestorTags

> **ancestorTags**: `object`[]

Defined in: [src/utils/interfaces.ts:1450](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1450)

An array of ancestor tags.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### childTags

> **childTags**: `object`

Defined in: [src/utils/interfaces.ts:1447](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1447)

Information about child tags.

#### totalCount

> **totalCount**: `number`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1442](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1442)

The name of the tag.

***

### parentTag

> **parentTag**: `object`

Defined in: [src/utils/interfaces.ts:1443](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1443)

The parent tag object.

#### \_id

> **\_id**: `string`

***

### usersAssignedTo

> **usersAssignedTo**: `object`

Defined in: [src/utils/interfaces.ts:1444](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1444)

Information about users assigned to this tag.

#### totalCount

> **totalCount**: `number`
