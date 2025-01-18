[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter`: `string`; `id`: `undefined`; `isArchived`: `undefined`; `isDefault`: `undefined`; `name`: `undefined`; `orderBy`: `string`; `organizationId`: `string`; `refrenceNumber`: `undefined`; `taxDeductible`: `undefined`; \}; \}; `result`: \{ `data`: \{ `createFund`: `undefined`; `fundsByOrganization`: `object`[]; `updateFund`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter`: `undefined`; `id`: `undefined`; `isArchived`: `boolean`; `isDefault`: `boolean`; `name`: `string`; `orderBy`: `undefined`; `organizationId`: `string`; `refrenceNumber`: `string`; `taxDeductible`: `boolean`; \}; \}; `result`: \{ `data`: \{ `createFund`: \{ `_id`: `string`; \}; `fundsByOrganization`: `undefined`; `updateFund`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `filter`: `undefined`; `id`: `string`; `isArchived`: `boolean`; `isDefault`: `boolean`; `name`: `string`; `orderBy`: `undefined`; `organizationId`: `undefined`; `refrenceNumber`: `string`; `taxDeductible`: `boolean`; \}; \}; `result`: \{ `data`: \{ `createFund`: `undefined`; `fundsByOrganization`: `undefined`; `updateFund`: \{ `_id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/OrganizationFunds/OrganizationFundsMocks.ts:7](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/OrganizationFunds/OrganizationFundsMocks.ts#L7)