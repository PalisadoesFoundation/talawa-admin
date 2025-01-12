[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/organizationTagsUtils](../README.md) / InterfaceTagUsersToAssignToQuery

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/utils/organizationTagsUtils.ts:107](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L107)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:109](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L109)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:54](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L54)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:112](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L112)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:53](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L53)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:55](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L55)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
