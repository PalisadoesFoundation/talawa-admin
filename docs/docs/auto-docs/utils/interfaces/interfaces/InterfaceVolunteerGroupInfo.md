[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2561](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2561)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2571](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2571)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2572](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2572)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2564](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2564)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2565](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2565)

The event associated with the volunteer group.

#### id

> **id**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2562](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2562)

The unique identifier of the volunteer group.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:2570](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2570)

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:2569](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2569)

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2573](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2573)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2563](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2563)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2574](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2574)

An array of volunteers in the group.

#### hasAccepted

> **hasAccepted**: `boolean`

#### hoursVolunteered

> **hoursVolunteered**: `number`

#### id

> **id**: `string`

#### isPublic

> **isPublic**: `boolean`

#### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2568](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2568)

The number of volunteers required for the group, or null.
