[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:1764](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1764)

Defines the structure for event volunteer information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1772](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1772)

***

### creator

> **creator**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1785](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1785)

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1775](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1775)

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

Defined in: [src/utils/interfaces.ts:1787](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1787)

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

Defined in: [src/utils/interfaces.ts:1766](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1766)

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:1768](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1768)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1765](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1765)

***

### isInstanceException

> **isInstanceException**: `boolean`

Defined in: [src/utils/interfaces.ts:1771](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1771)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/utils/interfaces.ts:1769](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1769)

***

### isTemplate

> **isTemplate**: `boolean`

Defined in: [src/utils/interfaces.ts:1770](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1770)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1773](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1773)

***

### updater

> **updater**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1786](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1786)

***

### user

> **user**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1774](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1774)

***

### volunteerStatus

> **volunteerStatus**: `"accepted"` \| `"rejected"` \| `"pending"`

Defined in: [src/utils/interfaces.ts:1767](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1767)
