[Admin Docs](/)

***

# Variable: ERROR\_MOCKS

> `const` **ERROR\_MOCKS**: (\{ `error`: `Error`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currentTagId`: `string`; `first?`: `undefined`; `id?`: `undefined`; `selectedTagIds`: `string`[]; `where?`: `undefined`; \}; \}; `result?`: `undefined`; \} \| \{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currentTagId?`: `undefined`; `first`: `number`; `id`: `string`; `selectedTagIds?`: `undefined`; `where`: \{ `name`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `getChildTags?`: `undefined`; `organizations`: `object`[]; \}; \}; \} \| \{ `error?`: `undefined`; `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currentTagId?`: `undefined`; `first`: `number`; `id`: `string`; `selectedTagIds?`: `undefined`; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `getChildTags`: \{ `ancestorTags`: `any`[]; `childTags`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; `name`: `string`; \}; `organizations?`: `undefined`; \}; \}; \})[]

Defined in: [src/components/AdminPortal/TagActions/TagActionsMocks.ts:359](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/TagActions/TagActionsMocks.ts#L359)
