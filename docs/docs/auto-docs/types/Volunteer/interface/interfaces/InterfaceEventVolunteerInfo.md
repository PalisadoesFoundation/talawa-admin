[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: src/types/Volunteer/interface.ts:271

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/types/Volunteer/interface.ts:279

The creation date of the volunteer record.

***

### creator

> **creator**: `object`

Defined in: src/types/Volunteer/interface.ts:296

The user who created this volunteer record.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: src/types/Volunteer/interface.ts:286

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

Defined in: src/types/Volunteer/interface.ts:304

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

Defined in: src/types/Volunteer/interface.ts:273

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: src/types/Volunteer/interface.ts:275

The number of hours volunteered.

***

### id

> **id**: `string`

Defined in: src/types/Volunteer/interface.ts:272

The unique identifier of the event volunteer.

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: src/types/Volunteer/interface.ts:278

***

### isPublic

> **isPublic**: `boolean`

Defined in: src/types/Volunteer/interface.ts:276

Indicates if the volunteer profile is public.

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: src/types/Volunteer/interface.ts:277

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/types/Volunteer/interface.ts:280

The last update date of the volunteer record.

***

### updater

> **updater**: `object`

Defined in: src/types/Volunteer/interface.ts:300

The user who last updated this volunteer record.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### user

> **user**: `object`

Defined in: src/types/Volunteer/interface.ts:281

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

Defined in: src/types/Volunteer/interface.ts:274

The status of the volunteer.
