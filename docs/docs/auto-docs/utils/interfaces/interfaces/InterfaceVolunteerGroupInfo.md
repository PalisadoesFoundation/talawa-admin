[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2400](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2400)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2401](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2401)

The unique identifier of the volunteer group.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2415](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2415)

An array of assignments for the group.

#### \_id

> **\_id**: `string`

#### actionItemCategory

> **actionItemCategory**: `object`

##### actionItemCategory.\_id

> **\_id**: `string`

##### actionItemCategory.name

> **name**: `string`

#### allottedHours

> **allottedHours**: `number`

#### isCompleted

> **isCompleted**: `boolean`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2408](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2408)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2409](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2409)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2403](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2403)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2404](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2404)

The event associated with the volunteer group.

#### \_id

> **\_id**: `string`

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2410](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2410)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2402](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2402)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2411](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2411)

An array of volunteers in the group.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2407](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2407)

The number of volunteers required for the group, or null.
