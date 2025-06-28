[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2503](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2503)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### /_id

> **/_id**: `string`

Defined in: [src/utils/interfaces.ts:2504](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2504)

The unique identifier of the volunteer group.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2518](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2518)

An array of assignments for the group.

#### /_id

> **/_id**: `string`

#### actionItemCategory

> **actionItemCategory**: `object`

##### actionItemCategory./_id

> **/_id**: `string`

##### actionItemCategory.name

> **name**: `string`

#### allottedHours

> **allottedHours**: `number`

#### isCompleted

> **isCompleted**: `boolean`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2511](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2511)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfo

Defined in: [src/utils/interfaces.ts:2512](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2512)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2506](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2506)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2507](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2507)

The event associated with the volunteer group.

#### /_id

> **/_id**: `string`

***

### leader

> **leader**: [`InterfaceUserInfo`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfo

Defined in: [src/utils/interfaces.ts:2513](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2513)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2505](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2505)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2514](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2514)

An array of volunteers in the group.

#### /_id

> **/_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfo

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2510](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2510)

The number of volunteers required for the group, or null.
