[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: src/utils/interfaces.ts:2632

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:2635

The creation date of the volunteer membership record.

***

### createdBy

> **createdBy**: `object`

Defined in: src/utils/interfaces.ts:2661

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: src/utils/interfaces.ts:2637

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

Defined in: src/utils/interfaces.ts:2657

The group associated with the membership.

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:2633

***

### status

> **status**: `string`

Defined in: src/utils/interfaces.ts:2634

The status of the volunteer membership.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:2636

***

### updatedBy

> **updatedBy**: `object`

Defined in: src/utils/interfaces.ts:2665

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: src/utils/interfaces.ts:2646

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
