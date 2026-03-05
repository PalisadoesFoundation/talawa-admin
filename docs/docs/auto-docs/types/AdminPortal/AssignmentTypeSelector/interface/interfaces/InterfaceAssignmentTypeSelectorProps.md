[Admin Docs](/)

***

# Interface: InterfaceAssignmentTypeSelectorProps

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L9)

Props interface for the AssignmentTypeSelector component.

## Properties

### assignmentType

> **assignmentType**: [`AssignmentType`](../type-aliases/AssignmentType.md)

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L11)

Current assignment type selection

***

### isVolunteerDisabled

> **isVolunteerDisabled**: `boolean`

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L15)

Whether the volunteer chip is disabled

***

### isVolunteerGroupDisabled

> **isVolunteerGroupDisabled**: `boolean`

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L17)

Whether the volunteer group chip is disabled

***

### onClearVolunteer()

> **onClearVolunteer**: () => `void`

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L19)

Callback to clear volunteer selection when switching to volunteer group

#### Returns

`void`

***

### onClearVolunteerGroup()

> **onClearVolunteerGroup**: () => `void`

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L21)

Callback to clear volunteer group selection when switching to volunteer

#### Returns

`void`

***

### onTypeChange()

> **onTypeChange**: (`type`) => `void`

Defined in: [src/types/AdminPortal/AssignmentTypeSelector/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/AssignmentTypeSelector/interface.ts#L13)

Callback fired when assignment type changes

#### Parameters

##### type

[`AssignmentType`](../type-aliases/AssignmentType.md)

#### Returns

`void`
