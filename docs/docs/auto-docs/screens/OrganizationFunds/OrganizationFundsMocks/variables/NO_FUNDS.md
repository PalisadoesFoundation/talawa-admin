[Admin Docs](/)

***

# Variable: NO\_FUNDS

> `const` **NO\_FUNDS**: `object`[]

Defined in: [src/screens/OrganizationFunds/OrganizationFundsMocks.ts:173](https://github.com/gautam-divyanshu/talawa-admin/blob/69cd9f147d3701d1db7821366b2c564d1fb49f77/src/screens/OrganizationFunds/OrganizationFundsMocks.ts#L173)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `FUND_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.filter

> **filter**: `string` = `''`

#### request.variables.orderBy

> **orderBy**: `string` = `'createdAt_DESC'`

#### request.variables.organizationId

> **organizationId**: `string` = `'orgId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.fundsByOrganization

> **fundsByOrganization**: `any`[] = `[]`
