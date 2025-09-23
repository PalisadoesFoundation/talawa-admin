[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/types/Volunteer/interface.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L271)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L277)

The creation date of the volunteer record.

***

### creator

> **creator**: `object`

Defined in: [src/types/Volunteer/interface.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L294)

The user who created this volunteer record.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/types/Volunteer/interface.ts:284](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L284)

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

Defined in: [src/types/Volunteer/interface.ts:302](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L302)

Array of groups associated with the volunteer.

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

Defined in: [src/types/Volunteer/interface.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L273)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/types/Volunteer/interface.ts:275](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L275)

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L272)

The unique identifier of the event volunteer.

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L276)

Indicates if the volunteer profile is public.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L278)

The last update date of the volunteer record.

***

### updater

> **updater**: `object`

Defined in: [src/types/Volunteer/interface.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L298)

The user who last updated this volunteer record.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### user

> **user**: `object`

Defined in: [src/types/Volunteer/interface.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L279)

The user information of the volunteer.

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/types/Volunteer/interface.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L274)

The status of the volunteer.
