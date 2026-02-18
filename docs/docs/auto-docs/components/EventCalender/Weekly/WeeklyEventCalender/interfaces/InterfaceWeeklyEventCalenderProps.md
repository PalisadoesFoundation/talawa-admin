[Admin Docs](/)

***

# Interface: InterfaceWeeklyEventCalenderProps

Defined in: [src/components/EventCalender/Weekly/WeeklyEventCalender.tsx:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Weekly/WeeklyEventCalender.tsx#L51)

## Extends

- [`InterfaceCalendarProps`](../../../../../types/Event/interface/type-aliases/InterfaceCalendarProps.md)

## Properties

### currentDate

> **currentDate**: `Date`

Defined in: [src/components/EventCalender/Weekly/WeeklyEventCalender.tsx:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventCalender/Weekly/WeeklyEventCalender.tsx#L52)

***

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L119)

#### Inherited from

`InterfaceCalendarProps.currentMonth`

***

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L120)

#### Inherited from

`InterfaceCalendarProps.currentYear`

***

### eventData

> **eventData**: [`IEvent`](../../../../../types/Event/interface/interfaces/IEvent.md)[]

Defined in: [src/types/Event/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L112)

#### Inherited from

`InterfaceCalendarProps.eventData`

***

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L118)

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

> `optional` **orgData**: [`IOrgList`](../../../../../types/Event/interface/interfaces/IOrgList.md)

Defined in: [src/types/Event/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L114)

#### Inherited from

`InterfaceCalendarProps.orgData`

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L113)

#### Returns

`void`

#### Inherited from

`InterfaceCalendarProps.refetchEvents`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L116)

#### Inherited from

`InterfaceCalendarProps.userId`

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L115)

#### Inherited from

`InterfaceCalendarProps.userRole`

***

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L117)

#### Inherited from

`InterfaceCalendarProps.viewType`
