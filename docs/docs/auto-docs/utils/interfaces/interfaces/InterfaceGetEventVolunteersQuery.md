[Admin Docs](/)

***

# Interface: InterfaceGetEventVolunteersQuery

Defined in: [src/utils/interfaces.ts:2215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2215)

Defines the structure for GET_EVENT_VOLUNTEERS query result

## Properties

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2216](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2216)

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
