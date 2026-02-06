[Admin Docs](/)

***

# Interface: InterfaceEventDetailsQuery

Defined in: [src/utils/interfaces.ts:1901](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1901)

Defines the structure for EVENT_DETAILS query result

## Properties

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1902](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1902)

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
