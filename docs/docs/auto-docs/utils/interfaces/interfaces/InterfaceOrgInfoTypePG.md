[Admin Docs](/)

***

# Interface: InterfaceOrgInfoTypePG

Defined in: src/utils/interfaces.ts:537

InterfaceOrgInfoTypePG

## Description

Defines the structure for organization information with PostgreSQL-specific fields.

## Properties

### addressLine1

> **addressLine1**: `string`

Defined in: src/utils/interfaces.ts:540

The first line of the organization's address.

***

### avatarURL

> **avatarURL**: `string`

Defined in: src/utils/interfaces.ts:542

The URL of the organization's avatar, or null.

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:543

***

### description

> **description**: `string`

Defined in: src/utils/interfaces.ts:541

The description of the organization.

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:538

The unique identifier of the organization.

***

### members?

> `optional` **members**: `object`

Defined in: src/utils/interfaces.ts:545

The members connection object.

#### edges

> **edges**: `object`[]

***

### membersCount?

> `optional` **membersCount**: `number`

Defined in: src/utils/interfaces.ts:544

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:539

The name of the organization.

***

### role

> **role**: `string`

Defined in: src/utils/interfaces.ts:552
