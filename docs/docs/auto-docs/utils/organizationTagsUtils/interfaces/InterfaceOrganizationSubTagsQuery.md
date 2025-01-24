[Admin Docs](/) • **Docs**

***

# Interface: InterfaceOrganizationSubTagsQuery

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

#### getChildTags

> **getChildTags**: [`InterfaceQueryUserTagChildTags`](../../interfaces/interfaces/InterfaceQueryUserTagChildTags.md)

#### Defined in

[src/utils/organizationTagsUtils.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L91)

***

### error?

> `optional` **error**: `ApolloError`

#### Inherited from

`InterfaceBaseQueryResult.error`

#### Defined in

[src/utils/organizationTagsUtils.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L60)

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

#### Parameters

• **options**: `InterfaceBaseFetchMoreOptions`\<`object`\>

#### Returns

`void`

#### Defined in

[src/utils/organizationTagsUtils.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L94)

***

### loading

> **loading**: `boolean`

#### Inherited from

`InterfaceBaseQueryResult.loading`

#### Defined in

[src/utils/organizationTagsUtils.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L59)

***

### refetch()?

> `optional` **refetch**: () => `void`

#### Returns

`void`

#### Inherited from

`InterfaceBaseQueryResult.refetch`

#### Defined in

[src/utils/organizationTagsUtils.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L61)
