[Admin Docs](/)

***

# Interface: InterfaceAgendaItemInfo

Defined in: [src/utils/interfaces.ts:2363](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2363)

InterfaceAgendaItemInfo

## Description

Defines the structure for agenda item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2364](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2364)

The unique identifier of the agenda item.

***

### attachments

> **attachments**: `string`[]

Defined in: [src/utils/interfaces.ts:2368](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2368)

An array of attachment URLs.

***

### categories

> **categories**: `object`[]

Defined in: [src/utils/interfaces.ts:2381](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2381)

An array of categories for the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2369](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2369)

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

Defined in: [src/utils/interfaces.ts:2366](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2366)

The description of the agenda item.

***

### duration

> **duration**: `string`

Defined in: [src/utils/interfaces.ts:2367](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2367)

The duration of the agenda item.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:2385](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2385)

The organization associated with the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### relatedEvent

> **relatedEvent**: `object`

Defined in: [src/utils/interfaces.ts:2389](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2389)

The related event.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

***

### sequence

> **sequence**: `number`

Defined in: [src/utils/interfaces.ts:2380](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2380)

The sequence number of the agenda item.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2365](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2365)

The title of the agenda item.

***

### urls

> **urls**: `string`[]

Defined in: [src/utils/interfaces.ts:2374](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2374)

An array of URLs related to the agenda item.

***

### users

> **users**: `object`[]

Defined in: [src/utils/interfaces.ts:2375](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2375)

An array of users associated with the agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`
