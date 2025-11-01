[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2511](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2511)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2514](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2514)

The creation date of the volunteer membership record.

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2540](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2540)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2516](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2516)

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

Defined in: [src/utils/interfaces.ts:2536](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2536)

The group associated with the membership.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2512](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2512)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2513](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2513)

The status of the volunteer membership.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:2515](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2515)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:2544](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2544)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2525](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L2525)

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
