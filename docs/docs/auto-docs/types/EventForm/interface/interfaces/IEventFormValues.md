[Admin Docs](/)

***

# Interface: IEventFormValues

Defined in: [src/types/EventForm/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L32)

Form values interface for event creation/editing.
Extends base fields with Date objects and time strings for form inputs.

## Extends

- `IEventFormBase`

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/EventForm/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L11)

#### Inherited from

`IEventFormBase.allDay`

***

### createChat?

> `optional` **createChat**: `boolean`

Defined in: [src/types/EventForm/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L25)

#### Inherited from

`IEventFormBase.createChat`

***

### description

> **description**: `string`

Defined in: [src/types/EventForm/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L9)

#### Inherited from

`IEventFormBase.description`

***

### endDate

> **endDate**: `Date`

Defined in: [src/types/EventForm/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L34)

***

### endTime

> **endTime**: `string`

Defined in: [src/types/EventForm/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L36)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/EventForm/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L21)

Determines if the event is accessible only by invitation.
Mutually exclusive with isPublic.

#### Inherited from

`IEventFormBase.isInviteOnly`

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/EventForm/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L16)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

#### Inherited from

`IEventFormBase.isPublic`

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/EventForm/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L22)

#### Inherited from

`IEventFormBase.isRegisterable`

***

### location

> **location**: `string`

Defined in: [src/types/EventForm/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L10)

#### Inherited from

`IEventFormBase.location`

***

### name

> **name**: `string`

Defined in: [src/types/EventForm/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L8)

#### Inherited from

`IEventFormBase.name`

***

### recurrenceRule

> **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/EventForm/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L24)

#### Inherited from

`IEventFormBase.recurrenceRule`

***

### startDate

> **startDate**: `Date`

Defined in: [src/types/EventForm/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L33)

***

### startTime

> **startTime**: `string`

Defined in: [src/types/EventForm/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L35)
