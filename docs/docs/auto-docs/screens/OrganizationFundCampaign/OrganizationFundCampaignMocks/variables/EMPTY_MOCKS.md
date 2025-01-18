[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts:300](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/OrganizationFundCampaign/OrganizationFundCampaignMocks.ts#L300)

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
