[Admin Docs](/)

***

# Variable: MOCKS\_ERROR\_CREATE\_SUB\_TAG

> `const` **MOCKS\_ERROR\_CREATE\_SUB\_TAG**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `getChildTags`: \{ `ancestorTags`: `any`[]; `childTags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; \}; `name`: `string`; \}; \}; \}; \} \| \{ `data?`: \{ `createUserTag`: \{ `_id`: `string`; \}; \}; `error?`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `name`: `string`; `organizationId`: `string`; `parentTagId`: `string`; \}; \}; \})[]

Defined in: [src/screens/SubTags/SubTagsMocks.ts:367](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/SubTags/SubTagsMocks.ts#L367)
