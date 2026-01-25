[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceOrganizationTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:78](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L78)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:79](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L79)

#### organizations

> **organizations**: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L61)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:82](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L82)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organizations`: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]; \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:62](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/organizationTagsUtils.ts#L62)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
