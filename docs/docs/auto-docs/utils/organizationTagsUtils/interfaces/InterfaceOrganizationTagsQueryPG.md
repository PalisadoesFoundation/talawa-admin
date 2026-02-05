[Admin Docs](/)

***

# Interface: InterfaceOrganizationTagsQueryPG

Defined in: [src/utils/organizationTagsUtils.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L88)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L89)

#### organization

> **organization**: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L92)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organization`: [`InterfaceQueryOrganizationUserTagsPG`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTagsPG.md); \}\>

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
