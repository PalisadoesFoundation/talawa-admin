[Admin Docs](/)

***

# Interface: InterfaceTagData

Defined in: [src/utils/interfaces.ts:1454](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1454)

InterfaceTagData

## Description

Defines the structure for tag data.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:1455](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1455)

The unique identifier of the tag.

***

### ancestorTags

> **ancestorTags**: `object`[]

Defined in: [src/utils/interfaces.ts:1464](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1464)

An array of ancestor tags.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### childTags

> **childTags**: `object`

Defined in: [src/utils/interfaces.ts:1461](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1461)

Information about child tags.

#### totalCount

> **totalCount**: `number`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1456](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1456)

The name of the tag.

***

### parentTag

> **parentTag**: `object`

Defined in: [src/utils/interfaces.ts:1457](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1457)

The parent tag object.

#### \_id

> **\_id**: `string`

***

### usersAssignedTo

> **usersAssignedTo**: `object`

Defined in: [src/utils/interfaces.ts:1458](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1458)

Information about users assigned to this tag.

#### totalCount

> **totalCount**: `number`
