[Admin Docs](/)

***

# Variable: MOCKS\_CREATE\_TAG\_ERROR

> `const` **MOCKS\_CREATE\_TAG\_ERROR**: (\{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `tagFolder`: \{ `childFolders`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; `id`: `string`; `name`: `string`; `parentFolder`: \{ `id`: `string`; `name`: `string`; `parentFolder`: `any`; \}; `tags`: \{ `edges`: `object`[]; \}; \}; \}; \}; \} \| \{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `tags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `folderId`: `string`; `name`: `string`; `organizationId`: `string`; \}; \}; `result?`: `undefined`; \})[]

Defined in: [src/screens/AdminPortal/Tags/TagsMocks.ts:238](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/Tags/TagsMocks.ts#L238)
