[Admin Docs](/)

***

# Variable: MOCKS\_CREATE\_ERROR

> `const` **MOCKS\_CREATE\_ERROR**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `name`: `string`; `tagFolders`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `tags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; \}; \}; `result`: \{ `data`: \{ `createTagFolder`: \{ `id`: `string`; \}; \}; \}; \} \| \{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; \}; \}; \})[]

Defined in: [src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts#L180)
