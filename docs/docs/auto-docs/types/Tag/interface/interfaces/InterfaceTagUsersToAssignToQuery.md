[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: src/types/Tag/interface.ts:55

## Extends

- [`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md)

## Properties

### data?

> `optional` **data**: `object`

Defined in: src/types/Tag/interface.ts:57

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: src/types/Tag/interface.ts:41

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`error`](InterfaceBaseQueryResult.md#error)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: src/types/Tag/interface.ts:60

#### Parameters

##### options

[`InterfaceBaseFetchMoreOptions`](InterfaceBaseFetchMoreOptions.md)\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: src/types/Tag/interface.ts:40

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`loading`](InterfaceBaseQueryResult.md#loading)

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: src/types/Tag/interface.ts:42

#### Returns

`void`

#### Inherited from

[`InterfaceBaseQueryResult`](InterfaceBaseQueryResult.md).[`refetch`](InterfaceBaseQueryResult.md#refetch)
