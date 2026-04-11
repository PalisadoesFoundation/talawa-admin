[Admin Docs](/)

***

# Variable: MOCKS\_CREATE\_FOLDER\_ERROR

> `const` **MOCKS\_CREATE\_FOLDER\_ERROR**: (\{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `tagFolder`: \{ `childFolders`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; `id`: `string`; `name`: `string`; `parentFolder`: \{ `id`: `string`; `name`: `string`; `parentFolder`: `any`; \}; `tags`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `tags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; `parentFolderId`: `string`; \}; \}; `result?`: `undefined`; \})[]

Defined in: [src/screens/AdminPortal/Tags/TagsMocks.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Tags/TagsMocks.ts#L270)
