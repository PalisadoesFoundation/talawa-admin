[**talawa-admin**](README.md)

***

# Interface: IEvent

Defined in: [src/types/Event/interface.ts:39](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L39)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:50](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L50)

***

### attendees

> **attendees**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>[]

Defined in: [src/types/Event/interface.ts:54](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L54)

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:56](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L56)

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:60](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L60)

#### id

> **id**: `string`

***

### creator

> **creator**: `Partial`\<[`User`](types\Event\type\README\type-aliases\User.md)\>

Defined in: [src/types/Event/interface.ts:55](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L55)

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L45)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L47)

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L49)

***

### feedback?

> `optional` **feedback**: [`Feedback`](types\Event\type\README\type-aliases\Feedback.md)[]

Defined in: [src/types/Event/interface.ts:57](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L57)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:65](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L65)

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L42)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:52](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L52)

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:59](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L59)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:53](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L53)

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L41)

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L43)

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L44)

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:66](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L66)

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:68](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L68)

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](utils\recurrenceUtils\recurrenceTypes\README\interfaces\InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:69](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L69)

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:63](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L63)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L46)

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L48)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:64](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L64)

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L51)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:40](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/types/Event/interface.ts#L40)
