[Admin Docs](/)

***

# Variable: MOCKS\_WITH\_ERROR

> `const` **MOCKS\_WITH\_ERROR**: (\{ `error`: `undefined`; `request`: \{ `notifyOnNetworkStatusChange`: `boolean`; `query`: `DocumentNode`; `variables`: \{ `filter`: `string`; `first`: `number`; `orderBy`: `string`; `skip`: `number`; `userId`: `undefined`; \}; \}; `result`: \{ `data`: \{ `organizationsConnection`: [`InterfaceOrgInfoTypePG`](../../../../utils/interfaces/interfaces/InterfaceOrgInfoTypePG.md)[]; `user`: `undefined`; \}; \}; \} \| \{ `error`: `undefined`; `request`: \{ `notifyOnNetworkStatusChange`: `undefined`; `query`: `DocumentNode`; `variables`: \{ `filter`: `undefined`; `first`: `undefined`; `orderBy`: `undefined`; `skip`: `undefined`; `userId`: `string`; \}; \}; `result`: \{ `data`: \{ `organizationsConnection`: `undefined`; `user`: [`InterfaceUserType`](../../../../utils/interfaces/interfaces/InterfaceUserType.md); \}; \}; \} \| \{ `error`: `Error`; `request`: \{ `notifyOnNetworkStatusChange`: `undefined`; `query`: `DocumentNode`; `variables`: `undefined`; \}; `result`: `undefined`; \})[]

Defined in: [src/screens/OrgList/OrgListMocks.ts:225](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgList/OrgListMocks.ts#L225)
