[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/types/Volunteer/interface.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L255)

Defines the structure for event volunteer information.

## Param

The unique identifier of the event volunteer.

## Param

Indicates if the volunteer has accepted.

## Param

The status of the volunteer.

## Param

The number of hours volunteered.

## Param

Indicates if the volunteer profile is public.

## Param

The creation date of the volunteer record.

## Param

The last update date of the volunteer record.

## Param

The user object information of the volunteer.

## Param

The event object associated with the volunteer.

## Param

The user object who created this volunteer record.

## Param

The user object who last updated this volunteer record.

## Param

Array of groups associated with the volunteer.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L263)

***

### creator

> **creator**: `object`

Defined in: [src/types/Volunteer/interface.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L285)

#### id

> **id**: `string`

The unique identifier of the creator

#### name

> **name**: `string`

The name of the creator

***

### event

> **event**: `object`

Defined in: [src/types/Volunteer/interface.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L273)

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

Defined in: [src/types/Volunteer/interface.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L297)

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

Defined in: [src/types/Volunteer/interface.ts:257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L257)

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/types/Volunteer/interface.ts:259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L259)

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L256)

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L262)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:260](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L260)

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L261)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:264](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L264)

***

### updater

> **updater**: `object`

Defined in: [src/types/Volunteer/interface.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L291)

#### id

> **id**: `string`

The unique identifier of the updater

#### name

> **name**: `string`

The name of the updater

***

### user

> **user**: `object`

Defined in: [src/types/Volunteer/interface.ts:265](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L265)

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

Defined in: [src/types/Volunteer/interface.ts:258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L258)
