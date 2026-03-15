[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L120)

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L128)

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L129)

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L121)

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L127)

#### Parameters

##### month

`number`

##### year

`number`

#### Returns

`void`

***

### orgData?

> `optional` **orgData**: [`IOrgList`](IOrgList.md) \| [`InterfaceOrgForEventFilter`](InterfaceOrgForEventFilter.md)

Defined in: [src/types/Event/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L123)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L122)

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L125)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L124)

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L126)
