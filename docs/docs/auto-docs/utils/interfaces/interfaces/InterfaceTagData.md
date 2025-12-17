[Admin Docs](/)

***

# Interface: InterfaceTagData

Defined in: src/utils/interfaces.ts:1457

InterfaceTagData

## Description

Defines the structure for tag data.

## Properties

### \_id

> **\_id**: `string`

Defined in: src/utils/interfaces.ts:1458

The unique identifier of the tag.

***

### ancestorTags

> **ancestorTags**: `object`[]

Defined in: src/utils/interfaces.ts:1467

An array of ancestor tags.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### childTags

> **childTags**: `object`

Defined in: src/utils/interfaces.ts:1464

Information about child tags.

#### totalCount

> **totalCount**: `number`

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:1459

The name of the tag.

***

### parentTag

> **parentTag**: `object`

Defined in: src/utils/interfaces.ts:1460

The parent tag object.

#### \_id

> **\_id**: `string`

***

### usersAssignedTo

> **usersAssignedTo**: `object`

Defined in: src/utils/interfaces.ts:1461

Information about users assigned to this tag.

#### totalCount

> **totalCount**: `number`
