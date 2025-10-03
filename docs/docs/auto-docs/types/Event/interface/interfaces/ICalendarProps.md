[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L109)

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L117)

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L118)

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L110)

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L116)

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

Defined in: [src/types/Event/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L112)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L111)

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L114)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L113)

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L115)
