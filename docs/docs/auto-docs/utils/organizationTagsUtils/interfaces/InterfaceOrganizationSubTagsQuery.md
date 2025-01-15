[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../modules.md) / [utils/organizationTagsUtils](../README.md) / InterfaceOrganizationSubTagsQuery

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:83](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L83)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:85](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L85)

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `any`

Defined in: [src/utils/organizationTagsUtils.ts:54](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L54)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:88](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L88)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:53](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L53)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:55](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/utils/organizationTagsUtils.ts#L55)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
