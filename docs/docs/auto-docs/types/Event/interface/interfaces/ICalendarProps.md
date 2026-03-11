[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L113)

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L121)

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L122)

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L114)

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L120)

#### Parameters

##### month

`number`

##### year

`number`

#### Returns

`void`

***

### orgData?

> `optional` **orgData**: [`IOrgList`](IOrgList.md)

Defined in: [src/types/Event/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L116)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L115)

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L118)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L117)

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L119)
