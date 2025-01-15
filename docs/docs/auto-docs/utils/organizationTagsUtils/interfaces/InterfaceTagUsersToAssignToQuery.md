[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/organizationTagsUtils](../README.md) / InterfaceTagUsersToAssignToQuery

# Interface: InterfaceTagUsersToAssignToQuery

Defined in: [src/utils/organizationTagsUtils.ts:113](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L113)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:115](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L115)

#### getUsersToAssignTo

> **getUsersToAssignTo**: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:118](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L118)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getUsersToAssignTo`: [`InterfaceQueryUserTagsMembersToAssignTo`](../../interfaces/interfaces/InterfaceQueryUserTagsMembersToAssignTo.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:59](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L59)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/gautam-divyanshu/talawa-admin/blob/619e831a8e34de2906df3277eb6df8b5309fb2fc/src/utils/organizationTagsUtils.ts#L61)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
