[Admin Docs](/)

***

# Interface: IEventFormSubmitPayload

Defined in: [src/types/EventForm/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L43)

Payload interface for event form submission.
Extends base fields with ISO timestamp strings for API transmission.

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

### endAtISO

> **endAtISO**: `string`

Defined in: [src/types/EventForm/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L45)

***

### endDate

> **endDate**: `Date`

Defined in: [src/types/EventForm/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L47)

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

### startAtISO

> **startAtISO**: `string`

Defined in: [src/types/EventForm/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L44)

***

### startDate

> **startDate**: `Date`

Defined in: [src/types/EventForm/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/EventForm/interface.ts#L46)
