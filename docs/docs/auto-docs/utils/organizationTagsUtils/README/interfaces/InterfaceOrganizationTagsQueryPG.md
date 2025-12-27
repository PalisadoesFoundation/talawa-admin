[**talawa-admin**](README.md)

***

# Interface: InterfaceOrganizationTagsQueryPG

Defined in: [src/utils/organizationTagsUtils.ts:90](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L90)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:92](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L92)

#### organization

> **organization**: [`InterfaceQueryOrganizationUserTagsPG`](utils\interfaces\README\interfaces\InterfaceQueryOrganizationUserTagsPG.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L61)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:95](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/utils/organizationTagsUtils.ts#L95)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organization`: [`InterfaceQueryOrganizationUserTagsPG`](utils\interfaces\README\interfaces\InterfaceQueryOrganizationUserTagsPG.md); \}\>

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
