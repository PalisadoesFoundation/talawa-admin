[Admin Docs](/)

***

# Variable: MOCKS\_CREATE\_DELAYED

> `const` **MOCKS\_CREATE\_DELAYED**: (\{ `delay?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `input`: \{ `id`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `name`: `string`; `tagFolders`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `delay?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; \}; \}; `result`: \{ `data`: \{ `organization`: \{ `id`: `string`; `tags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; \}; \}; \}; \} \| \{ `delay`: `number`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; \}; \}; `result`: \{ `data`: \{ `createTagFolder`: \{ `id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/AdminPortal/OrganizationTags/RootView/RootViewMocks.ts:210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationTags/RootView/RootViewMocks.ts#L210)
