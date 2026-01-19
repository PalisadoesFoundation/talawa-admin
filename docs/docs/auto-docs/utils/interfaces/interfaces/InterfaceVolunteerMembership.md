[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:1834](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1834)

Defines the structure for volunteer membership information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1837)

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:1863](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1863)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1839)

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

Defined in: [src/utils/interfaces.ts:1859](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1859)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1835](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1835)

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:1836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1836)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1838)

***

### updatedBy

> **updatedBy**: `object`

Defined in: [src/utils/interfaces.ts:1867](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1867)

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:1848](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1848)

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
