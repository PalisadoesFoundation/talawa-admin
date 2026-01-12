[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/AdminPortal/Tag/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L55)

## Extends

- [`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/types/AdminPortal/Tag/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L57)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/types/AdminPortal/Tag/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L41)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`error`](InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L60)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/AdminPortal/Tag/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L40)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`loading`](InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L42)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`refetch`](InterfaceBaseQueryResult.md#refetch)
