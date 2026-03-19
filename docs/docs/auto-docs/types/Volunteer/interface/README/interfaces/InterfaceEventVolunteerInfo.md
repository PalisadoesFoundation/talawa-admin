[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/types/Volunteer/interface.ts:243](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L243)

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L259)

The creation date of the volunteer record.

***

### creator

> **creator**: `object`

Defined in: [src/types/Volunteer/interface.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L285)

The user object who created this volunteer record.

#### id

> **id**: `string`

The unique identifier of the creator

#### name

> **name**: `string`

The name of the creator

***

### event

> **event**: `object`

Defined in: [src/types/Volunteer/interface.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L272)

The event object associated with the volunteer.

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

#### id

> **id**: `string`

The unique identifier of the event

#### name

> **name**: `string`

The name of the event

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

***

### groups

> **groups**: `object`[]

Defined in: [src/types/Volunteer/interface.ts:299](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L299)

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

Defined in: [src/types/Volunteer/interface.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L247)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/types/Volunteer/interface.ts:251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L251)

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:245](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L245)

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L257)

Indicates if this is an exception to a recurring instance.

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L253)

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L255)

Indicates if this is a template volunteer record.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L261)

The last update date of the volunteer record.

***

### updater

> **updater**: `object`

Defined in: [src/types/Volunteer/interface.ts:292](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L292)

The user object who last updated this volunteer record.

#### id

> **id**: `string`

The unique identifier of the updater

#### name

> **name**: `string`

The name of the updater

***

### user

> **user**: `object`

Defined in: [src/types/Volunteer/interface.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L263)

The user object information of the volunteer.

#### avatarURL?

> `optional` **avatarURL**: `string`

The avatar URL of the user (optional)

#### id

> **id**: `string`

The unique identifier of the user

#### name

> **name**: `string`

The name of the user

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/types/Volunteer/interface.ts:249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L249)

The status of the volunteer.
