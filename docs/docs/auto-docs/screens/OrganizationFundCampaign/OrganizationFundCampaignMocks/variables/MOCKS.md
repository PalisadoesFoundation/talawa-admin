[Admin Docs](/)

***

# Variable: MOCKS

> `const` **MOCKS**: (\{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currency`: `undefined`; `endDate`: `undefined`; `fundId`: `undefined`; `fundingGoal`: `undefined`; `id`: `string`; `name`: `undefined`; `orderBy`: `string`; `organizationId`: `undefined`; `startDate`: `undefined`; `where`: \{ `name_contains`: `string`; \}; \}; \}; `result`: \{ `data`: \{ `createFundraisingCampaign`: `undefined`; `getFundById`: \{ `campaigns`: `object`[]; `isArchived`: `boolean`; `name`: `string`; \}; `updateFundraisingCampaign`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currency`: `string`; `endDate`: `string`; `fundId`: `string`; `fundingGoal`: `number`; `id`: `undefined`; `name`: `string`; `orderBy`: `undefined`; `organizationId`: `string`; `startDate`: `string`; `where`: `undefined`; \}; \}; `result`: \{ `data`: \{ `createFundraisingCampaign`: \{ `_id`: `string`; \}; `getFundById`: `undefined`; `updateFundraisingCampaign`: `undefined`; \}; \}; \} \| \{ `request`: \{ `query`: `DocumentNode`; `variables`: \{ `currency`: `undefined`; `endDate`: `string`; `fundId`: `undefined`; `fundingGoal`: `number`; `id`: `string`; `name`: `string`; `orderBy`: `undefined`; `organizationId`: `undefined`; `startDate`: `string`; `where`: `undefined`; \}; \}; `result`: \{ `data`: \{ `createFundraisingCampaign`: `undefined`; `getFundById`: `undefined`; `updateFundraisingCampaign`: \{ `_id`: `string`; \}; \}; \}; \})[]

Defined in: [src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts:7](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts#L7)
