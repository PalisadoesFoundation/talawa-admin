[Admin Docs](/)

***

# Interface: InterfaceTagAssignedMembersQuery

Defined in: src/utils/organizationTagsUtils.ts:101

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: src/utils/organizationTagsUtils.ts:103

#### getAssignedUsers

> **getAssignedUsers**: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: src/utils/organizationTagsUtils.ts:60

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: src/utils/organizationTagsUtils.ts:106

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getAssignedUsers`: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md); \}\>

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
