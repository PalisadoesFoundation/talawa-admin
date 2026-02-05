[Admin Docs](/)

***

# Interface: InterfaceGetEventVolunteersQuery

Defined in: [src/utils/interfaces.ts:2205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2205)

Defines the structure for GET_EVENT_VOLUNTEERS query result

## Properties

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2206)

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

#### id

> **id**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

#### volunteers

> **volunteers**: [`InterfaceEventVolunteerInfo`](InterfaceEventVolunteerInfo.md)[]
