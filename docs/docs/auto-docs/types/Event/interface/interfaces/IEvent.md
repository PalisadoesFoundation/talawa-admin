[Admin Docs](/)

***

# Interface: IEvent

Defined in: [src/types/Event/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L39)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

***

### attendees

> **attendees**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>[]

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L61)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

#### id

> **id**: `string`

***

### creator

> **creator**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

***

### feedback?

> `optional` **feedback**: [`Feedback`](../../type/type-aliases/Feedback.md)[]

Defined in: [src/types/Event/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L62)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L58)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L56)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L64)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L57)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L41)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L43)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L44)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L71)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L74)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L40)
