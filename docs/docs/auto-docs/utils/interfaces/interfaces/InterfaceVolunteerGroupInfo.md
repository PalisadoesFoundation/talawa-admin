[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupInfo

Defined in: src/utils/interfaces.ts:2563

InterfaceVolunteerGroupInfo

## Description

Defines the structure for volunteer group information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:2573

The creation date of the volunteer group record.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: src/utils/interfaces.ts:2574

The user who created this volunteer group.

***

### description

> **description**: `string`

Defined in: src/utils/interfaces.ts:2566

The description of the volunteer group, or null.

***

### event

> **event**: `object`

Defined in: src/utils/interfaces.ts:2567

The event associated with the volunteer group.

#### id

> **id**: `string`

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:2564

The unique identifier of the volunteer group.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: src/utils/interfaces.ts:2572

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: src/utils/interfaces.ts:2571

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: src/utils/interfaces.ts:2575

The leader of the volunteer group.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:2565

The name of the volunteer group.

***

### volunteers

> **volunteers**: `object`[]

Defined in: src/utils/interfaces.ts:2576

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

Defined in: src/utils/interfaces.ts:2570

The number of volunteers required for the group, or null.
