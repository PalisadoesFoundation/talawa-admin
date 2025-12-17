[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: src/utils/interfaces.ts:2504

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:2512

The creation date of the volunteer record.

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: src/utils/interfaces.ts:2525

The user who created this volunteer record.

***

### event

> **event**: `object`

Defined in: src/utils/interfaces.ts:2515

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

Defined in: src/utils/interfaces.ts:2527

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

Defined in: src/utils/interfaces.ts:2506

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: src/utils/interfaces.ts:2508

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:2505

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: src/utils/interfaces.ts:2511

***

### isPublic

> **isPublic**: `boolean`

Defined in: src/utils/interfaces.ts:2509

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: src/utils/interfaces.ts:2510

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:2513

The last update date of the volunteer record.

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: src/utils/interfaces.ts:2526

The user who last updated this volunteer record.

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: src/utils/interfaces.ts:2514

The user information of the volunteer.

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: src/utils/interfaces.ts:2507
