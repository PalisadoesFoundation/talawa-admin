[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after?`: `undefined`; `first`: `number`; `id`: `string`; `tagId?`: `undefined`; `userIds?`: `undefined`; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `addPeopleToUserTag?`: `undefined`; `getUsersToAssignTo`: \{ `name`: `string`; `usersToAssignTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after`: `string`; `first`: `number`; `id`: `string`; `tagId?`: `undefined`; `userIds?`: `undefined`; `where`: \{ `firstName`: \{ `starts_with`: `string`; \}; `lastName`: \{ `starts_with`: `string`; \}; \}; \}; \}; `result`: \{ `data`: \{ `addPeopleToUserTag?`: `undefined`; `getUsersToAssignTo`: \{ `name`: `string`; `usersToAssignTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `after?`: `undefined`; `first?`: `undefined`; `id?`: `undefined`; `tagId`: `string`; `userIds`: `string`[]; `where?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `addPeopleToUserTag`: \{ `_id`: `string`; \}; `getUsersToAssignTo?`: `undefined`; \}; \}; \})[]

Defined in: [src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts#L5)
