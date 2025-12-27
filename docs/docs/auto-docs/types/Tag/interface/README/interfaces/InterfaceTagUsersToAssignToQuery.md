[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/types/Tag/interface.ts:55](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L55)

## Extends

- [`InterfaceBaseQueryResult`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/types/Tag/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L57)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](types\Tag\interface\README\interfaces\InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/types/Tag/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L41)

#### Inherited from

[`InterfaceBaseQueryResult`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`error`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/types/Tag/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L60)

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](types\Tag\interface\README\interfaces\InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](types\Tag\interface\README\interfaces\InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/types/Tag/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L40)

#### Inherited from

[`InterfaceBaseQueryResult`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`loading`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/types/Tag/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Tag/interface.ts#L42)

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md).[`refetch`](types\Tag\interface\README\interfaces\InterfaceBaseQueryResult.md#refetch)
