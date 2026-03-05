[Admin Docs](/)

***

# Interface: InterfaceEventCardProps

Defined in: [src/types/UserPortal/EventCard/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L6)

Interface for EventCard component props.

## Properties

### attendees

> **attendees**: `Partial`\<[`User`](../../../../Event/type/type-aliases/User.md)\>[]

Defined in: [src/types/UserPortal/EventCard/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L26)

List of users attending the event

***

### creator

> **creator**: `Partial`\<[`User`](../../../../Event/type/type-aliases/User.md)\>

Defined in: [src/types/UserPortal/EventCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L24)

Information about the user who created the event

***

### description

> **description**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L12)

Detailed description of the event

***

### endAt

> **endAt**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L18)

ISO string for the event end date/time

***

### endTime?

> `optional` **endTime**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L22)

formatted end time string (optional)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L8)

Unique identifier for the event

***

### isInviteOnly

> **isInviteOnly**: `boolean`

Defined in: [src/types/UserPortal/EventCard/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L31)

Determines if the event is restricted to invited participants only.
When true, only invited users can see and access the event.

***

### location

> **location**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L14)

Physical or virtual location of the event

***

### name

> **name**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L10)

Name or title of the event

***

### startAt

> **startAt**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L16)

ISO string for the event start date/time

***

### startTime?

> `optional` **startTime**: `string`

Defined in: [src/types/UserPortal/EventCard/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/EventCard/interface.ts#L20)

formatted start time string (optional)
