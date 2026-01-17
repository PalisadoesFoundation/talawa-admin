[Admin Docs](/)

***

# Interface: IEventListCard

Defined in: [src/types/Event/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L126)

Event list card data with an optional refetch callback.

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

Defined in: [src/types/Event/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L58)

#### Inherited from

[`IEvent`](IEvent.md).[`attendees`](IEvent.md#attendees)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

#### Inherited from

[`IEvent`](IEvent.md).[`averageFeedbackScore`](IEvent.md#averagefeedbackscore)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L64)

#### id

> **id**: `string`

#### Inherited from

[`IEvent`](IEvent.md).[`baseEvent`](IEvent.md#baseevent)

***

### creator

> **creator**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

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

Defined in: [src/types/Event/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L61)

#### Inherited from

[`IEvent`](IEvent.md).[`feedback`](IEvent.md#feedback)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

#### Inherited from

[`IEvent`](IEvent.md).[`hasExceptions`](IEvent.md#hasexceptions)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

#### Inherited from

[`IEvent`](IEvent.md).[`id`](IEvent.md#id)

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

Defined in: [src/types/Event/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L63)

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

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

#### Inherited from

[`IEvent`](IEvent.md).[`progressLabel`](IEvent.md#progresslabel)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

#### Inherited from

[`IEvent`](IEvent.md).[`recurrenceDescription`](IEvent.md#recurrencedescription)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

#### Inherited from

[`IEvent`](IEvent.md).[`recurrenceRule`](IEvent.md#recurrencerule)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L127)

#### Returns

`void`

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

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

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

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
