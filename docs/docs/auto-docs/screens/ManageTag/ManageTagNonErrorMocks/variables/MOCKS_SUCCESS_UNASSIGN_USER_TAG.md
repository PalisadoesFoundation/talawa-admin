[Admin Docs](/)

***

# Variable: MOCKS\_SUCCESS\_UNASSIGN\_USER\_TAG

> `const` **MOCKS\_SUCCESS\_UNASSIGN\_USER\_TAG**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `assigneeId?`: `undefined`; `first`: `number`; `id`: `string`; `sortedBy`: \{ `id`: `string`; \}; `tagId?`: `undefined`; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers`: \{ `ancestorTags`: `object`[]; `name`: `string`; `usersAssignedTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; `unassignUserTag?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `assigneeId`: `string`; `first?`: `undefined`; `id?`: `undefined`; `sortedBy?`: `undefined`; `tagId`: `string`; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers?`: `undefined`; `unassignUserTag`: \{ `id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/ManageTag/ManageTagNonErrorMocks.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/ManageTagNonErrorMocks.ts#L10)
