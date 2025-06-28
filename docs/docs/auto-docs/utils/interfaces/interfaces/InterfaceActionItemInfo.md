[Admin Docs](/)

***

# Interface: InterfaceActionItemInfo

Defined in: [src/utils/interfaces.ts:487](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L487)

InterfaceActionItemInfo

## Description

Defines the structure for action item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:488](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L488)

The unique identifier of the action item.

***

### actionItemCategory

> **actionItemCategory**: `object`

Defined in: [src/utils/interfaces.ts:494](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L494)

The category of the action item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### allottedHours

> **allottedHours**: `number`

Defined in: [src/utils/interfaces.ts:509](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L509)

The allotted hours for the action item, or null.

***

### assignee

> **assignee**: [`InterfaceEventVolunteerInfo`](InterfaceEventVolunteerInfo.md)

Defined in: [src/utils/interfaces.ts:490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L490)

The event volunteer assignee, or null.

***

### assigneeGroup

> **assigneeGroup**: [`InterfaceVolunteerGroupInfo`](InterfaceVolunteerGroupInfo.md)

Defined in: [src/utils/interfaces.ts:491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L491)

The volunteer group assignee, or null.

***

### assigneeType

> **assigneeType**: `"User"` \| `"EventVolunteerGroup"` \| `"EventVolunteer"`

Defined in: [src/utils/interfaces.ts:489](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L489)

The type of assignee for the action item.

***

### assigneeUser

> **assigneeUser**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:492](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L492)

The user assignee, or null.

***

### assigner

> **assigner**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:493](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L493)

The assigner of the action item.

***

### assignmentDate

> **assignmentDate**: `Date`

Defined in: [src/utils/interfaces.ts:500](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L500)

The date the action item was assigned.

***

### completionDate

> **completionDate**: `Date`

Defined in: [src/utils/interfaces.ts:502](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L502)

The completion date of the action item, or null if not completed.

***

### creator

> **creator**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:508](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L508)

The creator of the action item.

***

### dueDate

> **dueDate**: `Date`

Defined in: [src/utils/interfaces.ts:501](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L501)

The due date of the action item.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:504](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L504)

The related event, or null.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

***

### isCompleted

> **isCompleted**: `boolean`

Defined in: [src/utils/interfaces.ts:503](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L503)

Indicates if the action item is completed.

***

### postCompletionNotes

> **postCompletionNotes**: `string`

Defined in: [src/utils/interfaces.ts:499](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L499)

Notes after completion of the action item, or null.

***

### preCompletionNotes

> **preCompletionNotes**: `string`

Defined in: [src/utils/interfaces.ts:498](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L498)

Notes before completion of the action item.
