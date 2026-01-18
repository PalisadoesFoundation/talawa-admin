[Admin Docs](/)

***

# Interface: InterfacePageHeaderProps

Defined in: [src/types/shared-components/Navbar/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L4)

Props for PageHeader (Navbar) component.

## Properties

### actions?

> `optional` **actions**: `ReactNode`

Defined in: [src/types/shared-components/Navbar/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L20)

***

### search?

> `optional` **search**: `object`

Defined in: [src/types/shared-components/Navbar/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L6)

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

Defined in: [src/types/shared-components/Navbar/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L19)

***

### sorting?

> `optional` **sorting**: `object`[]

Defined in: [src/types/shared-components/Navbar/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L12)

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

Defined in: [src/types/shared-components/Navbar/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L5)
