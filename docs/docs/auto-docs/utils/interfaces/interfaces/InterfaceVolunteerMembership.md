[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:1836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1836)

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1839)

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:1865](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1865)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1841)

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

Defined in: [src/utils/interfaces.ts:1861](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1861)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1837)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:1838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1838)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1840](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1840)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:1869](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1869)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:1850](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1850)

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
