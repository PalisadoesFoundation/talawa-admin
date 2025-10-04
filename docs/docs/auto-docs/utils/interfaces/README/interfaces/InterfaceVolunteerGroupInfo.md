[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2410](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2410)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2411](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2411)

The unique identifier of the volunteer group.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2425](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2425)

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

Defined in: [src/utils/interfaces.ts:2418](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2418)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](utils\interfaces\README\interfaces\InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2419](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2419)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2413](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2413)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2414](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2414)

The event associated with the volunteer group.

#### \_id

> **\_id**: `string`

***

### leader

> **leader**: [`InterfaceUserInfo`](utils\interfaces\README\interfaces\InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2420](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2420)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2412](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2412)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2421](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2421)

An array of volunteers in the group.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](utils\interfaces\README\interfaces\InterfaceUserInfo.md)

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2417](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2417)

The number of volunteers required for the group, or null.
