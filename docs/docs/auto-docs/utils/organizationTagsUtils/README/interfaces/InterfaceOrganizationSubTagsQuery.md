[**talawa-admin**](README.md)

***

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:102](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L102)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:104](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L104)

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](utils\interfaces\README\interfaces\InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L61)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:107](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L107)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](utils\interfaces\README\interfaces\InterfaceQueryUserTagChildTags.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:62](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L62)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
