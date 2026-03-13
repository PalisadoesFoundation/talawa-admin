[Admin Docs](/)

***

# Interface: InterfaceWeeklyEventCalenderProps

Defined in: [src/components/EventCalender/Weekly/WeeklyEventCalender.tsx:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Weekly/WeeklyEventCalender.tsx#L47)

## Extends

- [`InterfaceCalendarProps`](../../../../../types/Event/interface/type-aliases/InterfaceCalendarProps.md)

## Properties

### currentDate

> **currentDate**: `Date`

Defined in: [src/components/EventCalender/Weekly/WeeklyEventCalender.tsx:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Weekly/WeeklyEventCalender.tsx#L48)

***

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L130)

#### Inherited from

`InterfaceCalendarProps.currentMonth`

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L131)

#### Inherited from

`InterfaceCalendarProps.currentYear`

***

### eventData

> **eventData**: [`IEvent`](../../../../../types/Event/interface/interfaces/IEvent.md)[]

Defined in: [src/types/Event/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L123)

#### Inherited from

`InterfaceCalendarProps.eventData`

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L129)

#### Parameters

##### month

`number`

##### year

`number`

#### Returns

`void`

#### Inherited from

`InterfaceCalendarProps.onMonthChange`

***

### orgData?

> `optional` **orgData**: [`IOrgList`](../../../../../types/Event/interface/interfaces/IOrgList.md) \| [`InterfaceOrgForEventFilter`](../../../../../types/Event/interface/interfaces/InterfaceOrgForEventFilter.md)

Defined in: [src/types/Event/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L125)

#### Inherited from

`InterfaceCalendarProps.orgData`

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L124)

#### Returns

`void`

#### Inherited from

`InterfaceCalendarProps.refetchEvents`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L127)

#### Inherited from

`InterfaceCalendarProps.userId`

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L126)

#### Inherited from

`InterfaceCalendarProps.userRole`

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L128)

#### Inherited from

`InterfaceCalendarProps.viewType`
