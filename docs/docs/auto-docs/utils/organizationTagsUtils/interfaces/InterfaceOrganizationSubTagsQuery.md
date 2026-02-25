[Admin Docs](/)

***

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L100)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L101)

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L61)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L104)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L62)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
