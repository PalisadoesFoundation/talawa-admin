[Admin Docs](/)

***

# Type Alias: Event

> **Event**: `object`

Defined in: [src/types/Event/type.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/type.ts#L19)

## Type declaration

### \_id

> **\_id**: `string`

### actionItems

> **actionItems**: [`ActionItem`](../../../actionItem/type-aliases/ActionItem.md)[]

### admins?

> `optional` **admins**: [`User`](User.md)[]

### allDay

> **allDay**: `boolean`

### attendees

> **attendees**: [`User`](User.md)[]

### attendeesCheckInStatus

> **attendeesCheckInStatus**: [`CheckInStatus`](../../../CheckIn/type/type-aliases/CheckInStatus.md)[]

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

### createdAt

> **createdAt**: `Date`

### creator

> **creator**: [`User`](User.md)

### description

> **description**: `string`

### endDate?

> `optional` **endDate**: `Date`

### endTime?

> `optional` **endTime**: `string`

### feedback

> **feedback**: [`Feedback`](Feedback.md)[]

### isPublic

> **isPublic**: `boolean`

### isRegisterable

> **isRegisterable**: `boolean`

### latitude?

> `optional` **latitude**: `number`

### location?

> `optional` **location**: `string`

### longitude?

> `optional` **longitude**: `number`

### organization?

> `optional` **organization**: [`Organization`](../../../organization/type-aliases/Organization.md)

### recurrance?

> `optional` **recurrance**: `string`

### recurring

> **recurring**: `boolean`

### startDate

> **startDate**: `Date`

### startTime

> **startTime**: `string`

### status

> **status**: `string`

### title

> **title**: `string`

### updatedAt

> **updatedAt**: `Date`
