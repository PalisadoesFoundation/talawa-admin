[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/organizationTagsUtils](../README.md) / InterfaceTagAssignedMembersQuery

# Interface: InterfaceTagAssignedMembersQuery

Defined in: [src/utils/organizationTagsUtils.ts:95](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L95)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:97](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L97)

#### getAssignedUsers

> **getAssignedUsers**: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:54](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L54)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:100](https://github.com/bint-Eve/talawa-admin/blob/3ea1bc8148fd1f2efa92a17958ea5a5df0d9cc86/src/utils/organizationTagsUtils.ts#L100)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getAssignedUsers`: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md); \}\>

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
