[Admin Docs](/)

***

# Interface: IEvent

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

***

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L58)

***

### attendees

> **attendees**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>[]

Defined in: [src/types/Event/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L62)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L64)

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/Event/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L71)

***

### creator

> **creator**: `Partial`\<[`User`](../../type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L63)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L53)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/Event/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L55)

***

### endTime

> **endTime**: `string`

Defined in: [src/types/Event/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L57)

***

### feedback?

> `optional` **feedback**: [`Feedback`](../../type/type-aliases/Feedback.md)[]

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L74)

***

### instanceStartTime?

> `optional` **instanceStartTime**: `string`

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

***

### isMaterialized?

> `optional` **isMaterialized**: `boolean`

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

***

### isRecurringTemplate?

> `optional` **isRecurringTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L61)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L75)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L77)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

***

### recurringEventId?

> `optional` **recurringEventId**: `string`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

***

### startDate

> **startDate**: `string`

Defined in: [src/types/Event/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L54)

***

### startTime

> **startTime**: `string`

Defined in: [src/types/Event/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L56)

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/Event/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L52)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)
