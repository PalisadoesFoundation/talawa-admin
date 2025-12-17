[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: src/utils/organizationTagsUtils.ts:113

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: src/utils/organizationTagsUtils.ts:115

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: src/utils/organizationTagsUtils.ts:60

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: src/utils/organizationTagsUtils.ts:118

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: src/utils/organizationTagsUtils.ts:59

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: src/utils/organizationTagsUtils.ts:61

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
