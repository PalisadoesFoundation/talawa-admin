[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:1816](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1816)

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1819](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1819)

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:1845](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1845)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1821](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1821)

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

Defined in: [src/utils/interfaces.ts:1841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1841)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1817](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1817)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:1818](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1818)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1820](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1820)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:1849](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1849)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:1830](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1830)

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
