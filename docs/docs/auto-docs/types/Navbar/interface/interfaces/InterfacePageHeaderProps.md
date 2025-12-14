[Admin Docs](/)

***

# Interface: InterfacePageHeaderProps

Defined in: [src/types/Navbar/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L6)

## Properties

### actions?

> `optional` **actions**: `ReactNode`

Defined in: [src/types/Navbar/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L22)

***

### search?

> `optional` **search**: `object`

Defined in: [src/types/Navbar/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L8)

#### buttonTestId?

> `optional` **buttonTestId**: `string`

#### inputTestId?

> `optional` **inputTestId**: `string`

#### onSearch()

> **onSearch**: (`value`) => `void`

##### Parameters

###### value

`string`

##### Returns

`void`

#### placeholder

> **placeholder**: `string`

***

### showEventTypeFilter?

> `optional` **showEventTypeFilter**: `boolean`

Defined in: [src/types/Navbar/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L21)

***

### sorting?

> `optional` **sorting**: `object`[]

Defined in: [src/types/Navbar/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L14)

#### onChange()

> **onChange**: (`value`) => `void`

##### Parameters

###### value

`string` | `number`

##### Returns

`void`

#### options

> **options**: `object`[]

#### selected

> **selected**: `string` \| `number`

#### testIdPrefix

> **testIdPrefix**: `string`

#### title

> **title**: `string`

***

### title?

> `optional` **title**: `string`

Defined in: [src/types/Navbar/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Navbar/interface.ts#L7)
