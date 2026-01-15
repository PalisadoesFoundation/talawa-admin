[Admin Docs](/)

***

# Interface: InterfaceVolunteerSelectionFieldsProps

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L8)

Props for VolunteerSelectionFields component.

## Properties

### assignmentType

> **assignmentType**: [`AssignmentType`](../../../AssignmentTypeSelector/interface/type-aliases/AssignmentType.md)

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L10)

Current assignment type determining which field to display

***

### onVolunteerChange()

> **onVolunteerChange**: (`volunteer`) => `void`

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L20)

Callback fired when user selects a different volunteer

#### Parameters

##### volunteer

[`InterfaceEventVolunteerInfo`](../../../../Volunteer/interface/interfaces/InterfaceEventVolunteerInfo.md)

#### Returns

`void`

***

### onVolunteerGroupChange()

> **onVolunteerGroupChange**: (`group`) => `void`

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L22)

Callback fired when user selects a different volunteer group

#### Parameters

##### group

[`IEventVolunteerGroup`](../../../../shared-components/ActionItems/interface/interfaces/IEventVolunteerGroup.md)

#### Returns

`void`

***

### selectedVolunteer

> **selectedVolunteer**: [`InterfaceEventVolunteerInfo`](../../../../Volunteer/interface/interfaces/InterfaceEventVolunteerInfo.md)

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L16)

Currently selected volunteer (null if none selected)

***

### selectedVolunteerGroup

> **selectedVolunteerGroup**: [`IEventVolunteerGroup`](../../../../shared-components/ActionItems/interface/interfaces/IEventVolunteerGroup.md)

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L18)

Currently selected volunteer group (null if none selected)

***

### volunteerGroups

> **volunteerGroups**: [`IEventVolunteerGroup`](../../../../shared-components/ActionItems/interface/interfaces/IEventVolunteerGroup.md)[]

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L14)

List of available volunteer groups for selection

***

### volunteers

> **volunteers**: [`InterfaceEventVolunteerInfo`](../../../../Volunteer/interface/interfaces/InterfaceEventVolunteerInfo.md)[]

Defined in: [src/types/AdminPortal/VolunteerSelectionFields/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/VolunteerSelectionFields/interface.ts#L12)

List of available volunteers for selection
