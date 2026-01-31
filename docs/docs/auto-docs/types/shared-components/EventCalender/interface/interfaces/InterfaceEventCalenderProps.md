[Admin Docs](/)

***

# Interface: InterfaceEventCalenderProps

Defined in: [src/types/shared-components/EventCalender/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventCalender/interface.ts#L26)

Props for EventCalendar component.

## Extends

- [`InterfaceCalendarProps`](../../../../Event/interface/type-aliases/InterfaceCalendarProps.md)

## Properties

### currentMonth

> **currentMonth**: `number`

Defined in: [src/types/shared-components/EventCalender/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventCalender/interface.ts#L28)

#### Overrides

`InterfaceCalendarProps.currentMonth`

***

### currentYear

> **currentYear**: `number`

Defined in: [src/types/shared-components/EventCalender/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventCalender/interface.ts#L29)

#### Overrides

`InterfaceCalendarProps.currentYear`

***

### eventData

> **eventData**: [`IEvent`](../../../../Event/interface/interfaces/IEvent.md)[]

Defined in: [src/types/Event/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L111)

#### Inherited from

`InterfaceCalendarProps.eventData`

***

### onMonthChange()

> **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/shared-components/EventCalender/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventCalender/interface.ts#L27)

#### Parameters

##### month

`number`

##### year

`number`

#### Returns

`void`

#### Overrides

`InterfaceCalendarProps.onMonthChange`

***

### orgData?

> `optional` **orgData**: [`IOrgList`](../../../../Event/interface/interfaces/IOrgList.md)

Defined in: [src/types/Event/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L113)

#### Inherited from

`InterfaceCalendarProps.orgData`

***

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L112)

#### Returns

`void`

#### Inherited from

`InterfaceCalendarProps.refetchEvents`

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L115)

#### Inherited from

`InterfaceCalendarProps.userId`

***

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L114)

#### Inherited from

`InterfaceCalendarProps.userRole`

***

### viewType?

> `optional` **viewType**: [`ViewType`](../enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L116)

#### Inherited from

`InterfaceCalendarProps.viewType`
