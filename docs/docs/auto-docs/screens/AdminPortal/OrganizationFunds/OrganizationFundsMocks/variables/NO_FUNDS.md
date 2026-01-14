[Admin Docs](/)

***

# Variable: NO\_FUNDS

> `const` **NO\_FUNDS**: `object`[]

Defined in: [src/screens/AdminPortal/OrganizationFunds/OrganizationFundsMocks.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationFunds/OrganizationFundsMocks.ts#L164)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `FUND_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'orgId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.funds

> **funds**: `object`

#### result.data.organization.funds.edges

> **edges**: `any`[] = `[]`
