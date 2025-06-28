[Admin Docs](/)

***

# Interface: InterfaceUserEvents

Defined in: [src/utils/interfaces.ts:2562](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2562)

InterfaceUserEvents

## Description

Extends `InterfaceBaseEvent` with additional properties for user-related events.

## Extends

- [`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent

## Properties

### /_id

> **/_id**: `string`

Defined in: [src/utils/interfaces.ts:422](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L422)

The unique identifier of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`_id`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#_id)

***

### allDay

> **allDay**: `boolean`

Defined in: [src/utils/interfaces.ts:430](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L430)

Indicates if the event is an all-day event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`allDay`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#allday)

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:424](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L424)

The description of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`description`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#description)

***

### endDate

> **endDate**: `string`

Defined in: [src/utils/interfaces.ts:426](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L426)

The end date of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`endDate`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#enddate)

***

### endTime

> **endTime**: `string`

Defined in: [src/utils/interfaces.ts:429](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L429)

The end time of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`endTime`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#endtime)

***

### location

> **location**: `string`

Defined in: [src/utils/interfaces.ts:427](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L427)

The location of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`location`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#location)

***

### recurring

> **recurring**: `boolean`

Defined in: [src/utils/interfaces.ts:431](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L431)

Indicates if the event is a recurring event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`recurring`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#recurring)

***

### startDate

> **startDate**: `string`

Defined in: [src/utils/interfaces.ts:425](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L425)

The start date of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`startDate`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#startdate)

***

### startTime

> **startTime**: `string`

Defined in: [src/utils/interfaces.ts:428](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L428)

The start time of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`startTime`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#starttime)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:423](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L423)

The title of the event.

#### Inherited from

[`InterfaceBaseEvent`]/auto-docs/utils/interfaces/README/interfaces/InterfaceBaseEvent.[`title`](utils/interfaces/README/interfaces/InterfaceBaseEvent.md#title)

***

### volunteerGroups

> **volunteerGroups**: `object`[]

Defined in: [src/utils/interfaces.ts:2563](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2563)

An array of volunteer groups associated with the event.

#### /_id

> **/_id**: `string`

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

Defined in: [src/utils/interfaces.ts:2570](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2570)

An array of volunteers associated with the event.

#### /_id

> **/_id**: `string`

#### user

> **user**: `object`

##### user./_id

> **/_id**: `string`
