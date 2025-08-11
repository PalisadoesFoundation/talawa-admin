[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2395](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2395)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2396](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2396)

The unique identifier of the volunteer group.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2410](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2410)

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

Defined in: [src/utils/interfaces.ts:2403](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2403)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2404](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2404)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2398](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2398)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2399](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2399)

The event associated with the volunteer group.

#### \_id

> **\_id**: `string`

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2405](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2405)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2397](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2397)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2406](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2406)

An array of volunteers in the group.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2402](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2402)

The number of volunteers required for the group, or null.
