[Admin Docs](/)

***

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L122)

## Properties

### currentDateOfMonth?

> `optional` **currentDateOfMonth**: `number`

Defined in: [src/types/Event/interface.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L136)

***

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L134)

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L135)

***

### dayEventsResetKey?

> `optional` **dayEventsResetKey**: `number`

Defined in: [src/types/Event/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L129)

***

### dayHasMoreMap?

> `optional` **dayHasMoreMap**: `Record`\<`string`, `boolean`\>

Defined in: [src/types/Event/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L130)

***

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L123)

***

### isMonthChangeDisabled?

> `optional` **isMonthChangeDisabled**: `boolean`

Defined in: [src/types/Event/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L131)

***

### onCurrentDateChange()?

> `optional` **onCurrentDateChange**: (`dayOfMonth`) => `void`

Defined in: [src/types/Event/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L133)

#### Parameters

##### dayOfMonth

`number`

#### Returns

`void`

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L132)

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

Defined in: [src/types/Event/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L125)

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L124)

#### Returns

`void`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L127)

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L126)

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L128)
