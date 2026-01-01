[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L102)

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L110)

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L111)

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L103)

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L109)

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

Defined in: [src/types/Event/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L105)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L104)

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L107)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L106)

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L108)
