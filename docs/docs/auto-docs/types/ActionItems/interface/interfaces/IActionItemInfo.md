[Admin Docs](/)

***

# Interface: IActionItemInfo

Defined in: src/types/ActionItems/interface.ts:25

## Properties

### assignedAt

> **assignedAt**: `Date`

Defined in: src/types/ActionItems/interface.ts:36

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: src/types/ActionItems/interface.ts:29

***

### category

> **category**: [`IActionItemCategoryInfo`](IActionItemCategoryInfo.md)

Defined in: src/types/ActionItems/interface.ts:80

***

### categoryId

> **categoryId**: `string`

Defined in: src/types/ActionItems/interface.ts:30

***

### completionAt

> **completionAt**: `Date`

Defined in: src/types/ActionItems/interface.ts:37

***

### createdAt

> **createdAt**: `Date`

Defined in: src/types/ActionItems/interface.ts:38

***

### creator

> **creator**: `IActionUserInfo`

Defined in: src/types/ActionItems/interface.ts:77

***

### creatorId

> **creatorId**: `string`

Defined in: src/types/ActionItems/interface.ts:34

***

### event

> **event**: [`IEvent`](../../../Event/interface/interfaces/IEvent.md)

Defined in: src/types/ActionItems/interface.ts:78

***

### eventId

> **eventId**: `string`

Defined in: src/types/ActionItems/interface.ts:31

***

### hasExceptions?

> `optional` **hasExceptions**: `boolean`

Defined in: src/types/ActionItems/interface.ts:43

***

### id

> **id**: `string`

Defined in: src/types/ActionItems/interface.ts:26

***

### isCompleted

> **isCompleted**: `boolean`

Defined in: src/types/ActionItems/interface.ts:40

***

### isInstanceException?

> `optional` **isInstanceException**: `boolean`

Defined in: src/types/ActionItems/interface.ts:44

***

### isTemplate?

> `optional` **isTemplate**: `boolean`

Defined in: src/types/ActionItems/interface.ts:45

***

### organizationId

> **organizationId**: `string`

Defined in: src/types/ActionItems/interface.ts:33

***

### postCompletionNotes

> **postCompletionNotes**: `string`

Defined in: src/types/ActionItems/interface.ts:42

***

### preCompletionNotes

> **preCompletionNotes**: `string`

Defined in: src/types/ActionItems/interface.ts:41

***

### recurringEventInstance

> **recurringEventInstance**: [`IEvent`](../../../Event/interface/interfaces/IEvent.md)

Defined in: src/types/ActionItems/interface.ts:79

***

### recurringEventInstanceId

> **recurringEventInstanceId**: `string`

Defined in: src/types/ActionItems/interface.ts:32

***

### updatedAt

> **updatedAt**: `Date`

Defined in: src/types/ActionItems/interface.ts:39

***

### updaterId

> **updaterId**: `string`

Defined in: src/types/ActionItems/interface.ts:35

***

### volunteer

> **volunteer**: `object`

Defined in: src/types/ActionItems/interface.ts:48

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

Defined in: src/types/ActionItems/interface.ts:59

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

Defined in: src/types/ActionItems/interface.ts:28

***

### volunteerId

> **volunteerId**: `string`

Defined in: src/types/ActionItems/interface.ts:27
