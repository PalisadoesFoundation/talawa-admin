[Admin Docs](/)

***

# Interface: InterfacePeopleTabNavbarProps

Defined in: [src/types/PeopleTab/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTab/interface.ts#L34)

## Properties

### actions?

> `optional` **actions**: `ReactNode`

Defined in: [src/types/PeopleTab/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTab/interface.ts#L51)

***

### search?

> `optional` **search**: `object`

Defined in: [src/types/PeopleTab/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTab/interface.ts#L36)

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

### sorting?

> `optional` **sorting**: `object`[]

Defined in: [src/types/PeopleTab/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTab/interface.ts#L42)

#### icon?

> `optional` **icon**: `string`

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

Defined in: [src/types/PeopleTab/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/PeopleTab/interface.ts#L35)
