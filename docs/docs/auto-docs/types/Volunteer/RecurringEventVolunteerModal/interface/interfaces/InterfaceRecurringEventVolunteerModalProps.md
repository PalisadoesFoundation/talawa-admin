[Admin Docs](/)

***

# Interface: InterfaceRecurringEventVolunteerModalProps

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L4)

Props for the RecurringEventVolunteerModal component

## Properties

### eventDate

> **eventDate**: `string`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L12)

The date of the current event instance

***

### eventName

> **eventName**: `string`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L10)

The name of the recurring event

***

### groupName?

> `optional` **groupName**: `string`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L20)

Optional name of the volunteer group being joined

***

### isForGroup?

> `optional` **isForGroup**: `boolean`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L18)

Optional flag indicating if this is for joining a volunteer group

***

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L8)

Callback function to hide/close the modal

#### Returns

`void`

***

### onSelectInstance()

> **onSelectInstance**: () => `void`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L16)

Callback when user chooses to volunteer for this instance only

#### Returns

`void`

***

### onSelectSeries()

> **onSelectSeries**: () => `void`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L14)

Callback when user chooses to volunteer for entire series

#### Returns

`void`

***

### show

> **show**: `boolean`

Defined in: [src/types/Volunteer/RecurringEventVolunteerModal/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/RecurringEventVolunteerModal/interface.ts#L6)

Controls the visibility of the modal
