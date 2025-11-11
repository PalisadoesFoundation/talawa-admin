[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:2416](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2416)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2424](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2424)

The creation date of the volunteer record.

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2437](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2437)

The user who created this volunteer record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2427](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2427)

The event associated with the volunteer.

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

***

### groups

> **groups**: `object`[]

Defined in: [src/utils/interfaces.ts:2439](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2439)

#### description

> **description**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### volunteers

> **volunteers**: `object`[]

***

### hasAccepted

> **hasAccepted**: `boolean`

Defined in: [src/utils/interfaces.ts:2418](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2418)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:2420](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2420)

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2417](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2417)

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:2423](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2423)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/utils/interfaces.ts:2421](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2421)

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:2422](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2422)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2425](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2425)

The last update date of the volunteer record.

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2438](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2438)

The user who last updated this volunteer record.

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2426](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2426)

The user information of the volunteer.

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/utils/interfaces.ts:2419](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2419)
