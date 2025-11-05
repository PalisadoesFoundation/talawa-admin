[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: [src/utils/interfaces.ts:2443](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2443)

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2453](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2453)

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2454](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2454)

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2446](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2446)

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2447](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2447)

The event associated with the volunteer group.

#### id

> **id**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2444](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2444)

The unique identifier of the volunteer group.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:2452](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2452)

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:2451](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2451)

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2455](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2455)

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2445](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2445)

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/utils/interfaces.ts:2456](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2456)

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

Defined in: [src/utils/interfaces.ts:2450](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2450)

The number of volunteers required for the group, or null.
