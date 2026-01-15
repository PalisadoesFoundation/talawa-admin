[**talawa-admin**](../../../../../README.md)

***

# Variable: MOCKS\_SUCCESS\_UNASSIGN\_USER\_TAG

> `const` **MOCKS\_SUCCESS\_UNASSIGN\_USER\_TAG**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first`: `number`; `id`: `string`; `sortedBy`: \{ `id`: `string`; \}; `tagId?`: `undefined`; `userId?`: `undefined`; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers`: \{ `__typename`: `string`; `ancestorTags`: `object`[]; `name`: `string`; `usersAssignedTo`: \{ `__typename`: `string`; `edges`: `object`[]; `pageInfo`: \{ `__typename`: `string`; `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; `unassignUserTag?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `first?`: `undefined`; `id?`: `undefined`; `sortedBy?`: `undefined`; `tagId`: `string`; `userId`: `string`; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `getAssignedUsers?`: `undefined`; `unassignUserTag`: \{ `__typename`: `string`; `_id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/AdminPortal/ManageTag/ManageTagNonErrorMocks.ts:10](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/AdminPortal/ManageTag/ManageTagNonErrorMocks.ts#L10)
