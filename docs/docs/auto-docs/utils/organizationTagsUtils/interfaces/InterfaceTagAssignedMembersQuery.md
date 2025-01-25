[Admin Docs](/) • **Docs**

***

# Interface: InterfaceTagAssignedMembersQuery

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

#### getAssignedUsers

> **getAssignedUsers**: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md)

#### Defined in

[src/utils/organizationTagsUtils.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L103)

***

### error?

> `optional` **error**: `ApolloError`

#### Inherited from

`InterfaceBaseQueryResult.error`

#### Defined in

[src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

#### Parameters

• **options**: `InterfaceBaseFetchMoreOptions`\<`object`\>

#### Returns

`void`

#### Defined in

[src/utils/organizationTagsUtils.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L106)

***

### loading

> **loading**: `boolean`

#### Inherited from

`InterfaceBaseQueryResult.loading`

#### Defined in

[src/utils/organizationTagsUtils.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L59)

***

### refetch()?

> `optional` **refetch**: () => `void`

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`

#### Defined in

[src/utils/organizationTagsUtils.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L61)
