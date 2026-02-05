[Admin Docs](/)

***

# Interface: InterfaceOrganizationSubTagsQuery

Defined in: [src/utils/organizationTagsUtils.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L99)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L100)

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L103)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `getChildTags`: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md); \}\>

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
