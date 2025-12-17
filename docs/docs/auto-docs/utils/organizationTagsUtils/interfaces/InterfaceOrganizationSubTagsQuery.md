[Admin Docs](/)

***

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: src/utils/organizationTagsUtils.ts:89

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: src/utils/organizationTagsUtils.ts:91

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: src/utils/organizationTagsUtils.ts:60

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: src/utils/organizationTagsUtils.ts:94

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md); \}\>

#### Returns

`void`

***

### loading

> **loading**: `boolean`

Defined in: src/utils/organizationTagsUtils.ts:59

#### Inherited from

`InterfaceBaseQueryResult.loading`

***

### refetch()?

> `optional` **refetch**: () => `void`

Defined in: src/utils/organizationTagsUtils.ts:61

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`
