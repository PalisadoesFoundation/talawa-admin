[Admin Docs](/)

***

# Interface: InterfaceOrgInfoTypePG

Defined in: [src/utils/interfaces.ts:559](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L559)

InterfaceOrgInfoTypePG

## Description

Defines the structure for organization information with PostgreSQL-specific fields.

## Properties

### addressLine1

> **addressLine1**: `string`

Defined in: [src/utils/interfaces.ts:562](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L562)

The first line of the organization's address.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:564](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L564)

The URL of the organization's avatar, or null.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:565](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L565)

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:563](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L563)

The description of the organization.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:560](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L560)

The unique identifier of the organization.

***

### members

> **members**: `object`

Defined in: [src/utils/interfaces.ts:566](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L566)

The members connection object.

#### edges

> **edges**: `object`[]

#### pageInfo?

> `optional` **pageInfo**: `object`

##### pageInfo.hasNextPage

> **hasNextPage**: `boolean`

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:561](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L561)

The name of the organization.
