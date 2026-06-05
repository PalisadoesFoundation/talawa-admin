[Admin Docs](/)

***

# Interface: InterfaceTagFolderChildFoldersQuery

Defined in: [src/utils/organizationTagsUtils.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L64)

## Extends

- `InterfaceBaseQueryResult`

## Properties

### data?

> `optional` **data**: `object`

Defined in: [src/utils/organizationTagsUtils.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L65)

#### tagFolder

> **tagFolder**: [`InterfaceQueryTagFolderChildFolders`](../../interfaces/interfaces/InterfaceQueryTagFolderChildFolders.md)

***

### error?

> `optional` **error**: `ApolloError`

Defined in: [src/utils/organizationTagsUtils.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L25)

#### Inherited from

`InterfaceBaseQueryResult.error`

***

### fetchMore()

> **fetchMore**: (`options`) => `void`

Defined in: [src/utils/organizationTagsUtils.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/organizationTagsUtils.ts#L68)

#### Parameters

##### options

`InterfaceBaseFetchMoreOptions`\<\{ `tagFolder`: [`InterfaceQueryTagFolderChildFolders`](../../interfaces/interfaces/InterfaceQueryTagFolderChildFolders.md); \}\>

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
