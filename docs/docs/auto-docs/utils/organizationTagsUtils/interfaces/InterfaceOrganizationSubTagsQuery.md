[**talawa-admin**](../../../README.md)

***

[talawa-admin](../../../README.md) / [utils/organizationTagsUtils](../README.md) / InterfaceOrganizationSubTagsQuery

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:89](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L89)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:91](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L91)

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:94](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L94)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:59](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L59)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/gautam-divyanshu/talawa-admin/blob/cfee07d9592eee1569f258baf49181c393e48f1b/src/utils/organizationTagsUtils.ts#L61)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
