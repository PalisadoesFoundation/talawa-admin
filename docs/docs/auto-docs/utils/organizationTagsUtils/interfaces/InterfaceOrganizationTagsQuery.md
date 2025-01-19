[Admin Docs](/)

***

# Interface: InterfaceOrganizationTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:77](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L77)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:79](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L79)

#### organizations

> **organizations**: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:82](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L82)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organizations`: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]; \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: [src/utils/organizationTagsUtils.ts:59](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L59)

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: [src/utils/organizationTagsUtils.ts:61](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/utils/organizationTagsUtils.ts#L61)

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
