[Admin Docs](/)

***

# Interface: InterfaceOrganizationTagsQueryPG

Defined in: [src/utils/organizationTagsUtils.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L53)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L54)

#### organization

> **organization**: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L25)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L57)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organization`: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L24)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L26)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
