[Admin Docs](/)

***

# Interface: InterfaceEventListCard

Defined in: [src/types/shared-components/EventListCard/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L8)

Event list card props extending InterfaceEvent.

## Remarks

refetchEvents is optional and triggers a refresh when provided.

## Extends

- [`InterfaceEvent`](../../../../Event/interface/type-aliases/InterfaceEvent.md)

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/Event/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L53)

#### Inherited from

`InterfaceEvent.allDay`

***

### attendees

> **attendees**: `Partial`\<[`User`](../../../../Event/type/type-aliases/User.md)\>[]

Defined in: [src/types/Event/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L67)

#### Inherited from

`InterfaceEvent.attendees`

***

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

Defined in: [src/types/Event/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L69)

#### Inherited from

`InterfaceEvent.averageFeedbackScore`

***

### baseEvent?

> `optional` **baseEvent**: `object`

Defined in: [src/types/Event/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L73)

#### id

> **id**: `string`

#### Inherited from

`InterfaceEvent.baseEvent`

***

### createChat?

> `optional` **createChat**: `boolean`

Defined in: [src/types/Event/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L66)

#### Inherited from

`InterfaceEvent.createChat`

***

### creator

> **creator**: `Partial`\<[`User`](../../../../Event/type/type-aliases/User.md)\>

Defined in: [src/types/Event/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L68)

#### Inherited from

`InterfaceEvent.creator`

***

### description

> **description**: `string`

Defined in: [src/types/Event/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L46)

#### Inherited from

`InterfaceEvent.description`

***

### endAt

> **endAt**: `string`

Defined in: [src/types/Event/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L48)

#### Inherited from

`InterfaceEvent.endAt`

***

### endDate?

> `optional` **endDate**: `string`

Defined in: [src/types/Event/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L50)

#### Inherited from

`InterfaceEvent.endDate`

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/Event/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L52)

#### Inherited from

`InterfaceEvent.endTime`

***

### feedback?

> `optional` **feedback**: [`Feedback`](../../../../Event/type/type-aliases/Feedback.md)[]

Defined in: [src/types/Event/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L70)

#### Inherited from

`InterfaceEvent.feedback`

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/Event/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L78)

#### Inherited from

`InterfaceEvent.hasExceptions`

***

### id

> **id**: `string`

Defined in: [src/types/Event/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L43)

#### Inherited from

`InterfaceEvent.id`

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/Event/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L65)

Determines if the event is restricted to invited participants only.
When true, only invited users can see and access the event.

#### Inherited from

`InterfaceEvent.isInviteOnly`

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/Event/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L59)

Determines if the event is visible to the entire community.
Often referred to as "Community Visible" in the UI.

#### Inherited from

`InterfaceEvent.isPublic`

***

### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/Event/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L72)

#### Inherited from

`InterfaceEvent.isRecurringEventTemplate`

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/Event/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L60)

#### Inherited from

`InterfaceEvent.isRegisterable`

***

### key?

> `optional` **key**: `string`

Defined in: [src/types/Event/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L42)

#### Inherited from

`InterfaceEvent.key`

***

### location

> **location**: `string`

Defined in: [src/types/Event/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L44)

#### Inherited from

`InterfaceEvent.location`

***

### name

> **name**: `string`

Defined in: [src/types/Event/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L45)

#### Inherited from

`InterfaceEvent.name`

***

### progressLabel?

> `optional` **progressLabel**: `string`

Defined in: [src/types/Event/interface.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L79)

#### Inherited from

`InterfaceEvent.progressLabel`

***

### recurrenceDescription?

> `optional` **recurrenceDescription**: `string`

Defined in: [src/types/Event/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L81)

#### Inherited from

`InterfaceEvent.recurrenceDescription`

***

### recurrenceRule?

> `optional` **recurrenceRule**: [`InterfaceRecurrenceRule`](../../../../../utils/recurrenceUtils/recurrenceTypes/interfaces/InterfaceRecurrenceRule.md)

Defined in: [src/types/Event/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L82)

#### Inherited from

`InterfaceEvent.recurrenceRule`

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void` \| `Promise`\<`void`\>

Defined in: [src/types/shared-components/EventListCard/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L9)

#### Returns

`void` \| `Promise`\<`void`\>

***

### sequenceNumber?

> `optional` **sequenceNumber**: `number`

Defined in: [src/types/Event/interface.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L76)

#### Inherited from

`InterfaceEvent.sequenceNumber`

***

### startAt

> **startAt**: `string`

Defined in: [src/types/Event/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L47)

#### Inherited from

`InterfaceEvent.startAt`

***

### startDate?

> `optional` **startDate**: `string`

Defined in: [src/types/Event/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L49)

#### Inherited from

`InterfaceEvent.startDate`

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/Event/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L51)

#### Inherited from

`InterfaceEvent.startTime`

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/Event/interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L77)

#### Inherited from

`InterfaceEvent.totalCount`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L54)

#### Inherited from

`InterfaceEvent.userId`

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L41)

#### Inherited from

`InterfaceEvent.userRole`
