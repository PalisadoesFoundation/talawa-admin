[Admin Docs](/)

***

# Interface: InterfaceMappedEvent

Defined in: src/types/Volunteer/interface.ts:113

InterfaceMappedEvent

## Description

Defines the structure for mapped event objects used in the UI.

## Properties

### \_id

> **\_id**: `string`

Defined in: src/types/Volunteer/interface.ts:114

Legacy ID format.

***

### baseEventId

> **baseEventId**: `string`

Defined in: src/types/Volunteer/interface.ts:126

The base event ID for recurring events.

***

### description

> **description**: `string`

Defined in: src/types/Volunteer/interface.ts:118

The description of the event.

***

### endAt

> **endAt**: `string`

Defined in: src/types/Volunteer/interface.ts:122

The original endAt field.

***

### endDate

> **endDate**: `string`

Defined in: src/types/Volunteer/interface.ts:120

The end date (mapped from endAt).

***

### id

> **id**: `string`

Defined in: src/types/Volunteer/interface.ts:115

The unique identifier of the event.

***

### isRecurringInstance

> **isRecurringInstance**: `boolean`

Defined in: src/types/Volunteer/interface.ts:125

Indicates if this is a recurring instance.

***

### location

> **location**: `string`

Defined in: src/types/Volunteer/interface.ts:123

The location of the event.

***

### name

> **name**: `string`

Defined in: src/types/Volunteer/interface.ts:116

The name of the event.

***

### recurrenceRule?

> `optional` **recurrenceRule**: `object`

Defined in: src/types/Volunteer/interface.ts:127

The recurrence rule for recurring events.

#### frequency

> **frequency**: `string`

#### id

> **id**: `string`

***

### recurring

> **recurring**: `boolean`

Defined in: src/types/Volunteer/interface.ts:124

Indicates if the event is recurring.

***

### startAt

> **startAt**: `string`

Defined in: src/types/Volunteer/interface.ts:121

The original startAt field.

***

### startDate

> **startDate**: `string`

Defined in: src/types/Volunteer/interface.ts:119

The start date (mapped from startAt).

***

### title

> **title**: `string`

Defined in: src/types/Volunteer/interface.ts:117

The title of the event (mapped from name).

***

### volunteerGroups

> **volunteerGroups**: `object`[]

Defined in: src/types/Volunteer/interface.ts:131

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

Defined in: src/types/Volunteer/interface.ts:145

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
