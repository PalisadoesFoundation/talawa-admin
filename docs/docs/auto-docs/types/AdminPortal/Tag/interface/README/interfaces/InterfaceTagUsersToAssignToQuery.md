[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/AdminPortal/Tag/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L53)

## Extends

- [`InterfaceBaseQueryResult`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/types/AdminPortal/Tag/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L54)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/types/AdminPortal/Tag/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L39)

#### Inherited from

[`InterfaceBaseQueryResult`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`error`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L57)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/AdminPortal/Tag/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L38)

#### Inherited from

[`InterfaceBaseQueryResult`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`loading`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/AdminPortal/Tag/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/AdminPortal/Tag/interface.ts#L40)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`refetch`](types\AdminPortal\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#refetch)
