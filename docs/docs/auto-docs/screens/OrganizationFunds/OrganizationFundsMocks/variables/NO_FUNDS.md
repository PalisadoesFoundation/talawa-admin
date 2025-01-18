[Admin Docs](/)

***

# Variable: NO\_FUNDS

> `const` **NO\_FUNDS**: `object`[]

Defined in: [src/screens/OrganizationFunds/OrganizationFundsMocks.ts:173](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/OrganizationFunds/OrganizationFundsMocks.ts#L173)

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
