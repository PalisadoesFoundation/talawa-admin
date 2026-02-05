[Admin Docs](/)

***

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/utils/organizationTagsUtils.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L121)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L122)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L125)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

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
