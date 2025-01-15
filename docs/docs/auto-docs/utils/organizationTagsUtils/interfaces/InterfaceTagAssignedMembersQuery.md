[Admin Docs](/)

***

# Interface: InterfaceTagAssignedMembersQuery

Defined in: [src/utils/organizationTagsUtils.ts:101](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L101)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:103](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L103)

#### getAssignedUsers

> **getAssignedUsers**: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:106](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L106)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getAssignedUsers`: [`InterfaceQueryUserTagsAssignedMembers`](../../interfaces/interfaces/InterfaceQueryUserTagsAssignedMembers.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:59](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L59)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/utils/organizationTagsUtils.ts#L61)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
