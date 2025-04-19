[Admin Docs](/)

***

# Variable: getAdvertisementMocks

> `const` **getAdvertisementMocks**: `object`[]

Defined in: [src/components/Advertisements/AdvertisementsMocks.ts:286](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Advertisements/AdvertisementsMocks.ts#L286)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_ADVERTISEMENT_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.after

> **after**: `any` = `null`

#### request.variables.first

> **first**: `number` = `6`

#### request.variables.id

> **id**: `string` = `'1'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.isCompleted

> **isCompleted**: `boolean` = `true`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.advertisements

> **advertisements**: `object`

#### result.data.organization.advertisements.edges

> **edges**: `object`[]

#### result.data.organization.advertisements.pageInfo

> **pageInfo**: `object`

#### result.data.organization.advertisements.pageInfo.endCursor

> **endCursor**: `string` = `'cursor-2'`

#### result.data.organization.advertisements.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `true`

#### result.data.organization.advertisements.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.organization.advertisements.pageInfo.startCursor

> **startCursor**: `string` = `'cursor-1'`
