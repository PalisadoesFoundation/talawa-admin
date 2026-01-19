[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:1762](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1762)

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1770](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1770)

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1783](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1783)

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1773](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1773)

#### baseEvent?

> `optional` **baseEvent**: `object`

##### baseEvent.id

> **id**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### recurrenceRule?

> `optional` **recurrenceRule**: `object`

##### recurrenceRule.id

> **id**: `string`

***

### groups

> **groups**: `object`[]

Defined in: [src/utils/interfaces.ts:1785](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1785)

#### description

> **description**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### volunteers

> **volunteers**: `object`[]

***

### hasAccepted

> **hasAccepted**: `boolean`

Defined in: [src/utils/interfaces.ts:1764](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1764)

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:1766](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1766)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1763](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1763)

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:1769](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1769)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/utils/interfaces.ts:1767](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1767)

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:1768](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1768)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1771](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1771)

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1784](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1784)

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1772](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1772)

***

### volunteerStatus

> **volunteerStatus**: `"pending"` \| `"accepted"` \| `"rejected"`

Defined in: [src/utils/interfaces.ts:1765](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1765)
