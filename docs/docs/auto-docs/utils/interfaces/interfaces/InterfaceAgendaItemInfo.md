[Admin Docs](/)

---

# Interface: InterfaceAgendaItemInfo

Defined in: [src/utils/interfaces.ts:2302](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2302)

InterfaceAgendaItemInfo

## Description

Defines the structure for agenda item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2303)

The unique identifier of the agenda item.

---

### attachments

> **attachments**: `string`[]

Defined in: [src/utils/interfaces.ts:2307](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2307)

An array of attachment URLs.

---

### categories

> **categories**: `object`[]

Defined in: [src/utils/interfaces.ts:2320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2320)

An array of categories for the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

---

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2308](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2308)

The user who created this agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

---

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2305)

The description of the agenda item.

---

### duration

> **duration**: `string`

Defined in: [src/utils/interfaces.ts:2306](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2306)

The duration of the agenda item.

---

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:2324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2324)

The organization associated with the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

---

### relatedEvent

> **relatedEvent**: `object`

Defined in: [src/utils/interfaces.ts:2328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2328)

The related event.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

---

### sequence

> **sequence**: `number`

Defined in: [src/utils/interfaces.ts:2319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2319)

The sequence number of the agenda item.

---

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2304](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2304)

The title of the agenda item.

---

### urls

> **urls**: `string`[]

Defined in: [src/utils/interfaces.ts:2313](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2313)

An array of URLs related to the agenda item.

---

### users

> **users**: `object`[]

Defined in: [src/utils/interfaces.ts:2314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2314)

An array of users associated with the agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`
