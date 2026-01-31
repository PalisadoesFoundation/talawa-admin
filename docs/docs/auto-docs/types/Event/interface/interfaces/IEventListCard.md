[Admin Docs](/)

***

# Interface: IEventListCard

Defined in: [src/types/Event/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L133)

Props for EventListCard component.

`@remarks` Extends IEvent and adds optional refetchEvents callback.

## Extends

- [`IEvent`](IEvent.md)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

#### Inherited from

[`IEvent`](IEvent.md).[`allDay`](IEvent.md#allday)

***

### attendees

> **attendees**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>[]

Defined in: [src/types/Event/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L63)

#### Inherited from

[`IEvent`](IEvent.md).[`attendees`](IEvent.md#attendees)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

#### Inherited from

[`IEvent`](IEvent.md).[`averageFeedbackScore`](IEvent.md#averagefeedbackscore)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

#### id

> **id**: `string`

#### Inherited from

[`IEvent`](IEvent.md).[`baseEvent`](IEvent.md#baseevent)

***

### creator

> **creator**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L64)

#### Inherited from

[`IEvent`](IEvent.md).[`creator`](IEvent.md#creator)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

#### Inherited from

[`IEvent`](IEvent.md).[`description`](IEvent.md#description)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

#### Inherited from

[`IEvent`](IEvent.md).[`endAt`](IEvent.md#endat)

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

#### Inherited from

[`IEvent`](IEvent.md).[`endTime`](IEvent.md#endtime)

***

### feedback?

> `optional` **feedback**: [`Feedback`](../../type/type-aliases/Feedback.md)[]

Defined in: [src/types/Event/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L66)

#### Inherited from

[`IEvent`](IEvent.md).[`feedback`](IEvent.md#feedback)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L74)

#### Inherited from

[`IEvent`](IEvent.md).[`hasExceptions`](IEvent.md#hasexceptions)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

#### Inherited from

[`IEvent`](IEvent.md).[`id`](IEvent.md#id)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L62)

Determines if the event is restricted to invited participants only.
When true, only invited users can see and access the event.

#### Inherited from

[`IEvent`](IEvent.md).[`isInviteOnly`](IEvent.md#isinviteonly)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L56)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

#### Inherited from

[`IEvent`](IEvent.md).[`isPublic`](IEvent.md#ispublic)

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

#### Inherited from

[`IEvent`](IEvent.md).[`isRecurringEventTemplate`](IEvent.md#isrecurringeventtemplate)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L57)

#### Inherited from

[`IEvent`](IEvent.md).[`isRegisterable`](IEvent.md#isregisterable)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L41)

#### Inherited from

[`IEvent`](IEvent.md).[`key`](IEvent.md#key)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L43)

#### Inherited from

[`IEvent`](IEvent.md).[`location`](IEvent.md#location)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L44)

#### Inherited from

[`IEvent`](IEvent.md).[`name`](IEvent.md#name)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L75)

#### Inherited from

[`IEvent`](IEvent.md).[`progressLabel`](IEvent.md#progresslabel)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L77)

#### Inherited from

[`IEvent`](IEvent.md).[`recurrenceDescription`](IEvent.md#recurrencedescription)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

#### Inherited from

[`IEvent`](IEvent.md).[`recurrenceRule`](IEvent.md#recurrencerule)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L135)

Optional callback to refresh the events list after modifications.

#### Returns

`void`

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

#### Inherited from

[`IEvent`](IEvent.md).[`sequenceNumber`](IEvent.md#sequencenumber)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

#### Inherited from

[`IEvent`](IEvent.md).[`startAt`](IEvent.md#startat)

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

#### Inherited from

[`IEvent`](IEvent.md).[`startTime`](IEvent.md#starttime)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

#### Inherited from

[`IEvent`](IEvent.md).[`totalCount`](IEvent.md#totalcount)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

#### Inherited from

[`IEvent`](IEvent.md).[`userId`](IEvent.md#userid)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L40)

#### Inherited from

[`IEvent`](IEvent.md).[`userRole`](IEvent.md#userrole)
