[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2664](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2664)

InterfaceVolunteerMembership
Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2667](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2667)

The creation date of the volunteer membership record.

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2693](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2693)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2669](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2669)

The event associated with the volunteer membership.

#### endAt

> **endAt**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

#### startAt

> **startAt**: `string`

***

### group?

> `optional` **group**: `object`

Defined in: [src/utils/interfaces.ts:2689](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2689)

The group associated with the membership.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2665](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2665)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2666](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2666)

The status of the volunteer membership.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2668](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2668)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:2697](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2697)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2678](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2678)

The volunteer associated with the membership.

#### hasAccepted

> **hasAccepted**: `boolean`

#### hoursVolunteered

> **hoursVolunteered**: `number`

#### id

> **id**: `string`

#### user

> **user**: `object`

##### user.avatarURL?

> `optional` **avatarURL**: `string`

##### user.emailAddress

> **emailAddress**: `string`

##### user.id

> **id**: `string`

##### user.name

> **name**: `string`
