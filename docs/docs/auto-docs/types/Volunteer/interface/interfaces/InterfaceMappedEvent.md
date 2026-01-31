[Admin Docs](/)

***

# Interface: InterfaceMappedEvent

Defined in: [src/types/Volunteer/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L113)

InterfaceMappedEvent

## Description

Defines the structure for mapped event objects used in the UI.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/types/Volunteer/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L114)

Legacy ID format.

***

### baseEventId

> **baseEventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L126)

The base event ID for recurring events.

***

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L118)

The description of the event.

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L122)

The original endAt field.

***

### endDate

> **endDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L120)

The end date (mapped from endAt).

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L115)

The unique identifier of the event.

***

### isRecurringInstance

> **isRecurringInstance**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L125)

Indicates if this is a recurring instance.

***

### location

> **location**: `string`

Defined in: [src/types/Volunteer/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L123)

The location of the event.

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L116)

The name of the event.

***

### recurrenceRule?

> `optional` **recurrenceRule**: `object`

Defined in: [src/types/Volunteer/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L127)

The recurrence rule for recurring events.

#### frequency

> **frequency**: `string`

#### id

> **id**: `string`

***

### recurring

> **recurring**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L124)

Indicates if the event is recurring.

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L121)

The original startAt field.

***

### startDate

> **startDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L119)

The start date (mapped from startAt).

***

### title

> **title**: `string`

Defined in: [src/types/Volunteer/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L117)

The title of the event (mapped from name).

***

### volunteerGroups

> **volunteerGroups**: `object`[]

Defined in: [src/types/Volunteer/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L131)

Array of volunteer groups with mapped structure.

#### \_id

> **\_id**: `string`

#### description

> **description**: `string`

#### name

> **name**: `string`

#### volunteers

> **volunteers**: `object`[]

#### volunteersRequired

> **volunteersRequired**: `number`

***

### volunteers

> **volunteers**: `object`[]

Defined in: [src/types/Volunteer/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L145)

Array of volunteers.

#### hasAccepted

> **hasAccepted**: `boolean`

#### id

> **id**: `string`

#### user

> **user**: `object`

##### user.id

> **id**: `string`

##### user.name

> **name**: `string`
