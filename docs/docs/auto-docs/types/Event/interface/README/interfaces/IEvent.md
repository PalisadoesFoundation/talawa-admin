[Admin Docs](/)

***

# Interface: IEvent

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

***

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L56)

***

### attendees

> **attendees**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>[]

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L62)

***

### baseEventId?

> `optional` **baseEventId**: `string`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

***

### creator

> **creator**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>

Defined in: [src/types/Event/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L61)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

***

### endDate

> **endDate**: `string`

Defined in: [src/types/Event/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L53)

***

### endTime

> **endTime**: `string`

Defined in: [src/types/Event/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L55)

***

### feedback?

> `optional` **feedback**: [`Feedback`](types\Event\type\README\type-aliases\Feedback.md)[]

Defined in: [src/types/Event/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L63)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

***

### instanceStartTime?

> `optional` **instanceStartTime**: `string`

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

***

### isMaterialized?

> `optional` **isMaterialized**: `boolean`

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L58)

***

### isRecurringTemplate?

> `optional` **isRecurringTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L66)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

***

### recurringEventId?

> `optional` **recurringEventId**: `string`

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

***

### startDate

> **startDate**: `string`

Defined in: [src/types/Event/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L52)

***

### startTime

> **startTime**: `string`

Defined in: [src/types/Event/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L54)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L71)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L57)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)
