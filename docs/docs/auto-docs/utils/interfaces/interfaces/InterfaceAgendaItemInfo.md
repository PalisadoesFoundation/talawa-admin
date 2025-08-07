[Admin Docs](/)

***

# Interface: InterfaceAgendaItemInfo

Defined in: [src/utils/interfaces.ts:2261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2261)

InterfaceAgendaItemInfo

## Description

Defines the structure for agenda item information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2262)

The unique identifier of the agenda item.

***

### attachments

> **attachments**: `string`[]

Defined in: [src/utils/interfaces.ts:2266](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2266)

An array of attachment URLs.

***

### categories

> **categories**: `object`[]

Defined in: [src/utils/interfaces.ts:2279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2279)

An array of categories for the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### createdBy

> **createdBy**: `object`

Defined in: [src/utils/interfaces.ts:2267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2267)

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

Defined in: [src/utils/interfaces.ts:2264](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2264)

The description of the agenda item.

***

### duration

> **duration**: `string`

Defined in: [src/utils/interfaces.ts:2265](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2265)

The duration of the agenda item.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:2283](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2283)

The organization associated with the agenda item.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### relatedEvent

> **relatedEvent**: `object`

Defined in: [src/utils/interfaces.ts:2287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2287)

The related event.

#### \_id

> **\_id**: `string`

#### title

> **title**: `string`

***

### sequence

> **sequence**: `number`

Defined in: [src/utils/interfaces.ts:2278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2278)

The sequence number of the agenda item.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2263)

The title of the agenda item.

***

### urls

> **urls**: `string`[]

Defined in: [src/utils/interfaces.ts:2272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2272)

An array of URLs related to the agenda item.

***

### users

> **users**: `object`[]

Defined in: [src/utils/interfaces.ts:2273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2273)

An array of users associated with the agenda item.

#### \_id

> **\_id**: `string`

#### firstName

> **firstName**: `string`

#### lastName

> **lastName**: `string`
