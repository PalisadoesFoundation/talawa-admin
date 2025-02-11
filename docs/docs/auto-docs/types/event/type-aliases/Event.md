[Admin Docs](/)

***

# Type Alias: Event

> **Event**: `object`

Defined in: [src/types/event.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/event.ts#L8)

## Type declaration

### \_id

> **\_id**: `string`

### actionItems

> **actionItems**: [`ActionItem`](../../actionItem/type-aliases/ActionItem.md)[]

### admins?

> `optional` **admins**: [`User`](../../user/type-aliases/User.md)[]

### allDay

> **allDay**: `boolean`

### attendees

> **attendees**: [`User`](../../user/type-aliases/User.md)[]

### attendeesCheckInStatus

> **attendeesCheckInStatus**: [`CheckInStatus`](../../CheckIn/type/type-aliases/CheckInStatus.md)[]

### averageFeedbackScore?

> `optional` **averageFeedbackScore**: `number`

### createdAt

> **createdAt**: `Date`

### creator

> **creator**: [`User`](../../user/type-aliases/User.md)

### description

> **description**: `string`

### endDate?

> `optional` **endDate**: `Date`

### endTime?

> `optional` **endTime**: `string`

### feedback

> **feedback**: [`Feedback`](../../feedback/type-aliases/Feedback.md)[]

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

> `optional` **organization**: [`Organization`](../../organization/type-aliases/Organization.md)

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
