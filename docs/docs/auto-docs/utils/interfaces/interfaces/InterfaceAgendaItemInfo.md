[Admin Docs](/)

***

# Interface: InterfaceAgendaItemInfo

Defined in: [src/utils/interfaces.ts:2320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2320)

InterfaceAgendaItemInfo

## Description

Defines the structure for agenda item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2321)

The unique identifier of the agenda item.

***

### attachments

> **attachments**: `string`[]

Defined in: [src/utils/interfaces.ts:2325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2325)

An array of attachment URLs.

***

### categories

> **categories**: `object`[]

Defined in: [src/utils/interfaces.ts:2338](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2338)

An array of categories for the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2326)

The user who created this agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2323)

The description of the agenda item.

***

### duration

> **duration**: `string`

Defined in: [src/utils/interfaces.ts:2324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2324)

The duration of the agenda item.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:2342](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2342)

The organization associated with the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### relatedEvent

> **relatedEvent**: `object`

Defined in: [src/utils/interfaces.ts:2346](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2346)

The related event.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

***

### sequence

> **sequence**: `number`

Defined in: [src/utils/interfaces.ts:2337](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2337)

The sequence number of the agenda item.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2322)

The title of the agenda item.

***

### urls

> **urls**: `string`[]

Defined in: [src/utils/interfaces.ts:2331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2331)

An array of URLs related to the agenda item.

***

### users

> **users**: `object`[]

Defined in: [src/utils/interfaces.ts:2332](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2332)

An array of users associated with the agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`
