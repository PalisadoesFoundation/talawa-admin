[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: src/types/Event/interface.ts:101

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: src/types/Event/interface.ts:109

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: src/types/Event/interface.ts:110

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: src/types/Event/interface.ts:102

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: src/types/Event/interface.ts:108

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

Defined in: src/types/Event/interface.ts:104

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: src/types/Event/interface.ts:103

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: src/types/Event/interface.ts:106

***

### userRole?

> `optional` **userRole**: `string`

Defined in: src/types/Event/interface.ts:105

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: src/types/Event/interface.ts:107
