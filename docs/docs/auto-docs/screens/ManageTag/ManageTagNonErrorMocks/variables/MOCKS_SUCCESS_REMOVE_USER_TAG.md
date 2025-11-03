[Admin Docs](/)

***

# Variable: MOCKS\_SUCCESS\_REMOVE\_USER\_TAG

> `const` **MOCKS\_SUCCESS\_REMOVE\_USER\_TAG**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `deleteTag?`: `undefined`; `getAssignedUsers`: \{ `ancestorTags`: `object`[]; `name`: `string`; `usersAssignedTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first?`: `undefined`; `id`: `string`; `sortedBy?`: `undefined`; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `deleteTag`: \{ `id`: `string`; \}; `getAssignedUsers?`: `undefined`; \}; \}; \})[]

Defined in: [src/screens/ManageTag/ManageTagNonErrorMocks.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/ManageTagNonErrorMocks.ts#L86)
