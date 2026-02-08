[Admin Docs](/)

***

# Interface: InterfaceMappedEvent

Defined in: [src/types/Volunteer/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L109)

Defines the structure for mapped event objects used in the UI.

## Param

Legacy ID format.

## Param

The unique identifier of the event.

## Param

The name of the event.

## Param

The title of the event (mapped from name).

## Param

The description of the event.

## Param

The start date (mapped from startAt).

## Param

The end date (mapped from endAt).

## Param

The original startAt field.

## Param

The original endAt field.

## Param

The location of the event.

## Param

Indicates if the event is recurring.

## Param

Indicates if this is a recurring instance.

## Param

The base event ID for recurring events.

## Param

(Optional) The recurrence rule for recurring events.

## Param

Array of volunteer groups with mapped structure.

## Param

Array of volunteers.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/types/Volunteer/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L110)

***

### baseEventId

> **baseEventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L122)

***

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L114)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L118)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L116)

***

### id

> **id**: `string`

Defined in: [src/types/Volunteer/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L111)

***

### isRecurringInstance

> **isRecurringInstance**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L121)

***

### location

> **location**: `string`

Defined in: [src/types/Volunteer/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L119)

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L112)

***

### recurrenceRule?

> `optional` **recurrenceRule**: `object`

Defined in: [src/types/Volunteer/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L123)

#### frequency

> **frequency**: `string`

#### id

> **id**: `string`

***

### recurring

> **recurring**: `boolean`

Defined in: [src/types/Volunteer/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L120)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Volunteer/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L117)

***

### startDate

> **startDate**: `string`

Defined in: [src/types/Volunteer/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L115)

***

### title

> **title**: `string`

Defined in: [src/types/Volunteer/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L113)

***

### volunteerGroups

> **volunteerGroups**: `object`[]

Defined in: [src/types/Volunteer/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L127)

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
