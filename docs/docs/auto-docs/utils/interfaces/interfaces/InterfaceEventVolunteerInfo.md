[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:2383](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2383)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2391](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2391)

The creation date of the volunteer record.

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2404](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2404)

The user who created this volunteer record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2394](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2394)

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

Defined in: [src/utils/interfaces.ts:2406](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2406)

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

Defined in: [src/utils/interfaces.ts:2385](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2385)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:2387](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2387)

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2384](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2384)

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:2390](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2390)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/utils/interfaces.ts:2388](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2388)

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:2389](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2389)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2392](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2392)

The last update date of the volunteer record.

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2405](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2405)

The user who last updated this volunteer record.

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:2393](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2393)

The user information of the volunteer.

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/utils/interfaces.ts:2386](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2386)
