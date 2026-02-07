[Admin Docs](/)

***

# Interface: InterfaceEventDetailsQuery

Defined in: [src/utils/interfaces.ts:1838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1838)

Defines the structure for EVENT_DETAILS query result

## Properties

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1839)

#### allDay

> **allDay**: `boolean`

#### attachments?

> `optional` **attachments**: [`InterfaceEventAttachmentPg`](InterfaceEventAttachmentPg.md)[]

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

#### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

#### description

> **description**: `string`

#### endAt

> **endAt**: `string`

#### id

> **id**: `string`

#### isInviteOnly?

> `optional` **isInviteOnly**: `boolean`

#### isPublic

> **isPublic**: `boolean`

#### isRecurringEventTemplate?

> `optional` **isRecurringEventTemplate**: `boolean`

#### isRegisterable

> **isRegisterable**: `boolean`

#### location

> **location**: `string`

#### name

> **name**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

#### startAt

> **startAt**: `string`
