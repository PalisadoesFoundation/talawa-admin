[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceOrganizationTagsQueryPG

Defined in: [src/utils/organizationTagsUtils.ts:90](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L90)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:92](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L92)

#### organization

> **organization**: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L61)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:95](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L95)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organization`: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:62](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/organizationTagsUtils.ts#L62)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
