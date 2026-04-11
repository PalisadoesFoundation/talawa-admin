[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `tagFolder`: \{ `childFolders`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; `id`: `string`; `name`: `string`; `parentFolder`: \{ `id`: `string`; `name`: `string`; `parentFolder`: `any`; \}; `tags`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `tags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `folderId?`: `undefined`; `name`: `string`; `organizationId`: `string`; `parentFolderId`: `string`; \}; \}; `result`: \{ `data`: \{ `createTag?`: `undefined`; `createTagFolder`: \{ `id`: `string`; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `folderId`: `string`; `name`: `string`; `organizationId`: `string`; `parentFolderId?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `createTag`: \{ `id`: `string`; \}; `createTagFolder?`: `undefined`; \}; \}; \})[]

Defined in: [src/screens/AdminPortal/Tags/TagsMocks.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Tags/TagsMocks.ts#L90)
