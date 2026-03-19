[Admin Docs](/)

***

# Interface: InterfaceMappedEvent

Defined in: [src/types/Volunteer/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L93)

Defines the structure for mapped event objects used in the UI.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/types/Volunteer/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L95)

Legacy ID format.

***

### baseEventId

> **baseEventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L119)

The base event ID for recurring events.

***

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L103)

The description of the event.

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L111)

The original endAt field.

***

### endDate

> **endDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L107)

The end date (mapped from endAt).

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L97)

The unique identifier of the event.

***

### isRecurringInstance

> **isRecurringInstance**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L117)

Indicates if this is a recurring instance.

***

### location

> **location**: `string`

Defined in: [src/types/Volunteer/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L113)

The location of the event.

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L99)

The name of the event.

***

### recurrenceRule?

> `optional` **recurrenceRule**: `object`

Defined in: [src/types/Volunteer/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L121)

(Optional) The recurrence rule for recurring events.

#### frequency

> **frequency**: `string`

#### id

> **id**: `string`

***

### recurring

> **recurring**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L115)

Indicates if the event is recurring.

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L109)

The original startAt field.

***

### startDate

> **startDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L105)

The start date (mapped from startAt).

***

### title

> **title**: `string`

Defined in: [src/types/Volunteer/interface.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L101)

The title of the event (mapped from name).

***

### volunteerGroups

> **volunteerGroups**: `object`[]

Defined in: [src/types/Volunteer/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L126)

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

Defined in: [src/types/Volunteer/interface.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L141)

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
