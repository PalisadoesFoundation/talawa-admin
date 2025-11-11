[Admin Docs](/)

***

# Interface: InterfaceAgendaItemInfo

Defined in: [src/utils/interfaces.ts:2335](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2335)

InterfaceAgendaItemInfo

## Description

Defines the structure for agenda item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2336](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2336)

The unique identifier of the agenda item.

***

### attachments

> **attachments**: `string`[]

Defined in: [src/utils/interfaces.ts:2340](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2340)

An array of attachment URLs.

***

### categories

> **categories**: `object`[]

Defined in: [src/utils/interfaces.ts:2353](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2353)

An array of categories for the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2341)

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

Defined in: [src/utils/interfaces.ts:2338](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2338)

The description of the agenda item.

***

### duration

> **duration**: `string`

Defined in: [src/utils/interfaces.ts:2339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2339)

The duration of the agenda item.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:2357](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2357)

The organization associated with the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### relatedEvent

> **relatedEvent**: `object`

Defined in: [src/utils/interfaces.ts:2361](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2361)

The related event.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

***

### sequence

> **sequence**: `number`

Defined in: [src/utils/interfaces.ts:2352](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2352)

The sequence number of the agenda item.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2337](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2337)

The title of the agenda item.

***

### urls

> **urls**: `string`[]

Defined in: [src/utils/interfaces.ts:2346](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2346)

An array of URLs related to the agenda item.

***

### users

> **users**: `object`[]

Defined in: [src/utils/interfaces.ts:2347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2347)

An array of users associated with the agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`
