[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:2564](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2564)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2572](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2572)

The creation date of the volunteer record.

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2585](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2585)

The user who created this volunteer record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2575](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2575)

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

Defined in: [src/utils/interfaces.ts:2587](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2587)

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

Defined in: [src/utils/interfaces.ts:2566](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2566)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:2568](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2568)

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2565](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2565)

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:2571](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2571)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/utils/interfaces.ts:2569](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2569)

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:2570](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2570)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2573](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2573)

The last update date of the volunteer record.

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2586](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2586)

The user who last updated this volunteer record.

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2574](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2574)

The user information of the volunteer.

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/utils/interfaces.ts:2567](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2567)
