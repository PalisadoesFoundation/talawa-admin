[Admin Docs](/)

---

# Interface: ICalendarProps

Defined in: [src/types/Event/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L105)

## Properties

### currentMonth?

> `optional` **currentMonth**: `number`

Defined in: [src/types/Event/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L113)

---

### currentYear?

> `optional` **currentYear**: `number`

Defined in: [src/types/Event/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L114)

---

### eventData

> **eventData**: [`IEvent`](IEvent.md)[]

Defined in: [src/types/Event/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L106)

---

### onMonthChange()?

> `optional` **onMonthChange**: (`month`, `year`) => `void`

Defined in: [src/types/Event/interface.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L112)

#### Parameters

##### month

`number`

##### year

`number`

#### Returns

`void`

---

### orgData?

> `optional` **orgData**: [`IOrgList`](IOrgList.md)

Defined in: [src/types/Event/interface.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L108)

---

### refetchEvents()?

> `optional` **refetchEvents**: () => `void`

Defined in: [src/types/Event/interface.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L107)

#### Returns

`void`

---

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/Event/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L110)

---

### userRole?

> `optional` **userRole**: `string`

Defined in: [src/types/Event/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L109)

---

### viewType?

> `optional` **viewType**: [`ViewType`](../../../../screens/AdminPortal/OrganizationEvents/OrganizationEvents/enumerations/ViewType.md)

Defined in: [src/types/Event/interface.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Event/interface.ts#L111)
