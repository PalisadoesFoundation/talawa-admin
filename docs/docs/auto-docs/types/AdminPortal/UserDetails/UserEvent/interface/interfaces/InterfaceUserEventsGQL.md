[Admin Docs](/)

***

# Interface: InterfaceUserEventsGQL

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L49)

Represents detailed event data returned by GraphQL,
including metadata, attendees, creator, and organization.

## Properties

### allDay

> **allDay**: `boolean`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L55)

***

### attendees

> **attendees**: [`InterfaceGQLUser`](InterfaceGQLUser.md)[]

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L63)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L60)

***

### creator

> **creator**: [`InterfaceGQLUser`](InterfaceGQLUser.md) & `object`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L65)

#### Type Declaration

##### eventsAttended

> **eventsAttended**: [`InterfaceGQLEventLite`](InterfaceGQLEventLite.md)[]

***

### description

> **description**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L52)

***

### endAt

> **endAt**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L54)

***

### id

> **id**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L50)

***

### isPublic

> **isPublic**: `boolean`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L57)

***

### isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L58)

***

### isRegisterable

> **isRegisterable**: `boolean`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L59)

***

### location

> **location**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L56)

***

### name

> **name**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L51)

***

### organization

> **organization**: [`InterfaceGQLOrganization`](InterfaceGQLOrganization.md)

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L69)

***

### startAt

> **startAt**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L53)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/AdminPortal/UserDetails/UserEvent/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/UserDetails/UserEvent/interface.ts#L61)
