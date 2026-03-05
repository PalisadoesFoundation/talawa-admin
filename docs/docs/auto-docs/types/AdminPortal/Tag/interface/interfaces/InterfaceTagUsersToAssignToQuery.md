[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/AdminPortal/Tag/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L53)

## Extends

- [`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/types/AdminPortal/Tag/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L54)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/types/AdminPortal/Tag/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L39)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`error`](InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L57)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/AdminPortal/Tag/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L38)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`loading`](InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L40)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`refetch`](InterfaceBaseQueryResult.md#refetch)
