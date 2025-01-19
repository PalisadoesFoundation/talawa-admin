[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts:300](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts#L300)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `FUND_CAMPAIGN`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `'fundId'`

#### request.variables.orderBy

> **orderBy**: `any` = `null`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name\_contains

> **name\_contains**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getFundById

> **getFundById**: `object`

#### result.data.getFundById.campaigns

> **campaigns**: `any`[] = `[]`

#### result.data.getFundById.isArchived

> **isArchived**: `boolean` = `false`

#### result.data.getFundById.name

> **name**: `string` = `'Fund 1'`
