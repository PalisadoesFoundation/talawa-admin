[Admin Docs](/)

---

# Interface: InterfacePageHeaderProps

Defined in: [src/types/shared-components/Navbar/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L5)

Props for PageHeader (Navbar) component.

## Properties

### actions?

> `optional` **actions**: `ReactNode`

Defined in: [src/types/shared-components/Navbar/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L21)

---

### search?

> `optional` **search**: `object`

Defined in: [src/types/shared-components/Navbar/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L7)

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

---

### showEventTypeFilter?

> `optional` **showEventTypeFilter**: `boolean`

Defined in: [src/types/shared-components/Navbar/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L20)

---

### sorting?

> `optional` **sorting**: `object`[]

Defined in: [src/types/shared-components/Navbar/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L13)

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

---

### title?

> `optional` **title**: `string`

Defined in: [src/types/shared-components/Navbar/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/Navbar/interface.ts#L6)
