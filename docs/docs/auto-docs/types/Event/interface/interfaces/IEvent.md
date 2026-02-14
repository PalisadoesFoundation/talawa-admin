[Admin Docs](/)

***

# Interface: IEvent

Defined in: [src/types/Event/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L40)

## Extended by

- [`IEventListCard`](IEventListCard.md)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

***

### attendees

> **attendees**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>[]

Defined in: [src/types/Event/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L64)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L66)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

#### id

> **id**: `string`

***

### creator

> **creator**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

***

### feedback?

> `optional` **feedback**: [`Feedback`](../../type/type-aliases/Feedback.md)[]

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L75)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L43)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L63)

Determines if the event is restricted to invited participants only.
When true, only invited users can see and access the event.

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L57)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L58)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L44)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L76)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L79)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L74)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L52)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L41)
