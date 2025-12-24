[Admin Docs](/)

***

# Interface: IActionItemInfo

Defined in: [src/types/ActionItems/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L31)

## Properties

### assignedAt

> **assignedAt**: `Date`

Defined in: [src/types/ActionItems/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L42)

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/types/ActionItems/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L35)

***

### category

> **category**: [`IActionItemCategoryInfo`](IActionItemCategoryInfo.md)

Defined in: [src/types/ActionItems/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L86)

***

### categoryId

> **categoryId**: `string`

Defined in: [src/types/ActionItems/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L36)

***

### completionAt

> **completionAt**: `Date`

Defined in: [src/types/ActionItems/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L43)

***

### createdAt

> **createdAt**: `Date`

Defined in: [src/types/ActionItems/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L44)

***

### creator

> **creator**: `IActionUserInfo`

Defined in: [src/types/ActionItems/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L83)

***

### creatorId

> **creatorId**: `string`

Defined in: [src/types/ActionItems/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L40)

***

### event

> **event**: [`IEvent`](../../../Event/interface/interfaces/IEvent.md)

Defined in: [src/types/ActionItems/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L84)

***

### eventId

> **eventId**: `string`

Defined in: [src/types/ActionItems/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L37)

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: [src/types/ActionItems/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L49)

***

### id

> **id**: `string`

Defined in: [src/types/ActionItems/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L32)

***

### isCompleted

> **isCompleted**: `boolean`

Defined in: [src/types/ActionItems/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L46)

***

### isInstanceException?

> `optional` **isInstanceException**: `boolean`

Defined in: [src/types/ActionItems/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L50)

***

### isTemplate?

> `optional` **isTemplate**: `boolean`

Defined in: [src/types/ActionItems/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L51)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/ActionItems/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L39)

***

### postCompletionNotes

> **postCompletionNotes**: `string`

Defined in: [src/types/ActionItems/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L48)

***

### preCompletionNotes

> **preCompletionNotes**: `string`

Defined in: [src/types/ActionItems/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L47)

***

### recurringEventInstance

> **recurringEventInstance**: [`IEvent`](../../../Event/interface/interfaces/IEvent.md)

Defined in: [src/types/ActionItems/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L85)

***

### recurringEventInstanceId

> **recurringEventInstanceId**: `string`

Defined in: [src/types/ActionItems/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L38)

***

### updatedAt

> **updatedAt**: `Date`

Defined in: [src/types/ActionItems/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L45)

***

### updaterId

> **updaterId**: `string`

Defined in: [src/types/ActionItems/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L41)

***

### volunteer

> **volunteer**: `object`

Defined in: [src/types/ActionItems/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L54)

#### hasAccepted

> **hasAccepted**: `boolean`

#### hoursVolunteered

> **hoursVolunteered**: `number`

#### id

> **id**: `string`

#### isPublic

> **isPublic**: `boolean`

#### user

> **user**: `object`

##### user.avatarURL?

> `optional` **avatarURL**: `string`

##### user.id

> **id**: `string`

##### user.name

> **name**: `string`

***

### volunteerGroup

> **volunteerGroup**: `object`

Defined in: [src/types/ActionItems/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L65)

#### description

> **description**: `string`

#### id

> **id**: `string`

#### leader

> **leader**: `object`

##### leader.avatarURL?

> `optional` **avatarURL**: `string`

##### leader.id

> **id**: `string`

##### leader.name

> **name**: `string`

#### name

> **name**: `string`

#### volunteers?

> `optional` **volunteers**: `object`[]

#### volunteersRequired

> **volunteersRequired**: `number`

***

### volunteerGroupId

> **volunteerGroupId**: `string`

Defined in: [src/types/ActionItems/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L34)

***

### volunteerId

> **volunteerId**: `string`

Defined in: [src/types/ActionItems/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ActionItems/interface.ts#L33)
