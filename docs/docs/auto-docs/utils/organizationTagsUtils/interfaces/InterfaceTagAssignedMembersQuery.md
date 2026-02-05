[Admin Docs](/)

***

# Interface: InterfaceTagAssignedMembersQuery

Defined in: [src/utils/organizationTagsUtils.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L110)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L111)

#### getAssignedUsers

> **getAssignedUsers**: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L114)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getAssignedUsers`: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L59)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L61)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
