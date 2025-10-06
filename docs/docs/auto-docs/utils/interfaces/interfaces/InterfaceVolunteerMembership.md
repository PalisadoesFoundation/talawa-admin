[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2502](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2502)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2505](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2505)

The creation date of the volunteer membership record.

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2531](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2531)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2507](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2507)

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

Defined in: [src/utils/interfaces.ts:2527](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2527)

The group associated with the membership.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2503](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2503)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2504](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2504)

The status of the volunteer membership.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2506](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2506)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:2535](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2535)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2516](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2516)

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
