[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/AdminPortal/Tag/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L54)

## Extends

- [`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/types/AdminPortal/Tag/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L55)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/AdminPortal/Tag/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L40)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`error`](InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L58)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/AdminPortal/Tag/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L39)

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`loading`](InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L41)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`refetch`](InterfaceBaseQueryResult.md#refetch)
