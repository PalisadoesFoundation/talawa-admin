[Admin Docs](/)

***

# Variable: MOCKS\_SUCCESS\_UPDATE\_USER\_TAG

> `const` **MOCKS\_SUCCESS\_UPDATE\_USER\_TAG**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; `name?`: `undefined`; `sortedBy`: \{ `id`: `string`; \}; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers`: \{ `ancestorTags`: `object`[]; `name`: `string`; `usersAssignedTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; `updateTag?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first?`: `undefined`; `id`: `string`; `name`: `string`; `sortedBy?`: `undefined`; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers?`: `undefined`; `updateTag`: \{ `id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/ManageTag/ManageTagNonErrorMocks.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/ManageTagNonErrorMocks.ts#L48)
