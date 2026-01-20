[Admin Docs](/)

***

# Variable: MOCKS\_ADMIN

> `const` **MOCKS\_ADMIN**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter`: `string`; `input?`: `undefined`; `userId?`: `undefined`; \}; \}; `result`: \{ `data`: \{ `organizations`: [`InterfaceOrgInfoTypePG`](../../../../../utils/interfaces/interfaces/InterfaceOrgInfoTypePG.md)[]; `user?`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter?`: `undefined`; `input?`: `undefined`; `userId`: `string`; \}; \}; `result`: \{ `data`: \{ `organizations?`: `undefined`; `user`: [`InterfaceUserType`](../../../../../utils/interfaces/interfaces/InterfaceUserType.md); \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter?`: `undefined`; `input`: \{ `first`: `number`; `skip`: `number`; \}; `userId`: `string`; \}; \}; `result`: \{ `data`: \{ `organizations?`: `undefined`; `user`: \{ `__typename`: `string`; `id`: `string`; `name`: `string`; `notifications`: `any`[]; \}; \}; \}; \})[]

Defined in: [src/screens/AdminPortal/OrgList/OrgListMocks.ts:353](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrgList/OrgListMocks.ts#L353)
