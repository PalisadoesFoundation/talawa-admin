[Admin Docs](/)

***

# Interface: InterfaceOrganizationTagsQuery

Defined in: src/utils/organizationTagsUtils.ts:77

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: src/utils/organizationTagsUtils.ts:79

#### organizations

> **organizations**: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]

***

### error?

> `optional` **error**: `ApolloError`

Defined in: src/utils/organizationTagsUtils.ts:60

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: src/utils/organizationTagsUtils.ts:82

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `organizations`: [`InterfaceQueryOrganizationUserTags`](../../interfaces/interfaces/InterfaceQueryOrganizationUserTags.md)[]; \}\>

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
