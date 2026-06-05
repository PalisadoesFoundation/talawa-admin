[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/AdminPortal/Tag/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L69)

## Extends

- [`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)

Defined in: [src/types/AdminPortal/Tag/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L70)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/types/AdminPortal/Tag/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L49)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`error`](InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L71)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](InterfaceBaseFetchMoreOptions.md)\<[`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/AdminPortal/Tag/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L48)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`loading`](InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L50)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`refetch`](InterfaceBaseQueryResult.md#refetch)
