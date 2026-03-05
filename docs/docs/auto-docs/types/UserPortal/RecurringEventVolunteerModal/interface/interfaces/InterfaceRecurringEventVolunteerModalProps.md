[Admin Docs](/)

***

# Interface: InterfaceRecurringEventVolunteerModalProps

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L4)

Interface for RecurringEventVolunteerModal component props

## Properties

### eventDate

> **eventDate**: `string`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L23)

Date of the event instance (ISO string format)

***

### eventName

> **eventName**: `string`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L18)

Name of the event

***

### groupName?

> `optional` **groupName**: `string`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L43)

Name of the volunteer group (required when isForGroup is true)

***

### isForGroup?

> `optional` **isForGroup**: `boolean`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L38)

Whether this is for joining a volunteer group (vs individual volunteering)

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L13)

Callback function to hide/close the modal

#### Returns

`void`

***

### onSelectInstance()

> **onSelectInstance**: () => `void`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L33)

Callback when user selects to volunteer for a single instance

#### Returns

`void`

***

### onSelectSeries()

> **onSelectSeries**: () => `void`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L28)

Callback when user selects to volunteer for the entire series

#### Returns

`void`

***

### show

> **show**: `boolean`

Defined in: [src/types/UserPortal/RecurringEventVolunteerModal/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/RecurringEventVolunteerModal/interface.ts#L8)

Whether the modal is visible
