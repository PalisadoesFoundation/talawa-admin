[Admin Docs](/)

***

# Variable: MOCK\_ALL\_VENUE\_DESC

> `const` **MOCK\_ALL\_VENUE\_DESC**: `object`[]

Defined in: [src/screens/OrganizationVenues/OrganizationVenuesMocks.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationVenues/OrganizationVenuesMocks.ts#L78)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `VENUE_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `30`

#### request.variables.id

> **id**: `string` = `'orgId'`

#### request.variables.isInversed

> **isInversed**: `boolean` = `true`

#### request.variables.where

> **where**: `any` = `undefined`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.organization.venues

> **venues**: `object`

#### result.data.organization.venues.edges

> **edges**: `object`[]
